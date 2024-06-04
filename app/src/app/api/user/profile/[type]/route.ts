import { options } from "@/app/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";
type Params = {
  type: string;
};

export async function GET(req:NextRequest , context :{params:Params}){
  try{
  
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthenticated Access!" },
        { status: 401 }
      );
    }

    const id = context.params.type;

    const user= await db.user.findUnique({
      where:{
        id:parseInt(id)
      }
    })
      return NextResponse.json({ user: user }, { status: 200 });
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

// export async function GET(req: NextRequest, context: { params: Params }) {
//   try {

//     const type = context.params.type;
//     if (type == "jobseeker") {
//       const user = await db.jobSeeker.findUnique({
//         where: {
//           id: parseInt(session.user.id.toString()),
//         },
//       });
//       return NextResponse.json({ user: user }, { status: 200 });
//     } else if (type == "organization") {
//       const organization = await db.organization.findUnique({
//         where: { username: session.user.username },
//       });
//       return NextResponse.json({ user: organization }, { status: 200 });
//     }

//     return NextResponse.json({ message: "User Not found" }, { status: 401 });
  //} 
// }
