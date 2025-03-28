import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ImgurClient } from "imgur";
import { db } from "@/lib/db";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const imgurClient = new ImgurClient({
  clientId: process.env.IMGUR_CLIENT_ID || "b107b3fb1f1297f",
  clientSecret:
    process.env.IMGUR_CLIENT_SECRET ||
    "77764832283075c653f41bb8b29b172738718e87",
});

const allowedMimeTypes = ["image/jpeg", "image/png", "image/heic"];

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Nem vagy bejelentkezve." },
        { status: 401 }
      );
    }

    const userId = session.user.userid as string;
    const user = await db.user.findUnique({
      where: { id: Number(userId) },
      select: { avatar: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Felhasználó nem található." },
        { status: 404 }
      );
    }

    const cdn = await db.cdn.findFirst({
      where: { filename: user.avatar, user_id: Number(userId) },
      select: { url: true },
    });

    if (!cdn) {
      return NextResponse.json(
        { message: "Profilkép nem található." },
        { status: 404 }
      );
    }

    return NextResponse.json({ avatar: cdn.url }, { status: 200 });
  } catch (error) {
    console.error("Get error:", error);
    return NextResponse.json(
      { message: "Hiba történt a profilkép lekérése közben." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Nem vagy bejelentkezve." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("profileImage") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Nincs megadva fájl." },
        { status: 400 }
      );
    }

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Csak JPG, PNG és HEIC fájl forátum engedélyezett." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resizedImageBuffer = await sharp(buffer)
      .resize(250, 250, {
        fit: "cover",
        position: "entropy",
      })
      .png()
      .toBuffer();

    const filename = `${crypto.randomBytes(12).toString("hex")}.png`;
    const tempFilePath = path.join(process.cwd(), "temp", filename);

    await fs.promises.writeFile(
      tempFilePath,
      new Uint8Array(resizedImageBuffer)
    );

    const imgurResponse = await imgurClient.upload({
      image: fs.createReadStream(tempFilePath) as any,
      type: "stream",
    });

    const userId = session.user.userid as string;
    await db.user.update({
      where: { id: Number(userId) },
      data: { avatar: filename },
    });

    const deletionDate = new Date();

    await db.cdn.create({
      data: {
        filename,
        url: imgurResponse.data.link,
        type: "avatar",
        user_id: Number(userId),
        deletion_date: deletionDate,
        delete_hash: imgurResponse.data.deletehash || "",
        expire: new Date(deletionDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    setTimeout(async () => {
      try {
        await fs.promises.unlink(tempFilePath);
      } catch (error) {
        console.error("Error deleting temp file:", error);
      }
    }, 5000);

    return NextResponse.json(
      { message: "Sikeresen fel lett tölve a proflképed." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Hiba történt a kép feldolgozás közben." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Nem vagy bejelentkezve." },
        { status: 401 }
      );
    }

    const data = await request.json();
    const current_picture = data.current_picture;

    if (current_picture === "default.png") {
      return NextResponse.json(
        { message: "Jelenleg nincs egyedi profilképed." },
        { status: 400 }
      );
    }

    const userId = session.user.userid as string;
    await db.user.update({
      where: { id: Number(userId) },
      data: { avatar: "default.png" },
    });

    const deletionDate = new Date();

    await db.user.update({
      where: { id: Number(userId) },
      data: { avatar: current_picture },
    });

    return NextResponse.json(
      { message: "Sikeresen törölve lett a proflképed." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { message: "Hiba történt a törlés közben." },
      { status: 500 }
    );
  }
}
