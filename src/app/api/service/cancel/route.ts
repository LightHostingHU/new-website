import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import axios from 'axios';
import { toast } from 'sonner';
import { deleteVirtualizorServer } from '@/lib/virtualizor';
import { deletePterodactylServer } from '@/lib/pterodactyl';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { serviceId } = body;

    if (!serviceId) {
        return NextResponse.json({ error: 'Szolgáltatás ID szükséges' }, { status: 400 });
    }

    try {
        const service = await db.service.findUnique({
            where: {
                id: serviceId,
            },
            include: {
                user: true,
            },
        });

        if (!service) {
            return NextResponse.json({ error: 'A szolgáltatás nem található' }, { status: 404 });
        }

        const currentDate = new Date();
        const expireDate = new Date(service.expire_date);

        let refundAmount = 0;
        if (expireDate > currentDate) {
            const buyDate = new Date(service.buy_date);
            const totalDays = Math.floor((expireDate.getTime() - buyDate.getTime()) / (1000 * 60 * 60 * 24));
            const remainingDays = Math.floor((expireDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            refundAmount = Math.floor((remainingDays / totalDays) * service.price);
        }

        if (service.type === 'vps'){
            if (service.vm_id !== null) {
                await deleteVirtualizorServer(service.vm_id);
            } else {
                throw new Error('VM ID is null and cannot be deleted.');
            }
        } else if (service.type === 'game') {
            if (service.pterodactyl_id !== null) {
                await deletePterodactylServer(service.pterodactyl_id);
            } else {
                throw new Error('VM ID is null and cannot be deleted.');
            }
        }
        
        if (refundAmount > 0) {
            await db.user.update({
                where: {
                    id: service.user_id,
                },
                data: {
                    money: {
                        increment: refundAmount,
                    },
                },
            });
        }

        await db.service.delete({
            where: {
                id: serviceId,
            },
        });

        
        return NextResponse.json({
            message: refundAmount > 0
                ? `A szolgáltatás sikeresen lemondva. ${refundAmount} Ft visszatérítve az egyenlegére.`
                : 'A szolgáltatás sikeresen lemondva.',
        }, { status: 200 });
    } catch (error) {
        console.error('Error canceling service:', error);
        return NextResponse.json({ error: 'Hiba történt a szolgáltatás lemondása közben' }, { status: 500 });
    }
}