import { NextRequest } from "next/server";
import {db} from "@/lib/db";

interface RequestParams {
    id: string;
}

interface UserRow {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    permission: string;
    avatar: string;
}

export async function GET(req: NextRequest, { params }: { params: RequestParams }) {
    const { id: userId } = await params; 

    try {
        const rows = await db.$queryRaw<UserRow[]>`SELECT id, username, firstname, lastname, email, role, avatar FROM user WHERE id = ${userId}`;

        if (rows?.length === 0) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const formattedRows = rows.map((row: UserRow) => ({
            id: row.id,
            username: row.username,
            firstname: row.firstname,
            lastname: row.lastname,
            email: row.email,
            permission: row.permission,
            avatar: row.avatar,
        }));

        return new Response(JSON.stringify(formattedRows), { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: RequestParams }) {
    const {id: userId } =  await params;
    const { firstname, lastname, email, username, permission } = await req.json();

    if (!firstname || !lastname || !email || !username || !permission) {
        return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    try {
        const result = await db.$executeRaw`
            UPDATE users 
            SET firstname = ${firstname}, 
                lastname = ${lastname}, 
                email = ${email}, 
                username = ${username}, 
                permission = ${permission} 
            WHERE id = ${userId}
        `;

        if (!result) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, message: "User updated!" }), { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}