import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token');

    const user = await db.user.findUnique({
        where: {
            verificationToken: token || undefined
        }
    });

    if (!user) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
    }

    await db.user.update({
        where: {
            id: user.id
        },
        data: {
            verified: true,
            verificationToken: null
        }
    });

    return NextResponse.json({ message: 'Email cím sikeresen megerősítve' }, { status: 200 });

}