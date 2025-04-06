import { NextResponse, NextRequest } from "next/server";
import { getVirtualizorServerRestart } from "@/lib/virtualizor";

type RouteContext = {
  params: Promise<{
    serverId: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const serverId = (await context.params).serverId;
  try {
    const data = await getVirtualizorServerRestart(serverId);
    if (data) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ error_message: "Nincs adat." }, { status: 404 });
    }
  }
  catch (error) {
    return NextResponse.json({ error_message: "Váratlan hiba történt" }, { status: 500 });
  }
}