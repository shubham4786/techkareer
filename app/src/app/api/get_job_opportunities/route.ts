import { Job } from "@/lib/types";
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
      `https://api.airtable.com/v0/${process.env.BASE_ID}/Opportunities`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();
    const jobsData: Job[] = JSON.parse(data?.records[0]?.fields?.field);

    return NextResponse.json({ jobsData }, { status: 200 });

  } catch (error) {
    console.log("Error fetching job details:", error);
    return NextResponse.json(
      { error: "Error fetching job details" },
      { status: 500 }
    );
  }
}
