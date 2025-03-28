import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Hiányzik a visszaállítási token" }, { status: 400 });
  }

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

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Valami hiba történt" },
      { status: 500 }
    );
  }
}
