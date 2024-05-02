import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Airtable from "airtable";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

interface UserRecord {
  ID: number;
  Name: string;
  Email: string;
  GitHub: string;
  Resume: string | null;
  LinkedIn: string;
  Role: string[];
  Commitment: string[];
  Opportunity: string;
  Introduction: string;
  Twitter: string;
  MinIncome: number;
  ReferralID: string;
}

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY as string,
}).base(process.env.AIRTABLE_BASE_ID as string);
export async function GET(req: NextRequest) {
  try {
    const records: UserRecord[] =
      (await fetchDataFromAirtable()) as UserRecord[];

    for (const record of records) {
      if (
        !record.Name ||
        record.Name.trim() === "" ||
        !record.Email ||
        record.Email.trim() === ""
      ) {
        console.warn("Skipping record: Name or Email is missing or empty");
        continue;
      }
      if (!record.Role) {
        record.Role = [];
      }
      if (!record.Commitment) {
        record.Commitment = [];
      }

      try {
        const existingRecord = await db.user.findFirst({
          where: {
            id: record.ID,
          },
        });

        if (!existingRecord) {
          await db.user.create({
            data: {
              id: record.ID,
              name: record.Name,
              email: record.Email,
              github: record.GitHub,
              resume: record.Resume,
              linkedin: record.LinkedIn,
              roles: record.Role,
              commitment: record.Commitment,
              introduction: record.Introduction,
              twitter: record.Twitter,
              minIncome: record.MinIncome,
              referralID: record.ReferralID,
            },
          });
        }
      } catch (err) {
        if (err instanceof PrismaClientValidationError) {
          console.error("Validation error:", err.message);
        }
        throw err;
      }
    }

    return NextResponse.json({
      message: "Records fetched successfully",
    });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

const fetchDataFromAirtable = async () => {
  return new Promise((resolve, reject) => {
    const records: any[] = [];

    base("Application Form")
      .select({
        view: "Grid view",
        fields: [
          "ID",
          "Name",
          "Email",
          "GitHub",
          "Resume",
          "What is your LinkedIn profile URL?",
          "Role",
          "Commitment",
          "Introduction / Pitch",
          "What is your Twitter URL?",
          "Minimum expected monthly income (in INR)",
          "Referral ID",
        ],
      })
      .eachPage(
        (pageRecords, fetchNextPage) => {
          pageRecords.forEach((record) => {
            const resume = record.get("Resume") as Array<any>;
            const firstResumeUrl = resume?.[0]?.url ?? null;
            records.push({
              ID: record.get("ID"),
              Name: record.get("Name"),
              Email: record.get("Email"),
              GitHub: record.get("GitHub"),
              Resume: firstResumeUrl,
              LinkedIn: record.get("What is your LinkedIn profile URL?"),
              Role: record.get("Role"),
              Commitment: record.get("Commitment"),
              Opportunity: record.get(
                "Which opportunity are you applying for?"
              ),
              Introduction: record.get("Introduction / Pitch"),
              Twitter: record.get("What is your Twitter URL?"),
              MinIncome: record.get("Minimum expected monthly income (in INR)"),
              ReferralID: record.get("Referral ID"),
            });
          });
          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error("Error fetching records from Airtable:", err);
            reject(err);
          } else {
            console.log("Fetched records from Airtable:", records);
            resolve(records);
          }
        }
      );
  });
};
