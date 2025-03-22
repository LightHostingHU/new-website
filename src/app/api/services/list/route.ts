import { NextResponse } from 'next/server';
import { db } from '@/lib/db';


export async function GET() {
    try {
        const serviceslist = await db.serviceList.findMany();

        const services = serviceslist.map((service) => ({
            ...service,
            options: service.options ? JSON.parse(service.options) : [],
            other: service.other ? JSON.parse(service.other) : {},
            gradientColors: service.gradientColors,
        }));
        return NextResponse.json(services);
    } catch (err) {
        console.error('Database error:', err);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}