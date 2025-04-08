import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/api/discord`);
    const scope = encodeURIComponent("identify email guilds.join");

    return NextResponse.redirect(
      `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`
    );
  }

  try {
    const tokenParams = {
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/discord`,
    };

    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(Object.entries(tokenParams).filter(([_, v]) => v) as [string, string][]).toString(),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(`Discord token error: ${tokenData.error}`);

    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();
    if (!userResponse.ok) throw new Error(`Discord user data error: ${userData.error}`);

    const memberResponse = await fetch(
      `https://discord.com/api/v9/guilds/${process.env.DISCORD_GUILD_ID}/members/${userData.id}/roles/${process.env.DISCORD_ROLE_ID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const discordData = {
      username: userData.username,
      discriminator: userData.discriminator, 
      avatar: userData.avatar, 
    };

    await db.user.update({
      where: {
        email: session?.user.email ?? undefined,
      },
      data: {
        discordData: discordData,
        discord: userData.id, 
      },
    });


    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        avatar: userData.avatar,
        discord_token: tokenData.access_token,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not defined in the environment variables.");
    }
    const response = NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL);
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Hiba történt a Discord hitelesítése során." }, { status: 500 });
  }
}