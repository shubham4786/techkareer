import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  id: string;
};

export async function GET(request: NextRequest, context: { params: Params }) {
  try {
    const jobId = parseInt(context.params.id);
    const job = await db.jobProfile.findUnique({
      where: { id: jobId },

      include: {
        organization: {
          select: {
            email: true,
            username: true,
            name: true,
            location: true,
            website: true,
            overview: true,
            foundedAt: true,
            profilePic: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        {
          error: `Job Not found with id ${jobId}`,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ job: job }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
