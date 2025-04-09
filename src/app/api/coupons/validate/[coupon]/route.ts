import { db } from "@/lib/db";
import { NextRequest } from "next/server";

type RouteContext = {
    params: Promise<{
        coupon: string;
    }>
}

export async function GET(_: NextRequest, context: RouteContext) {
    const coupon = (await context.params).coupon;

    if (!coupon) {
        return new Response(
            JSON.stringify({ success: false, message: 'A kuponkód szükséges' }),
            { status: 400 }
        );
    }

    try {
        const rows = await db.coupons.findMany({
            where: {
            code: coupon,
            is_active: true,
            expire: {
                gt: new Date(),
            },
            },
        });

        // console.log("rows", rows)
        if (rows.length === 0) {
            return new Response(
                JSON.stringify({ success: false, message: 'Nincs ilyen aktív kupon.' }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, coupon: rows[0] }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Hiba történt a kupon validálása során:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Hiba történt a kérés feldolgozása során.' }),
            { status: 500 }
        );
    }
}
