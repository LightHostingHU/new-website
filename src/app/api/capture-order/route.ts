import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const sessionLogin = await getServerSession(authOptions);
  if (!sessionLogin || !sessionLogin.user) {
    return NextResponse.json(
      { success: false, message: "Nincs bejelentkezve." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const { orderID } = body;
    if (!orderID) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_CLIENT_SECRET;
    const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL;

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
      console.error("Error: Missing PayPal credentials");
      return NextResponse.json(
        { error: "Missing PayPal credentials" },
        { status: 500 }
      );
    }

    const authResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    const authData = await authResponse.json();

    if (!authData.access_token) {
      return NextResponse.json(
        { error: "Failed to authenticate with PayPal" },
        { status: 500 }
      );
    }

    const captureResponse = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.access_token}`,
        },
      }
    );

    const captureData = await captureResponse.json();

    if (!captureData.id) {
      return NextResponse.json(
        { error: "Failed to capture PayPal payment" },
        { status: 500 }
      );
    }

    if (captureData.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const amount = parseFloat(captureData.purchase_units[0].payments.captures[0].amount.value);
    const currency = captureData.purchase_units[0].payments.captures[0].amount.currency_code;

    await db.user.update({
      where: {
        username: sessionLogin.user.username,
      }, data : {
        money: {
          increment: amount,
        },
      }
    })

    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/billingo/receipt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount,
        email: sessionLogin.user.email
      }),
    });



    return NextResponse.json({ success: true, amount, currency }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}