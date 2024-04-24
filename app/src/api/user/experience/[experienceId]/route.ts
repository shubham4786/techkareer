import { options } from "@/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  experienceId: string;
};

interface Experience {
  role: string;
  company: string;
  techStack: string[];
  startMonth: string;
  startYear: number;
  endMonth?: string | null;
  endYear?: number | null;
}
const isValidYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year <= currentYear;
};

export async function PUT(req: NextRequest, context: { params: Params }) {
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

    const jobSeeker = await db.jobSeeker.findUnique({
      where: { username: session.user.username },
    });
    if (!jobSeeker) {
      return NextResponse.json(
        { error: "Unauthenticated Access!" },
        { status: 401 }
      );
    }
    const body: Experience = await req.json();
    if (!isValidYear(body.startYear)) {
      return NextResponse.json(
        { error: "Invalid Date", message: "Invalid Date" },
        { status: 400 }
      );
    }
    if (body.endMonth && body.endYear) {
      if (!isValidYear(body.endYear)) {
        return NextResponse.json(
          { error: "Invalid Date", message: "Invalid Date" },
          { status: 400 }
        );
      }
    }
    const updatedExperience = await db.experience.update({
      data: { ...body, id: parseInt(context.params.experienceId.toString()) },
      where: { id: parseInt(context.params.experienceId.toString()) },
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
    const deleteExperience = await db.experience.delete({
      where: { id: parseInt(context.params.experienceId.toString()) },
    });
    return NextResponse.json(
      { experience: deleteExperience, message: "Deleted Successfully!" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
