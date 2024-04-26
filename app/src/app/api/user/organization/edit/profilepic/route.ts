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
    if (session.user.role != "Organization") {
      return NextResponse.json(
        { error: "Unauthenticated Access!" },
        { status: 401 }
      );
    }
    let organization = await db.organization.findUnique({
      where: { username: session.user.username },
    });
    if (!organization) {
      return NextResponse.json(
        { error: "Unauthenticated Access!" },
        { status: 401 }
      );
    }
    const formData = await req.formData();
    const profilePic = formData.get("profilePic");
    let uploadedProfilePic =
      profilePic && profilePic instanceof File
        ? await uploadFileFirebase("organization", "profilepic", profilePic)
        : null;

    if (!profilePic) {
      return NextResponse.json(
        { error: "Bad Request! Missing profilePic field." },
        { status: 400 }
      );
    }

    const updateUser = await db.organization.update({
      where: { username: organization.username },
      data: { profilePic: uploadedProfilePic },
    });
    return NextResponse.json(
      { message: "User Successfully updated!", user: updateUser },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
