import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Airtable from "airtable";

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
    const airtableRecords: UserRecord[] =
      (await fetchDataFromAirtable()) as UserRecord[];

    const existingUserIds = await db.user.findMany({
      where: {
        id: { in: airtableRecords.map((record) => record.ID) },
      },
      select: {
        id: true,
      },
    });

    const existingIdsSet = new Set(existingUserIds.map((user) => user.id));
    const usersToCreate = airtableRecords
      .filter((record) => !existingIdsSet.has(record.ID))
      .map(mapUserRecordToDatabaseFormat);

    if (usersToCreate.length > 0) {
      await db.user.createMany({
        data: usersToCreate,
      });
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

const mapUserRecordToDatabaseFormat = (record: UserRecord): any => {
  return {
    id: record.ID,
    name: record.Name,
    email: record.Email,
    github: record.GitHub,
    resume: record.Resume,
    linkedin: record.LinkedIn,
    roles: record.Role || [],
    commitment: record.Commitment || [],
    opportunity: record.Opportunity,
    introduction: record.Introduction,
    twitter: record.Twitter,
    minIncome: record.MinIncome,
    referralID: record.ReferralID,
  };
};
