import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                username: true,
                firstname: true,
                lastname: true,
                email: true,
                role: true
            }
        });

        const formattedRows = users.map((row) => ({
          id: row.id,
          username: row.username,
          name: `${row.firstname} ${row.lastname}`,
          email: row.email,
          permission: row.role,
        }));

        return new Response(JSON.stringify(formattedRows), { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}