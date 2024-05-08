import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  id: string;
};

export async function GET(request: NextRequest, context: { params: Params }) {
  try {
    const id = parseInt(context.params.id);
    const opportunity = await db.opportunity.findUnique({ where: { id: id } });
    if (!opportunity) {
      return NextResponse.json(
        {
          error: `Opportunity Not found with id ${id}`,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ opportunity: opportunity }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
