import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const serviceId = searchParams.get('name');
        // console.log("Service ID:", serviceId);

        if (!serviceId) {
            return NextResponse.json({ error: 'Service type is required' }, { status: 400 });
        }

        const serviceList = await db.serviceList.findMany({
            where: {
                id: Number(serviceId)
            },
            orderBy: {
                id: 'asc'
            }
        });
        // console.log("Service List:", serviceList);

        const formattedServices = serviceList.flatMap(service => {
            const configs = JSON.parse(service.options);
            const other = JSON.parse(service.other || '{}');
            
            const formattedOptions = configs.map((config: any) => ({
                label: config.label,
                price: config.price,
                min: config.min,
                max: config.max,
                step: config.step,
                default: config.default,
                suffix: config.suffix,
                options: config.options,
                placeholder: config.placeholder
            }));

            return {
                formattedOptions,
                other: other,
            }
        });


        return NextResponse.json(formattedServices);
    } catch (error) {
        console.error('Error fetching config options:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
