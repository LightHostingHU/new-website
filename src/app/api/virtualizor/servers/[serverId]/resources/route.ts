import { getVirtualizorServerResourceUsage } from "@/lib/virtualizor";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
    params: Promise<{
        serverId: string;
    }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
    const serverId = (await context.params).serverId;

    try {
        const data = await getVirtualizorServerResourceUsage(serverId);
        console.log(data)
        if (data) {
            return NextResponse.json(data);
        } else {
            return NextResponse.json({ error_message: "Nincs adat." }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error_message: "Váratlan hiba történt" }, { status: 500 });
    }
}