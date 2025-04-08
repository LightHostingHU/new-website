import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const { serviceId, price } = await req.json();

    if (!serviceId || !price) {
        return NextResponse.json({ error: 'Szolgáltatás ID és ár szükséges' }, { status: 400 });
    }

    try {
        const balance = await db.user.findFirst({
            where: {
                id: session?.user.userid,
            },
            select: {
                money: true,
            },
        });

        if (!balance) {
            console.error('Nincs találat a felhasználóra, egyenleg nem megtalálhato');
            return NextResponse.json({ error: 'Nincs találat a felhasználóra' }, { status: 400 });
        }

        if (balance < price) {
            console.error('Nincs elegendő egyenleg a hosszabbításhoz');
            return NextResponse.json({ error: 'Nincs elegendő egyenleg a hosszabbításhoz' }, { status: 400 });
        }

        const currentExpireDate = await db.service.findFirst({
            where: {
                id: serviceId,
            },
            select: {
                expire_date: true,
            },
        });

        if (!currentExpireDate?.expire_date) {
            throw new Error('Current expire date is undefined');
        }
        const newExpireDate = new Date(currentExpireDate.expire_date);
        newExpireDate.setMonth(newExpireDate.getMonth() + 1);    

        // console.log("Service ID:", serviceId);
        // console.log("Current expire date:", currentExpireDate);
        // console.log("New expire date:", newExpireDate);
        await db.service.update({
            where: {
                id: serviceId,
            },
            data: {
                expire_date: newExpireDate,
            },
        });

        return NextResponse.json({ message: 'A szolgáltatás sikeresen meghosszabbítva' }, { status: 200 });
    } catch (error) {
        console.error('Error extending service:', error);
        return NextResponse.json({ error: 'Hiba történt a szolgáltatás meghosszabbítása közben' }, { status: 500 });
    }
}