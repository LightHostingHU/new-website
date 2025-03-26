import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    const sessionLogin = await getServerSession(authOptions);

    if (!sessionLogin || !sessionLogin.user) {
        return NextResponse.json({ success: false, message: 'Nincs bejelentkezve.' }, { status: 401 });
    }

    try {
        const user = await db.user.findFirst({
            where: {
                username: sessionLogin.user.username
            },
            select: {
                role: true
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'Nincs ilyen felhasználó.' }, { status: 404 });
        }

        return NextResponse.json(
          { success: true, permissions: user.role },
          { status: 200 }
        );

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Hiba történt a kérés feldolgozása során.' }, { status: 500 });
    }
}