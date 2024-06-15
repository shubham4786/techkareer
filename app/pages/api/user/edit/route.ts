import { options } from "@/app/api/auth/[...nextauth]/option";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();


    if (
      !process.env.R2_ACCESS_KEY_ID || 
      !process.env.R2_SECRET_ACCESS_KEY || 
      !process.env.R2_BUCKET_NAME  || 
      !process.env.R2_ENDPOINT ||
      !process.env.R2_BUCKET_URL
    ) {
    throw new Error("R2 credentials Missing");
  }

    const userId: number = parseInt(data.get("id") as string);
    const name: string = data.get("name") as string;
    const twitterProfile: string = data.get("twitterProfile") as string;
    const linkedInProfile: string = data.get("linkedInProfile") as string;
    const email: string = data.get("email") as string;
    const description: string = data.get("description") as string;
    const github: string = data.get("github") as string;
    const portfolio: string = data.get("portfolio") as string;
    const jobseeker: boolean = data.get("jobseeker") === 'true';

    const s3Client = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });

    const deleteFile = async (key: string) => {
      const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      });
      await s3Client.send(command);
    };

    const uploadFile = async (file: any, key: string) => {
      console.log(file, key)
      const arrayBuffer = await file.arrayBuffer();
      await deleteFile(key);
      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: Buffer.from(arrayBuffer),
        ACL: "public-read",
      });
      await s3Client.send(command);
      const url = `${process.env.R2_BUCKET_URL}${key}`;
      return url;
    };

    let resumeLink: string | undefined;
    let profilePicLink: string | undefined;
    const profilePic = data.get("profilePic");
    console.log(profilePic)
    console.log(typeof profilePic)
    if (typeof profilePic === "object" && profilePic !== undefined) {
      profilePicLink = await uploadFile(profilePic, `profilePic/${userId}`);
    }
    // Check for presence of resume
  
    const resume = data.get("resume");
    if (typeof resume === "object" && resume !== undefined) {
      resumeLink = await uploadFile(resume, `resume/${userId}`);
    }




    // Update user data
    const userUpdate = await db.user.update({
      where: {
        id: userId
      },
      data: {
        name: name,
        twitter: twitterProfile,
        linkedIn: linkedInProfile,
        email: email,
        description: description,
        resume: resumeLink,
        github: github,
        portfolio: portfolio,
        profilePic: profilePicLink,
        userType: jobseeker ? "jobseeker" : null
      }
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (err) {
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
