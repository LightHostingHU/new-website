import { db } from "@/lib/db";
import { NextRequest } from "next/server";

interface RouteParams {
    params: {
        id: string;
    }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    const { id } = params;
    const { reason } = await request.json();

    if (!reason) {
        return new Response(
            JSON.stringify({ error: "Minden mező kitöltése kötelező" }),
            { status: 400 }
        );
    }

    try {
        const ban = await db.bans.create({
            data: {
                user_id: Number(id),
                reason: reason
            }
        });

        return new Response(
            JSON.stringify(ban),
            { status: 201 }
        );
    } catch (error) {
        console.error("Hiba a felhasználó bannolása során:", error);
        return new Response(
            JSON.stringify({ error: "Szerverhiba" }),
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const { id } = params;

    try {
        const deletedBan = await db.bans.deleteMany({
          where: {
            user_id: Number(id),
          },
        });

        if (deletedBan.count === 0) {
            return new Response(
                JSON.stringify({ error: "Ban nem található" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: "Ban feloldva!" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Hiba a ban feloldása során:", error);
        return new Response(
            JSON.stringify({ error: "Szerverhiba" }),
            { status: 500 }
        );
    }
}