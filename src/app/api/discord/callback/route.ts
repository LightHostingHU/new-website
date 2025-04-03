import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Authorization code is missing" });
  }

  try {
    const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
    const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;

    // Hozzáférési token kérése
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID!,
        client_secret: DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(tokenData.error || "Failed to get access token");
    }

    // Felhasználói adatok lekérése
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error("Failed to get user data");
    }

    // JWT token létrehozása helyett egyszerűen elmentjük a felhasználó adatait
    // Valós alkalmazásban érdemes JWT tokent használni biztonságosabb hitelesítéshez
    const sessionData = {
      user: {
        id: userData.id,
        username: userData.username,
        avatar: userData.avatar,
        email: userData.email,
      },
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expires: Date.now() + tokenData.expires_in * 1000,
    };

    // Session cookie beállítása
    const sessionCookie = serialize(
      "discord_session",
      JSON.stringify(sessionData),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 hét
        path: "/",
      }
    );

    res.setHeader("Set-Cookie", sessionCookie);

    // Átirányítás a főoldalra vagy egy védett oldalra
    res.redirect("/dashboard");
  } catch (error: any) {
    console.error("Authentication error:", error);
    res
      .status(500)
      .redirect(`/error?message=${encodeURIComponent(error.message)}`);
  }
}
