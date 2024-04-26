import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
type Params = {
  id: string;
};
export async function GET(request: NextRequest, context: { params: Params }) {
  try {
    const orgId= parseInt(context.params.id);
    (orgId)
    const organization = await db.organization.findUnique({
      where: { id: orgId },
    });
    if (!organization) {
      return NextResponse.json(
        { error: "Unauthenticated Access!" },
        { status: 401 }
      );
    }
    const jobs=await db.jobProfile.findMany({
      where: {
        organizationId: organization.id,
      },
      include: {
        organization: {
          select: {
            email: true,
            username: true,
            name: true,
            location: true,
            website: true,
            overview: true,
            foundedAt: true,
            profilePic: true,
          },
        },
      },
    });
    return NextResponse.json({organizationJobs :jobs  }, { status: 200 });

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
