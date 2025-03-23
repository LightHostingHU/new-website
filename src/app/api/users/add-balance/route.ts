import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { code, amount } = await req.json();

        if (!code || !amount) {
            return NextResponse.json({ success: false, message: 'Hiányzó kód vagy összeg.' }, { status: 400 });
        }

        const coupon = await db.coupons.findFirst({
            where: {
                code: code
            }
        });

        if (!coupon) {
            return NextResponse.json({ success: false, message: 'Nincs ilyen kupon.' }, { status: 404 });
        }

        const userId = coupon.user_id;

        const user = await db.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'Felhasználó nem található.' }, { status: 404 });
        }

        const currentBalance = user.money || 0;
        const newBalance = Math.round(currentBalance + amount); 

        await db.user.update({
            where: {
                id: userId
            },
            data: {
                money: newBalance
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Egyenleg sikeresen frissítve.',
            newBalance,
        }, { status: 200 });
    } catch (error) {
        console.error('Error adding balance:', error);
        return NextResponse.json({ success: false, message: 'Hiba történt az egyenleg feltöltése során.' }, { status: 500 });
    }
}