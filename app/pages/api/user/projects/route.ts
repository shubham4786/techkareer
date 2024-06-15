import { NextRequest, NextResponse } from "next/server";
import { ProjectSchema } from "@/utils/zodValidationUtils";
import { uploadFileFirebase } from "@/lib/firebase";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";

export async function POST(req: NextRequest) {
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
    let parsedBody;
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const { image, techStack } = body;
    parsedBody = await ProjectSchema.parseAsync(body);
    let uploadedImage =
      image && image instanceof File
        ? await uploadFileFirebase("jobseeker", "project", image)
        : null;

    const createdProject = await db.project.create({
      data: {
        name: parsedBody.name,
        image: uploadedImage,
        description: parsedBody.description,
        deployedLink: parsedBody.deployedLink,
        repoLink: parsedBody.repoLink,
        techStack: JSON.parse(String(techStack)),
        jobSeekerId: jobseeker.id,
      },
    });
    return NextResponse.json({
        message:"Successfully Created",
        project:createdProject
    },{status:201})
  } catch (err) {
    if (err instanceof Error && err.name == "ZodError") {
      return NextResponse.json(
        { error: err || "Unknown error" },
        { status: 403 }
      );
    }
    console.log(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
