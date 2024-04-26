import { options } from "@/app/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { JobProfile } from "@/types/type";
import { JobSeeker, Status } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  status: string;
  jobId: string;
};
export async function GET(req: NextRequest, context: { params: Params }) {
  try {
    const status = String(context.params.status);
    const jobId = parseInt(context.params.jobId);

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
    let jobSeekers: JobSeeker[] = [];
    if (status == "applied") {
      jobSeekers = await db.jobSeeker.findMany({
        where: {
          jobApplications: {
            some: {
              jobProfileId: jobId,
            },
          },
        },
        include: {
          jobApplications: {
            where: { jobProfileId: jobId },
          },
        },
      });
    } else if (
      status == "accepted" ||
      status == "rejected" ||
      status == "pending"
    ) {
      jobSeekers = await db.jobSeeker.findMany({
        where: {
          jobApplications: {
            some: {
              jobProfileId: jobId,
              status:
                status == "accepted"
                  ? Status.ACCEPTED
                  : status == "rejected"
                  ? Status.REJECTED
                  : Status.PENDING,
            },
          },
        },
        include: {
          jobApplications: {
            where: {
              jobProfileId: jobId,
              status:
                status == "accepted"
                  ? Status.ACCEPTED
                  : status == "rejected"
                  ? Status.REJECTED
                  : Status.PENDING,
            },
          },
        },
      });
    }
    return NextResponse.json(
      { status: status, jobseekers: jobSeekers },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
