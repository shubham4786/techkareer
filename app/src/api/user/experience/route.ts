import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/option";
import { db } from "@/lib/db";

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

export async function GET(req: NextRequest) {
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

    const experiences = await db.experience.findMany({
      where: { jobSeekerId: jobSeeker.id },
    });
    return NextResponse.json({ experiences: experiences }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

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
    const createdExperience = await db.experience.create({
      data: {
        ...body,
        jobSeekerId: jobSeeker.id,
        startYear: parseInt(body.startYear.toString()),
        endYear: body.endYear ? parseInt(body.endYear.toString()) : null,
      },
    });
    return NextResponse.json({ experienc: createdExperience }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
