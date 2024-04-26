import { options } from "@/app/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { Application } from "@/types/type";
import { Status } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
type Params = {
  applicationId: string;
  status: string;
};
export async function PUT(req: NextRequest, context: { params: Params }) {
  try {
    const applicationId = parseInt(context.params.applicationId);
    const status = context.params.status;

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
    const application = await db.application.findUnique({
      where: {
        id: applicationId,
      },
    });
    if (!application) {
      return NextResponse.json(
        { error: "No such Application!" },
        { status: 404 }
      );
    }
    const updateApplication = await db.application.update({
      where: { id: application.id },
      data: {
        status: status == "accepted" ? Status.ACCEPTED : Status.REJECTED,
      },
    });
    return NextResponse.json(
      { message: "Updated successfully", application: updateApplication },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
