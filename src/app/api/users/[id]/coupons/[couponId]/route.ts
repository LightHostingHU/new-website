import { NextRequest } from "next/server";
import {db} from "@/lib/db";

export async function DELETE(request: NextRequest, { params }: { params: { id: string, couponId: string } }) {
    const { id, couponId } = params;

    try {
        const result = await db.coupons.deleteMany({
            where: {
                id: Number(couponId),
                user_id: Number(id),
            },
        });

        if (result.count === 0) {
            return new Response(
                JSON.stringify({ error: "Kupon nem található" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: "Kupon törölve!" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Hiba a kupon törlése során:", error);
        return new Response(
            JSON.stringify({ error: "Szerverhiba" }),
            { status: 500 }
        );
    }
}