import { options } from "@/app/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";
// import formidable from 'formidable';
// import { promises as fs } from 'fs';

// export const config = {
//   api: {
//     bodyParser: false, // Disallow Next.js default body parsing
//   },
// };



export  async function POST(req:NextRequest ){
  try{
    const data = await req.formData()
    console.log(data)
    // const form = new formidable.IncomingForm();

    // const data = await new Promise((resolve, reject) => {
    //   //@ts-ignore
    //   form.parse(req, (err, fields, files) => {
    //     if (err) {
    //       reject(err);
    //       return;
    //     }
    //     resolve({ fields, files });
    //   });
    // });

    // console.log(data);
    // const userUpdate = await db.user.update({
    //     where:{
    //         id: parseInt(data.id)
    //     },
    //     data:{
    //         name:data.name,
    //         twitter:data.twitterProfile,
    //         linkedIn:data.linkedInProfile,
    //         email:data.email,
    //         description:data.description,
    //         resume:data.resume,
    //         github:data.github,
    //         portfolio:data.portfolio,
    //         userType: data.jobseeker ? "jobseeker" : null
    //     }
    // })
    
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