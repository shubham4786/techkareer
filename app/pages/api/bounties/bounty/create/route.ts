import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        console.log(data);
        const deadline = new Date(data.deadlineDate);
    
        const newBounty = await db.gigs.create({
            data: {
                title: data.title,
                desc: data.description,
                twitterLink: data.twitterLink,
                gigType: data.gigType,
                deadline: deadline,
                userId: parseInt(data.id),
                amount: data.amount,
            },
        });
        return NextResponse.json({ message: "Bounty Created" }, { status: 200 });
    } catch (err: any) {
        console.error("Error creating gig:", err);
        return NextResponse.json({ message: err.message || "An error occurred" }, { status: 500 });
    }
}
