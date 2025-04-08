import { db } from "@/lib/db";
import { NextRequest } from "next/server";

type RouteParams = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(req: NextRequest, context: RouteParams) {
    const userId = (await context.params).id;

    try {
        const user = await db.user.findUnique({
            where: {
                id: Number(userId)
            },
            select: {
                money: true
            }
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(user.money), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    const { id: userId } = await params;
    const { money } = await req.json();

    try {
        const user = await db.user.update({
            where: {
                id: Number(userId)
            },
            data: {
                money: Number(money)
            }
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 }); 
        }
        return new Response(JSON.stringify({ success: true, message: "Balance updated!" }), { status: 200 }); 
    } catch (error) {
        console.error("Error updating balance:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 }); 
    }
}