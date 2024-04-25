import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
interface Params {
  seekerId: string;
}
export async function GET(req: NextRequest, context: { params: Params }) {
  try {
    const jobSeekerId = parseInt(context.params.seekerId);
    const jobSeeker = await db.jobSeeker.findUnique({
      where: { id: jobSeekerId },
    });
    if (!jobSeeker) {
      return NextResponse.json(
        { error: "Unauthenticated Access!" },
        { status: 401 }
      );
    }

    const projects = await db.project.findMany({
      where: { jobSeekerId: jobSeeker.id },
    });
    return NextResponse.json({ projects: projects }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
