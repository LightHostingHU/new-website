import { NextRequest, NextResponse } from "next/server";
import { env } from "process";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();

    const amount = body.amount;
    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_CLIENT_SECRET;
    const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL;

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
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

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "HUF",
            value: amount,
          },
        },
      ],
      application_context: {
        cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/szamlazas`,
        return_url: `${env.NEXT_PUBLIC_BASE_URL}/szamlazas/success-paypal`,
      },
    };

    const orderResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.access_token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const orderData = await orderResponse.json();

    if (!orderData.id) {
      return NextResponse.json(
        { error: "Failed to create PayPal order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: orderData.id }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
