import { options } from "@/app/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { ConnectionStatus, Connections } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  userId: string;
  action: string;
};
export async function PUT(request: NextRequest, context: { params: Params }) {
  try {
    const userId = parseInt(context.params.userId);
    const action = context.params.action;

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

    let connection: Connections | null = null;
    if (action == "send") {
      let existingConnection;
      existingConnection = await db.connections.findUnique({
        where: {
          followingId_followedById: {
            followedById: authUser.id,
            followingId: receiver.id,
          },
        },
      });
      if (existingConnection) {
        return NextResponse.json(
          { message: "Connection Exists" },
          { status: 400 }
        );
      }
      existingConnection = await db.connections.findUnique({
        where: {
          followingId_followedById: {
            followedById: receiver.id,
            followingId: authUser.id,
          },
        },
      });
      if (existingConnection) {
        return NextResponse.json(
          { message: "Connection Exists" },
          { status: 400 }
        );
      }
      connection = await db.connections.create({
        data: {
          followedById: authUser.id,
          followingId: receiver.id,
        },
      });
    } else if (action == "accept") {
      connection = await db.connections.update({
        where: {
          followingId_followedById: {
            followedById: receiver.id,
            followingId: authUser.id,
          },
        },
        data: {
          status: ConnectionStatus.ACCEPTED,
        },
      });
    } else if (action == "reject") {
      connection = await db.connections.delete({
        where: {
          followingId_followedById: {
            followedById: receiver.id,
            followingId: authUser.id,
          },
        },
      });
    } else if (action == "remove") {
      connection = await db.connections.findUnique({
        where: {
          followingId_followedById: {
            followedById: receiver.id,
            followingId: authUser.id,
          },
        },
      });
      if (connection) {
        await db.connections.delete({
          where: {
            followingId_followedById: {
              followedById: receiver.id,
              followingId: authUser.id,
            },
          },
        });
      } else {
        // If the initial delete didn't find a connection, reverse the criteria and try again
        connection = await db.connections.findUnique({
          where: {
            followingId_followedById: {
              followedById: authUser.id,
              followingId: receiver.id,
            },
          },
        });
        if (connection) {
          connection = await db.connections.delete({
            where: {
              followingId_followedById: {
                followedById: authUser.id,
                followingId: receiver.id,
              },
            },
          });
        }
      }
    } else {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }

    if (!connection) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      connection: connection,
      message: `Successfull connection ${action}`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
