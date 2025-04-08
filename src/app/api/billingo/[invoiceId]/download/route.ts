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
        const response = await axios.get(
            `https://api.billingo.hu/v3/documents/${invoiceId}/download`,
            {
                responseType: "arraybuffer",
                headers: {
                    "x-api-key": process.env.BILLINGO_API_KEY!,
                },
            }
        );

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
