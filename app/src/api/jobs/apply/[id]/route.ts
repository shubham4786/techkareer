import { options } from "@/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { Status } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  id: string;
};
export async function POST(request: NextRequest, context: { params: Params }) {
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
    const jobId = parseInt(context.params.id);
    const job = await db.jobProfile.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        {
          error: `Job Not found with id ${jobId}`,
        },
        { status: 404 }
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
    const application = await db.application.create({
      data: {
        jobProfileId: job.id,
        jobSeekerId: jobseeker.id,
      },
    });

    return NextResponse.json(
      { message: "Application Successfull created!", application: application },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
