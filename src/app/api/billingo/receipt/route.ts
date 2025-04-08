import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<Response> {
    const body = await req.json();

    const billingoApiKey = process.env.BILLINGO_API_KEY;

    if (!billingoApiKey) {
        return NextResponse.json({ error: 'API key missing' }, { status: 500 });
    }

    try {
        const nyugtaData = {
            type: "receipt",
            payment_method: "bankcard",
            currency: "HUF",
            block_id: "279699", // ezt állítsd be nálad megfelelőre
            electronic: true,
            fulfillment_date: new Date().toISOString(), // vagy fix dátum pl.: "2025-04-07"
            vat: "AAM", // Alanyi adómentes
            items: [
                {
                    name: "Egyenleg feltöltés",
                    unit_price: body.amount,
                    quantity: 1,
                    unit: "db",
                    vat: "AAM"
                }
            ],
            emails: [body.email],
            name: body.partnerName,
        };

        const createResponse = await fetch('https://api.billingo.hu/v3/documents/receipt', {
            method: 'POST',
            headers: {
                'X-API-KEY': billingoApiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nyugtaData)
        });

        const data = await createResponse.json()
        const user = await db.user.findUnique({
            where: {
                email: body.email
            }
        });
        const existingTransaction = await db.transactions.findFirst({
            where: {
                billingoId: data.id,
                userEmail: body.email,
            }
        });

        if (!existingTransaction) {
            await db.transactions.create({
                data: {
                    amount: body.amount ? Number(body.amount) : 0,
                    userId: user?.id ?? 0,
                    userEmail: body.email,
                    partnerName: body.partnerName,
                    invoiceDate: new Date(),
                    billingoId: data.id ?? "",
                    invoiceNumber: data.invoice_number ?? "",
                    status: data.payment_status ?? "",
                },
            });
        }

        if (!createResponse.ok) {
            return NextResponse.json({ error: data }, { status: createResponse.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Unexpected error', details: error }, { status: 500 });
    }
}
