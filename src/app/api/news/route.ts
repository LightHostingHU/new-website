import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface News {
    id: number;
    createdAt: Date;
    title: string;
    description: string;
    admin_id: number;
    admin: {
        firstname: string;
        lastname: string;
        avatar: string;
    };
}

export async function GET(req: NextRequest) {
    try {
        const news: News[] = await db.news.findMany({
            include: {
                admin: {
                    select: {
                        firstname: true,
                        lastname: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const processedNews = news.map(item => ({
            id: item.id.toString(),
            title: item.title,
            description: item.description,
            createdAt: item.createdAt.toISOString(),
            user: {
                name: `${item.admin.firstname} ${item.admin.lastname}`,
                avatar: item.admin.avatar
            }
        }));

        const avatarFilenames = news.map(n => n.admin?.avatar).filter(Boolean);
        if (avatarFilenames.length > 0) {
            const cdn = await db.cdn.findMany({
                where: {
                    filename: { in: avatarFilenames as string[] }
                },
                select: { url: true, filename: true }
            });

            const cdnMap = new Map(cdn.map(item => [item.filename, item.url]));
            processedNews.forEach(item => {
                if (item.user.avatar && cdnMap.has(item.user.avatar)) {
                    item.user.avatar = cdnMap.get(item.user.avatar)!;
                }
            });
        }

        return NextResponse.json(processedNews, { status: 200 });
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}