import { options } from "@/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  projectId: string;
};

interface Project {
  name: string;
  description: string;
  deployedLink?: string;
  repoLink?: string;
  techStack: string[];
}

export async function PUT(req: NextRequest, context: { params: Params }) {
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
    const body: Project = await req.json();

    const updatedExperience = await db.project.update({
      data: {
        ...body,
      },
      where: { id: projectId },
    });
    return NextResponse.json(
      { experience: updatedExperience },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
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
    console.log(projectId);
    const deletedProject = await db.project.delete({
      where: { id: projectId },
    });
    return NextResponse.json(
      { project: deletedProject, message: "Deleted Successfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
