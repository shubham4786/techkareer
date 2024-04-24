import { options } from "@/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { Connection, ConnectionStatus } from "@/types/type";
import { Connections } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  userId: string;
};
export async function GET(request: NextRequest, context: { params: Params }) {
  try {
    const userId = parseInt(context.params.userId);
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
    let receiver = await db.jobSeeker.findUnique({
      where: { id: userId },
    });
    if (!receiver) {
      return NextResponse.json(
        { error: "Unauthenticated Access!" },
        { status: 401 }
      );
    }
    let connection;
    connection = await db.connections.findUnique({
      where: {
        followingId_followedById: {
          followedById: receiver.id,
          followingId: authUser.id,
        },
      },
    });

    if (!connection) {
      // If the initial delete didn't find a connection, reverse the criteria and try again
      connection = await db.connections.findUnique({
        where: {
          followingId_followedById: {
            followedById: authUser.id,
            followingId: receiver.id,
          },
        },
      });
    }
    if (!connection) {
      return NextResponse.json(
        { connection: { status: ConnectionStatus.FOLLOW } as Connection },
        { status: 200 }
      );
    }

    return NextResponse.json({ connection: connection });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
