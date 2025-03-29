import { db } from "@/lib/db";
import {
  checkOrCreatePterodactylUser,
  createPterodactylServer,
} from "@/lib/pterodactyl";
import { checkOrCreateVirtualiozorUser, checkVirtualizorUser } from "@/lib/virtualizor";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

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

    let configData
    if (serviceType === 'game'){
      configData = {
        ram: config["Szerver ram"],
        disk: config["Szerver tárhely"],
        cpu: config["CPU használat"],
        version: config["Szerver verzió"],
      };
    } else if (serviceType === 'vps') {
      configData = {
        ram: config["Szerver ram"],
        disk: config["Szerver tárhely"],
        cpu: config["CPU mag"],
        os: config["Operációs rendszer"]
      };
    }


    if (serviceType === 'game'){
      if (
        !config["Szerver ram"] ||
        !config["Szerver tárhely"] ||
        !config["CPU használat"]
      ) {
        return NextResponse.json(
          { success: false, message: "Hiányzó konfigurációs adatok." },
          { status: 400 }
        );
      }
    } else if (serviceType === 'vps') {
      if (
        !config["Szerver ram"] ||
        !config["Szerver tárhely"] ||
        !config["CPU mag"] ||
        !config["Operációs rendszer"]
      ) {
        console.log("Hiányzó konfigurációs adatok.")
        return NextResponse.json(
          { success: false, message: "Hiányzó konfigurációs adatok." },
          { status: 400 }
        );
      }
    }
    const user = await db.user.findUnique({
      where: { username: username },
      select: { id: true, money: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "A megadott felhasználó nem található." },
        { status: 404 }
      );
    }

    // Pterodactyl felhasználó ellenőrzése vagy létrehozása játékszervernél
    let pterouser;
    if (serviceType === "game") {
      pterouser = await checkOrCreatePterodactylUser(user.email);
    }

    let virtualizoruser;
    if (serviceType === "vps") {
      virtualizoruser = await checkOrCreateVirtualiozorUser(user.email);
      console.log('virtualizoruser', virtualizoruser)
      return NextResponse.json(virtualizoruser);
    }

    const userId = user.id;

    if (!user ||  user.money < price) {
      return NextResponse.json(
        { success: false, message: "Nincs elegendő pénz." },
        { status: 400 }
      );
    }

    if (serviceType === "game") {
      const serverResponse = await createPterodactylServer(
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
            message: `Hiba történt a Pterodactyl szerver létrehozásakor: ${serverResponse.message}`,
          },
          { status: 500 }
        );
      } else if (serverResponse.success) {
        // Szerver létrehozása sikeres
        await db.service.create({
          data: {
            user_id: userId,
            service_id: serviceId,
            more_info: JSON.stringify(configData),
            price: price,
            type: serviceType,
            buy_date: new Date(),
            expire_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            status: "active",
            pterodactyl_id: serverResponse.pterodactyl_id,
          },
        });
      }
    } else if (serviceType === "vps") {
      const serverResponse = await createVirtualizorServer(
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
      } else if (serverResponse.success) {
        // Szerver létrehozása sikeres
        await db.service.create({
          data: {
            user_id: userId,
            service_id: serviceId,
            more_info: JSON.stringify(configData),
            price: price,
            type: serviceType,
            buy_date: new Date(),
            expire_date: new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            ),
            status: "active",
            pterodactyl_id: serverResponse.pterodactyl_id,
          },
        });
      }
    }
    
    // Egyenleg csökkentése
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        money: {
          decrement: price,
        },
      },
    });

    return NextResponse.json(
      { success: true, message: "Szolgáltatás vásárlás sikeres!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error purchasing service:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Hiba történt a kérés feldolgozása során.",
      },
      { status: 500 }
    );
  }
}
