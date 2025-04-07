import Stripe from "stripe";
import { NextResponse } from "next/server";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

interface RequestBody {
    amount: number;
    email: string;
}

export async function POST(req: Request): Promise<Response> {
    try {
        const body: RequestBody = await req.json();
        const { amount } = body;

        if (!amount || isNaN(amount)) {
            return NextResponse.json(
                { error: "Érvénytelen összeg" },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "huf",
                        product_data: {
                            name: "Egyenleg feltöltés",
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",

            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/szamlazas/cancel`,
            metadata: {
                amount: amount,
            },
        });

        return NextResponse.json({ id: session.id });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Error creating checkout session" },
            { status: 500 }
        );
    }

}