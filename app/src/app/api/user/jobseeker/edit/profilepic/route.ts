import { options } from "@/app/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { uploadFileFirebase } from "@/lib/firebase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthenticated Access!" },
        { status: 401 }
      );
    }
    if (session.user.role != "Jobseeker") {
      return NextResponse.json(
        { error: "Unauthenticated Access!" },
        { status: 401 }
      );
    }
    let jobseeker = await db.jobSeeker.findUnique({
      where: { username: session.user.username },
    });
    if (!jobseeker) {
      return NextResponse.json(
        { error: "Unauthenticated Access!" },
        { status: 401 }
      );
    }
    const formData = await req.formData();
    const profilePic = formData.get("profilePic");
    let uploadedProfilePic =
      profilePic && profilePic instanceof File
        ? await uploadFileFirebase("jobseeker", "profilepic", profilePic)
        : null;

    if (!profilePic) {
      return NextResponse.json(
        { error: "Bad Request! Missing profilePic field." },
        { status: 400 }
      );
    }

    const updateUser=await db.jobSeeker.update({
        where:{username:jobseeker.username},
        data:{profilePic:uploadedProfilePic}
    })
    return NextResponse.json({message:"User Successfully updated!",user:updateUser},{status:200})
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
