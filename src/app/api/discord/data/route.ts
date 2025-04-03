import { NextResponse } from "next/server";
import { cookies } from "next/headers";
const jwt = require("jsonwebtoken");

export async function GET(request: Request) {
  const token = (await cookies()).get("auth_token")?.value; 

  let decodedToken = null;
  if (token) {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  }

  const discordConnected = decodedToken ? true : false;
  return NextResponse.json({ discordConnected, decodedToken });
}
