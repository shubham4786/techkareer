import { db } from "@/lib/db";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    id: string
  }
  
export async function GET( request:NextRequest,context: { params: Params }) {
    try {
      
        const id = parseInt(context.params.id)
        const jobseeker=await db.user.findUnique({where:{id:id}})
        if(!jobseeker){
          return NextResponse.json({
            error:`Jobseeker Not found with usernam ${id}`
          },{status:404});
      }
        return NextResponse.json({jobseeker:jobseeker},{status:200});
    } catch (err) {
      return NextResponse.json({ message: err }, { status: 500 });
    }
  }