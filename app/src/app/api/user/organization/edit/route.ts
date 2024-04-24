import { options } from "@/app/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req:NextRequest){
    try{
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
      const updateData =await  req.json() ;
      const updatedUser = await db.organization.update({
        where: {username: session.user.username},
        data: {...updateData},
      });
      return NextResponse.json({message:"Successfully Updated",user:updatedUser},{status:200})
    }
    catch (err) {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }