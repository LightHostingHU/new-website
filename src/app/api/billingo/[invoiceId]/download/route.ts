import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

type RouteContext = {
    params: Promise<{
        invoiceId: string;
    }>;
};

export async function GET(req: NextRequest,  context: RouteContext) {
    const { invoiceId } = await context.params;

    try {
        // 3. Lekérjük a Billingo API-ból a PDF-et
        const response = await axios.get(
            `https://api.billingo.hu/v3/documents/${invoiceId}/download`,
            {
                responseType: "arraybuffer",
                headers: {
                    "x-api-key": process.env.BILLINGO_API_KEY!, // .env-ből ajánlott használni
                },
            }
        );

        // 4. Visszaküldjük a PDF fájlt a válaszban
        return new NextResponse(response.data as ArrayBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="szamla-${invoiceId}.pdf"`,
            },
        });
    } catch (error: any) {
        console.error("Billingo hiba:", error.message);
        return NextResponse.json({ message: "Hiba történt a PDF letöltésénél." }, { status: 500 });
    }
}
