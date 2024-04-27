import { db } from "@/lib/db";
import { uploadFileFirebase } from "@/lib/firebase";
import excludePassword from "@/utils/utils";
import { organizationSchema } from "@/utils/zodValidationUtils";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search");

    const organizations = await db.organization.findMany({
      where: !search
        ? {}
        : {
            OR: [
              {
                username: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
    });
    const organizationsWithoutPassword = organizations.map((organization) =>
      excludePassword(organization)
    );

    return NextResponse.json({ organizations: organizationsWithoutPassword });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const body = Object.fromEntries(formData);

    let parsedBody;
    const { profilePic } = body;

    parsedBody = await organizationSchema.parseAsync(body);

    const {
      email,
      password,
      username,
      name,
      location,
      website,
      overview,
      foundedAt,
    } = parsedBody;

    let pfp =
      profilePic && profilePic instanceof File
        ? await uploadFileFirebase("organization", "profilepic", profilePic)
        : null;
    const existingEmail = await db.organization.findUnique({
      where: { email: email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email Already Exists!" },
        { status: 403 }
      );
    }

    const existingUsername = await db.organization.findUnique({
      where: { username: username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username Already Exists!" },
        { status: 403 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.organization.create({
      data: {
        email: email,
        password: hashedPassword,
        username: username,
        name: name,
        location: location,
        website: website ?? null,
        overview: overview,
        foundedAt: foundedAt,
        profilePic: pfp ?? null,
      },
    });
    const { password: savedPassword, ...restBody } = newUser;
    return NextResponse.json(
      { message: "Organization Added", organization: restBody },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof Error && err.name == "ZodError") {
      // Handle ZodError

      return NextResponse.json(
        { error: err || "Unknown error" },
        { status: 403 }
      );
    }
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
