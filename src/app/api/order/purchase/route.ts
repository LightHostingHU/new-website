import { db } from "@/lib/db";
import {
  checkOrCreatePterodactylUser,
  createPterodactylServer,
} from "@/lib/pterodactyl";
import { generatePassword } from "@/lib/utils";
import {
  checkOrCreateVirtualiozorUser,
  createVirtualizorServer,
} from "@/lib/virtualizor";
import { NextResponse, NextRequest } from "next/server";

interface ServerResponse {
  success: boolean;
  message?: string;
  pterodactyl_id?: string;
  vm_id?: number;
  panel_id?: string;
  vps_name?: number;
}

export async function POST(req: NextRequest) {
  try {
    const {
      username,
      serviceId,
      serviceType,
      serviceName,
      config,
      other,
      price,
    } = await req.json();

    if (
      !username ||
      !serviceType ||
      !serviceId ||
      !serviceName ||
      !config ||
      !price
    ) {
      return NextResponse.json(
        { success: false, message: "Hiányzó kötelező adatok." },
        { status: 400 }
      );
    }

    const configData =
      serviceType === "game"
        ? {
            ram: config["Szerver ram"],
            disk: config["Szerver tárhely"],
            cpu: config["CPU használat"],
            version: config["Szerver verzió"],
            steamtoken: config["Steam fiók token"],
            slot: config["Szerver Slot"],
            beamng: config["BeamNG Szerver Token"],
            backend: config["Verzió"],
          }
        : {
            ram: config["Szerver ram"],
            disk: config["Szerver tárhely"],
            cpu: config["CPU mag"],
            os: config["Operációs rendszer"],
          };

    const [user, lastService] = await Promise.all([
      db.user.findUnique({
        where: { username },
        select: { id: true, money: true, email: true },
      }),
      db.service.findFirst({ orderBy: { id: "desc" }, select: { id: true } }),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Felhasználó nem található." },
        { status: 404 }
      );
    }
    if (user.money < price) {
      return NextResponse.json(
        { success: false, message: "Nincs elegendő pénz.", status: "not_enough_money"},
        { status: 400 }
      );
    }

    let pterodactyl_id: string | undefined;
    let serverResponse: ServerResponse;
    let vm_id: number | undefined;
    let panel_id: string | undefined;
    let vpsname: number | undefined;

    if (serviceType === "game") {
      const pterouser = await checkOrCreatePterodactylUser(user.email);
      serverResponse = await createPterodactylServer(
        pterouser.attributes.id,
        serviceId,
        serviceName,
        configData,
        other,
        price
      );

      if (!serverResponse.success) {
        return NextResponse.json(
          {
            success: false,
            message: `Hiba történt a szerver létrehozásakor: ${serverResponse.message}`,
          },
          { status: 500 }
        );
      }
      pterodactyl_id = serverResponse.pterodactyl_id;
      panel_id = serverResponse.panel_id;
    }

    if (serviceType === "vps") {
      const virtualizorUser = await checkOrCreateVirtualiozorUser(user.email);
      const root_password = generatePassword(16);

      if (!("data" in virtualizorUser) || !virtualizorUser.data) {
        return NextResponse.json(
          { success: false, message: "Invalid Virtualizor user response." },
          { status: 500 }
        );
      }

      if (
        typeof virtualizorUser.data !== "object" ||
        !("uid" in virtualizorUser.data) ||
        !("email" in virtualizorUser.data)
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid Virtualizor user response." },
          { status: 500 }
        );
      }

      const rawServerResponse = await createVirtualizorServer(
        other.server_id,
        virtualizorUser.data.uid as string,
        virtualizorUser.data.email as string,
        configData.os,
        `VPS-${(lastService?.id ?? 0) + 1}`,
        root_password,
        other.storage_id,
        parseInt(configData.disk),
        other.storage_uuid,
        parseInt(configData.ram),
        parseInt(configData.cpu)
      );

      if (rawServerResponse.status !== "success") {
        return NextResponse.json(
          {
            success: false,
            message: `${rawServerResponse.message}`,
          },
          { status: 500 }
        );
      }
      vm_id = Number(rawServerResponse.data?.data?.vs_info.vpsid);
      vpsname = Number(rawServerResponse.data?.data?.vs_info.vps_name);
    }

    await db.service.create({
      data: {
        user_id: user.id,
        service_name: serviceName,
        service_id: serviceId,
        more_info: JSON.stringify(configData),
        price,
        type: serviceType,
        buy_date: new Date(),
        expire_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: "active",
        pterodactyl_id,
        panel_id: panel_id ? parseInt(panel_id, 10) : undefined,
        vm_id: vm_id ? parseInt(vm_id.toString(), 10) : undefined,
        vps_name: vpsname
      },
    });

    await db.user.update({
      where: { id: user.id },
      data: { money: { decrement: price } },
    });
    
    return NextResponse.json(
      { success: true, message: "Szolgáltatás sikeresen létrehozva!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling request:", error);
    console.timeEnd("Total Request Time");
    return NextResponse.json(
      { success: false, message: "Hiba történt a kérés feldolgozásakor." },
      { status: 500 }
    );
  }
}
