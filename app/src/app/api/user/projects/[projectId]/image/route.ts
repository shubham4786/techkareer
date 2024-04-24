import { options } from "@/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { uploadFileFirebase } from "@/lib/firebase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  projectId: string;
};
async function PUT(req: NextRequest, context: { params: Params }) {
  try {
    const projectId = parseInt(context.params.projectId.toString());
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

    const jobSeeker = await db.jobSeeker.findUnique({
      where: { username: session.user.username },
    });
    if (!jobSeeker) {
      return NextResponse.json(
        { error: "Unauthenticated Access!" },
        { status: 401 }
      );
    }
    const formData = await req.formData();
    const image = formData.get("image");
    let uploadedImage =
      image && image instanceof File
        ? await uploadFileFirebase("jobseeker", "project", image)
        : null;

    if (!image || uploadedImage) {
      return NextResponse.json(
        { error: "Bad Request! Missing profilePic field." },
        { status: 400 }
      );
    }

    const updateUser = await db.project.update({
      where: { id: projectId },
      data: { image: uploadedImage },
    });

    return NextResponse.json(
      { message: "Successsfully updated", project: updateUser },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
