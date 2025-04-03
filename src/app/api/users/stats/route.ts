import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Lekérjük az adatokat, csoportosítva év-hónap szerint
        const userStats = await db.user.groupBy({
            by: ['createdAt'],
            _count: {
                id: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        const userGrowth = userStats.map((stat, index) => {
            const date = new Date(stat.createdAt);
            const month = date.toISOString().slice(0, 7); 

            let growth = 0;
            if (index > 0) {
                const previousCount = userStats[index - 1]._count.id;
                growth = stat._count.id - previousCount;
            }

            return {
                date: month,
                count: stat._count.id,
                growth: growth
            };
        });


        const formattedGrowth = userGrowth.map((stat) => ({
            date: stat.date, 
            count: stat.count,
            growth: stat.growth,
        }));

        console.log(formattedGrowth);
        return NextResponse.json({
            status: 'success',
            data: formattedGrowth
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { status: 'error', message: 'Failed to fetch user statistics' },
            { status: 500 }
        );
    }
}