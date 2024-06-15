import { Talent } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.DEVKIT_AIRTABLE_API_KEY}`,
      },
    };
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.BASE_ID}/Application%20Form?view=Application%20Form`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();
    const TalentData: Talent[] = JSON.parse(data?.records[0]?.fields?.field);

    return NextResponse.json({ TalentData }, { status: 200 });

  } catch (error) {
    console.log("Error fetching job details:", error);
    return NextResponse.json(
      { error: "Error fetching job details" },
      { status: 500 }
    );
  }
}
