import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../../auth/[...nextauth]/option";
import { Connections, Status } from "@prisma/client";
type Params = {
  status: string;
};
export async function GET(request: NextRequest, context: { params: Params }) {
  try {
    const status = context.params.status;
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
    let authUser = await db.jobSeeker.findUnique({
      where: { username: session.user.username },
    });
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthenticated Access!" },
        { status: 401 }
      );
    }

    if (status == "all") {
      let followings = await db.jobSeeker.findMany({
        where: {
          followedBy: {
            some: {
              followingId: authUser.id,
            },
          },
        },
      });
      let followers = await db.jobSeeker.findMany({
        where: {
          following: {
            some: {
              followedById: authUser.id,
            },
          },
        },
      });
      return NextResponse.json(
        { connections: [...followers, ...followings] },
        { status: 200 }
      );
    } else if (status == "accepted") {
      let followings = await db.jobSeeker.findMany({
        where: {
          followedBy: {
            some: {
              followingId: authUser.id,
              status: Status.ACCEPTED,
            },
          },
        },
      });
      let followers = await db.jobSeeker.findMany({
        where: {
          following: {
            some: {
              followedById: authUser.id,
              status: Status.ACCEPTED,
            },
          },
        },
      });

      return NextResponse.json(
        { connections: [...followers, ...followings] },
        { status: 200 }
      );
    } else if (status == "requested") {
      let followings = await db.jobSeeker.findMany({
        where: {
          following: {
            some: {
              followedById: authUser.id,
              status: Status.PENDING,
            },
          },
        },
      });

      return NextResponse.json(
        { connections: [...followings] },
        { status: 200 }
      );
    } else if (status == "requests") {
      let followings = await db.jobSeeker.findMany({
        where: {
          followedBy: {
            some: {
              followingId: authUser.id,
              status: Status.PENDING,
            },
          },
        },
      });
      return NextResponse.json({ connections: followings }, { status: 200 });
    }
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
