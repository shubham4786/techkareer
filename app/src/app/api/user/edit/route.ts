import { options } from "@/app/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";
export  async function POST(req:NextRequest ){
  try{
    const data= await req.json();
    const userUpdate = await db.user.update({
        where:{
            id: parseInt(data.id)
        },
        data:{
            name:data.name,
            twitter:data.twitterProfile,
            linkedIn:data.linkedInProfile,
            email:data.email,
            description:data.description,
            resume:data.resume,
            github:data.github,
            portfolio:data.portfolio
        }
    })
    
    return NextResponse.json({message:"success"},{status:200})
  }catch (err) {
    if (err instanceof Error && err.name == "ZodError") {
      return NextResponse.json(
        { error: err || "Unknown error" },
        { status: 403 }
      );
    }
    console.log(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}