import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deleteVirtualizorServer } from '@/lib/virtualizor';
import { deletePterodactylServer } from '@/lib/pterodactyl';
import {  sendServiceCancellationEmail } from '@/lib/email'; // ez legyen a saját e-mailküldő függvényed

export async function GET(req: NextRequest) {
    const secret = req.nextUrl.searchParams.get("secret");
    if (secret !== process.env.CRON_SECRET) {
        
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const now = new Date();

        const expiredServices = await db.service.findMany({
            where: {
                expire_date: {
                    lt: now,
                },
            },
            include: {
                user: true,
            },
        });

        let deletedCount = 0;

        for (const service of expiredServices) {
            try {
                const user = service.user;

                await sendServiceCancellationEmail(user, service);

                if (service.type === 'vps' && service.vm_id !== null) {
                    await deleteVirtualizorServer(service.vm_id);
                }

                if (service.type === 'game' && service.pterodactyl_id !== null) {
                    await deletePterodactylServer(service.pterodactyl_id);
                }

                await db.service.delete({
                    where: {
                        id: service.id,
                    },
                });

                deletedCount++;
            } catch (e) {
                console.error(`Hiba a(z) ${service.id} szolgáltatás törlésekor:`, e);
            }
        }

        return NextResponse.json({
            message: `${deletedCount} lejárt szolgáltatás törölve és email elküldve.`,
        }, { status: 200 });

    } catch (error) {
        console.error('Hiba az automatikus törlés során:', error);
        return NextResponse.json({ error: 'Hiba történt a lejárt szolgáltatások törlésekor' }, { status: 500 });
    }
}
