import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { token, password } = await request.json();

  try {
    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Érvénytelen vagy lejárt visszaállítási link" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return NextResponse.json(
      {
        message:
          "Jelszó sikeresen frissítve. Mostmár bejelentkezhetsz!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Jelszó visszaállítása sikertelen" },
      { status: 500 }
    );
  }
}
