import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Airtable from "airtable";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

interface OpportunitiesRecord {
  Id: number;
  Title: string;
  CompanyName: string;
  CompanyTagline: string;
  CompanyDesc: string;
  CompanyLogo: string;
  Role: string;
  PayRange: string;
  Commitment: string;
  Location: string;
  RoleApplyingFor: string;
  Deadline: string;
  IsActive: boolean;
  JobID: string;
  TweetLink: string;
  Experience: string;
  MinIncome: number;
  MaxIncome: number;
  CreatedAt: string;
}

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY as string,
}).base(process.env.AIRTABLE_BASE_ID as string);
export async function GET(req: NextRequest) {
  try {
    const records: OpportunitiesRecord[] =
      (await fetchDataFromAirtable()) as OpportunitiesRecord[];

    const ids = records.map((record) => record.Id);
    const existingRecords = await db.opportunity.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    const newRecords = records.filter(
      (record) =>
        !existingRecords.some(
          (existingRecord) => existingRecord.id === record.Id
        )
    );
    if (newRecords.length > 0) {
      await db.opportunity.createMany({
        data: newRecords.map((record) => ({
          id: record.Id,
          title: record.Title,
          companyName: record.CompanyName,
          companyTagline: record.CompanyTagline,
          companyDesc: record.CompanyDesc,
          companyLogo: record.CompanyLogo,
          role: record.Role,
          payRange: record.PayRange,
          commitment: record.Commitment,
          location: record.Location,
          roleApplyingFor: record.RoleApplyingFor,
          deadline: record.Deadline ? new Date(record.Deadline) : null,
          isActive: record.IsActive,
          jobID: record.JobID,
          yearsExp: record.Experience,
          minMonthlyPay: record.MinIncome,
          maxMonthlyPay: record.MaxIncome,
          createdAt: new Date(record.CreatedAt),
        })),
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

    base("Opportunities")
      .select({
        view: "All",
        fields: [
          "Name",
          "Company_Name",
          "One-liner",
          "Description",
          "Company Logo",
          "Role",
          "Pay Range",
          "Type",
          "Location",
          "Role applying for",
          "Application Deadline",
          "IsActive",
          "Job ID",
          "Primary Tweet Promotion Link",
          "Years of Experience",
          "Min per month (in INR)",
          "Max per month (in INR)",
          "Created at",
          "id",
        ],
      })
      .eachPage(
        (pageRecords, fetchNextPage) => {
          pageRecords.forEach((record) => {
            const logo = record.get("Company Logo") as Array<any>;
            const companyLogo = logo?.[0]?.url ?? null;
            records.push({
              Id: record.get("id"),
              Title: record.get("Name"),
              CompanyName: record.get("Company_Name"),
              CompanyTagline: record.get("One-liner"),
              CompanyDesc: record.get("Description"),
              CompanyLogo: companyLogo,
              Role: record.get("Role"),
              PayRange: record.get("Pay Range"),
              Commitment: record.get("Type"),
              Location: record.get("Location"),
              RoleApplyingFor: record.get("Role applying for"),
              Deadline: record.get("Application Deadline"),
              IsActive: record.get("IsActive"),
              JobID: record.get("Job ID"),
              TweetLink: record.get("Primary Tweet Promotion Link"),
              Experience: record.get("Years of Experience"),
              MinIncome: record.get("Min per month (in INR)"),
              MaxIncome: record.get("Max per month (in INR)"),
              CreatedAt: record.get("Created at"),
            });
          });
          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error("Error fetching records from Airtable:", err);
            reject(err);
          } else {
            resolve(records);
          }
        }
      );
  });
};
