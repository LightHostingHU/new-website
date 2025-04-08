
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { changePterodactylPowerState, checkAndUpdateStatus, getPterodactylServerInfo } from "@/lib/pterodactyl";

type RouteContext = {
  params: Promise<{
    services_id: string;
  }>;
}

export async function POST(
  req: Request,
  context: RouteContext
) {
  try {
    const services_id = (await context.params).services_id;
    const session = await getServerSession(authOptions);
    const serverId = services_id;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await changePterodactylPowerState(serverId.toString(), "restart");
    // console.log('data in restart' ,data);

    const service = await db.service.findFirst({
      where: {
        user_id: Number(session.user.id),
        pterodactyl_id: serverId,
      },
    });

    if (!service) {
      return new NextResponse("Not found", { status: 404 });
    }

    await db.service.update({
      where: {
        id: service.id,
      },
      data: {
        status: "restarting",
      },
    });

    checkAndUpdateStatus(serverId.toString(), service.id.toString());

    return NextResponse.json({ message: "Service restart initiated" });
  } catch (error) {
    console.error("[SERVICES_RESTART]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}