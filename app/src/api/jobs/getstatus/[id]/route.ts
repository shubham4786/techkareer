import { options } from "@/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  id: number;
};
export async function GET(req: NextRequest, context: { params: Params }) {
  try {
    const jobId = parseInt(context.params.id.toString());
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
    let application = await db.application.findFirst({
      where: {
        jobProfileId: job.id,
        jobSeekerId: jobseeker.id,
      },
    });
    return NextResponse.json({ application: application }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
