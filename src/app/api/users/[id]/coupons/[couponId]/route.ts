import { NextRequest, NextResponse } from "next/server";
import {db} from "@/lib/db";

type RouteContext = {
    params: Promise<{
        id: string;
        couponId: string;
    }>;
};

export async function DELETE(request: NextRequest, context: RouteContext)  {
    const { id, couponId } = await context.params;

    try {
        const result = await db.coupons.deleteMany({
            where: {
                id: Number(couponId),
                user_id: Number(id),
            },
        });

        if (result.count === 0) {
            return new NextResponse(
                JSON.stringify({ error: "Kupon nem található" }),
                { status: 404 }
            );
        }

        return new NextResponse(
            JSON.stringify({ success: true, message: "Kupon törölve!" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Hiba a kupon törlése során:", error);
        return new NextResponse(
            JSON.stringify({ error: "Szerverhiba" }),
            { status: 500 }
        );
    }
}