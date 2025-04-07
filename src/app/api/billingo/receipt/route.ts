import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
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
        console.log("Nyugta data:", nyugtaData);

        const createResponse = await fetch('https://api.billingo.hu/v3/documents/receipt', {
            method: 'POST',
            headers: {
                'X-API-KEY': billingoApiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nyugtaData)
        });

        const data = await createResponse.json()

        console.log(data)

        if (!createResponse.ok) {
            return NextResponse.json({ error: data }, { status: createResponse.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Unexpected error', details: error }, { status: 500 });
    }
}
