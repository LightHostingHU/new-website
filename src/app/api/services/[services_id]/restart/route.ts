
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { changePterodactylPowerState } from "@/lib/pterodactyl";

export async function POST(
  req: Request,
  { params }: { params: { services_id: string } }
) {
  try {
    const { services_id } = await params;
    const session = await getServerSession(authOptions);
    const serverId = services_id;

    if (!session) {
      return 
    }

    console.log(serverId)
    const data = await changePterodactylPowerState(serverId, "restart");
    console.log(data)
    // const service = await db.service.findFirst({
    //   where: {
    //     user_id: Number(session.user.userid),
    //     pterodactyl_id: serverId,
    //   },
    // });

    // if (!service) {
    //   return new NextResponse("Not found", { status: 404 });
    // }

    // await db.service.update({
    //   where: {
    //     id: Number(params.serverId),
    //   },
    //   data: {
    //     status: "restarting",
    //   },
    // });

    return NextResponse.json({ message: "Service restart initiated" });
  } catch (error) {
    console.error("[SERVICES_RESTART]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
