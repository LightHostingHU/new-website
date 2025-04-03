import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const token = (await cookies()).get("auth_token")?.value;;
        if (!token) {
            return NextResponse.json(
                { error: "Nincs összekötve a fiókod.", success: false },
                { status: 401 }
            );
        }

        (await cookies()).delete("auth_token");
        const response = NextResponse.json({ success: true });

        return response;
    } catch (error) {
        console.error("Hiba a Discord leválasztásakor:", error);
        return NextResponse.json(
            { error: "Hiba történt a Discord leválasztása során." },
            { status: 500 }
        );
    }
}
