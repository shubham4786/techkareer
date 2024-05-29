import { db } from "@/lib/db";
import next from "next";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  id: string;
};

export async function GET(request: NextRequest, context: { params: Params }) {
  try {
    const id = parseInt(context.params.id);
    const bounty = await db.gigs.findUnique({ where: { id: id } });
    if (!bounty) {
      return NextResponse.json(
        {
          error: `Bounty Not found with id ${id}`,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ bounty: bounty }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}


export async function POST(request:NextRequest, context:{params:Params}){
  try{
    const body = await request.json()
    await db.submission.create({
      data:{
        userId:parseInt(body.userId),
        gigId: parseInt(context.params.id),
        name:body.name,
        twitterProfile:body.twitterProfile,
        linkedInProfile:body.linkedInProfile,
        submissionLink:body.submissionLink,
        feedbacks:body.notes,
        upiId:body.upiId,
      }
    })
   
   await db.user.update({
      where:{
        id:parseInt(body.userId)
      },
      data:{
        twitter:body.twitterProfile,
        linkedIn:body.linkedInProfile
      }
    })
    return NextResponse.json({message:"success"},{status:200})
  }catch(err:any){
    if(err.code === "P2002"){
      return NextResponse.json({message:"Submission already exists"},{status:403})
    }
    return NextResponse.json({message:err},{status:500})
  }
}