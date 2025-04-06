import { db } from "@/lib/db";
import Stripe from "stripe";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req: NextRequest): Promise<Response> {
    const sessionLogin = await getServerSession(authOptions);
    if (!sessionLogin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const url = new URL(req.url);
        const sessionId = url.searchParams.get("session_id");

        if (!sessionId) {
            return new Response(JSON.stringify({ error: "Session ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const customerEmail = sessionLogin.user.email;

        if (!customerEmail) {
            return new Response(JSON.stringify({ error: "Customer email is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (session.status === 'complete') {
            await db.user.update({
                where: { email: customerEmail },
                data: {
                    money: {
                        increment: session.metadata && session.metadata.amount ? Number(session.metadata.amount) : 0,
                    },
                },
            });
            return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/szamlazas/success`);
        }

        return new Response(JSON.stringify({ sessionId, customerEmail, session }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "An unexpected error occurred", details: error instanceof Error ? error.message : String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}