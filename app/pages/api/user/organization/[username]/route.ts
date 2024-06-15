import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  username: string;
};

export async function GET(request: NextRequest, context: { params: Params }) {
  try {
    const username = context.params.username;
    const organization = await db.organization.findUnique({
      where: { username: username },
    });
    if (!organization) {
      return NextResponse.json(
        {
          error: `Organization Not found with username ${username}`,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ organization: organization }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
