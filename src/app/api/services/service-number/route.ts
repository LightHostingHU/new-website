
import { db } from "@/lib/db"; 

export async function GET() {
    try {
        const rows = await db.service.count();

        return new Response(JSON.stringify({ count: rows }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch service count' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
