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
      const updateData =await  req.json() ;
      const updatedUser = await db.jobSeeker.update({
        where: {username: session.user.username},
        data: {...updateData},
      });
      return NextResponse.json({message:"Successfully Updated",user:updatedUser},{status:200})
    }
    catch (err) {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }