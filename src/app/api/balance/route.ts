import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, res: Response): Promise<Response> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await db.user.findUnique({
            where: {
                email: session.user.email ?? undefined,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ balance: user.money }, { status: 200 });
    } catch (error) {
        console.error("Error fetching balance:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}