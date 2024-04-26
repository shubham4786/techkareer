import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
interface Params{
    jobseekerId:string
}
export async function GET(req: NextRequest,context: { params: Params }){
    try {
       const jobSeekerId= parseInt(context.params.jobseekerId)
    const jobSeeker = await db.jobSeeker.findUnique({
        where: { id:jobSeekerId },
      });
      if (!jobSeeker) {
        return NextResponse.json(
          { error: "Unauthenticated Access!" },
          { status: 401 }
        );
      }

      const experiences=await db.experience.findMany({
        where:{jobSeekerId:jobSeeker.id},
       
      })
      return NextResponse.json({experiences:experiences},{status:200})
    }catch(err){
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
