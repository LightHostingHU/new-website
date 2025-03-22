import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, serviceId, serviceType, config, price } =
      await req.json();

    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Felhasználó nem található." },
        { status: 404 }
      );
    }

    const userId = user.id;
    const userBalance = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        money: true,
      },
    });

    console.log(userBalance)

    if (!userBalance || userBalance.money < price) {
      return NextResponse.json(
        { success: false, message: "Nincs elegendő pénz." },
        { status: 400 }
      );
    }

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

    await db.service.create({
      data: {
        user_id: userId,
        service_id: serviceId,
        more_info: JSON.stringify(config),
        price: price,
        type: serviceType,
        buy_date: new Date(),
        expire_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: "active",
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
