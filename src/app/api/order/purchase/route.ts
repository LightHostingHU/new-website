import { db } from "@/lib/db";
import {
  checkOrCreatePterodactylUser,
  createPterodactylServer,
} from "@/lib/pterodactyl";
import { checkOrCreateVirtualiozorUser, checkVirtualizorUser, createVirtualizorServer } from "@/lib/virtualizor";
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
        steamtoken: config["Steam fiók token"],
        slot: config["Szerver Slot"],
        beamng: config["BeamNG Szerver Token"],
        backend: config["Verzió"]
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
      if (other?.variables){
        const option3Key = Object.keys(other.variables).find(keys => other.variables[keys] === '{{option3}}');

        if (option3Key){
          const possibleValues =  [
            configData?.version,
            configData?.steamtoken,
            configData?.slot,
            configData?.beamng,
          ];

          const option3Value = possibleValues.find((value) => value !== undefined) ?? '';
          other.variables[option3Key] = option3Value;
        }
      }
    }

    if (serviceType === 'game'){
      console.log("config", config);
      if (
        !config["Szerver ram"] ||
        !config["Szerver tárhely"] ||
        !config["CPU használat"] ||
        !config["Szerver verzió"] &&
        !config["Steam fiók token"] &&
        !config["Szerver Slot"] &&
        !config["BeamNG Szerver Token"] &&
        !config["Verzió"]
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
      // console.log('virtualizoruser', virtualizoruser)
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
      console.log(serviceId);
      if (!virtualizoruser) {
        return NextResponse.json(
          { success: false, message: "Virtualizor user could not be created or found." },
          { status: 500 }
        );
      }
      
      
      const lastService = await db.service.findFirst({
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
        }
      }) || { id: 0 }

      const storageUUID = other.storage_uuid;
      const serverId = other.server_id;
      const storageId = other.storage_id;
      const root_password = Math.random().toString(16).substring(2, 15).substring(0, 8);

      if (!('data' in virtualizoruser) || !virtualizoruser.data) {
        return NextResponse.json(
          { success: false, message: "Invalid Virtualizor user response." },
          { status: 500 }
        );
      }

      if (typeof virtualizoruser.data !== 'object' || !('uid' in virtualizoruser.data) || !('email' in virtualizoruser.data)) {
        return NextResponse.json(
          { success: false, message: "Invalid Virtualizor user response." },
          { status: 500 }
        );
      }

      const serverResponse = await createVirtualizorServer(
        serverId,
        virtualizoruser.data.uid as string,
        virtualizoruser.data.email as string,
        configData?.os,
        `VPS-${lastService?.id}`,
        root_password,
        storageId,
        parseInt(configData?.disk),
        storageUUID,
        parseInt(configData?.ram),
        parseInt(configData?.cpu)
      )
      console.log('serverResponse', serverResponse)

      // if (!serverResponse.success) {
      //   return NextResponse.json(
      //     {
      //       success: false,
      //       message: `Hiba történt a szerver létrehozásakor: ${serverResponse.message}`,
      //     },
      //     { status: 500 }
      //   );
      // } else if (serverResponse.success) {
      //   // Szerver létrehozása sikeres
      //   await db.service.create({
      //     data: {
      //       user_id: userId,
      //       service_id: serviceId,
      //       more_info: JSON.stringify(configData),
      //       price: price,
      //       type: serviceType,
      //       buy_date: new Date(),
      //       expire_date: new Date(
      //         new Date().setMonth(new Date().getMonth() + 1)
      //       ),
      //       status: "active",
      //       pterodactyl_id: serverResponse.pterodactyl_id,
      //     },
      //   });
      // }
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
