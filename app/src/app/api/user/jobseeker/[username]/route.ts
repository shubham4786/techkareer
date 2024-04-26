import { db } from "@/lib/db";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    username: string
  }
  
export async function GET( request:NextRequest,context: { params: Params }) {
    try {
      
        const username = context.params.username
        const jobseeker=await db.jobSeeker.findUnique({where:{username:username}})
        if(!jobseeker){
          return NextResponse.json({
            error:`Jobseeker Not found with usernam ${username}`
          },{status:404});
      }
        return NextResponse.json({jobseeker:jobseeker},{status:200});
    } catch (err) {
      return NextResponse.json({ message: err }, { status: 500 });
    }
  }