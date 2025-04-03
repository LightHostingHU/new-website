import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Ha ez az e-mail létezik a rendszerünkben, jelszó-visszaállítási linket fog kapni.",
        },
        { status: 200 }
      );
    }

    const token = generateToken();
    const expires = new Date(Date.now() + 3600000);

    await db.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      },
    });

    await sendPasswordResetEmail(email, token);

    return NextResponse.json(
      {
        message:
          "Ha ez az e-mail létezik a rendszerünkben, jelszó-visszaállítási linket fog kapni.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "A kérés feldolgozása sikertelen. Kérjük, próbálja újra később." },
      { status: 500 }
    );
  }
}