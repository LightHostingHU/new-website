import { getPterodactylServerResourceUsage } from "@/lib/pterodactyl";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { serverId: string } }) {
    const { serverId } = await params;

    try {
        const data = await getPterodactylServerResourceUsage(serverId);
        if (data) {
            return NextResponse.json(data);
        } else {
            return NextResponse.json({ error_message: "Nincs adat." }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error_message: "Váratlan hiba történt" }, { status: 500 });
    }
}
