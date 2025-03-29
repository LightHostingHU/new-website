import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { services_id: string } }
) {
  const { services_id } = await params;

  try {
    const serviceId = parseInt(services_id);

    if (isNaN(serviceId)) {
      return NextResponse.json({ error: "Érvénytelen ID" }, { status: 400 });
    }

    const service = await db.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Szolgáltatás nem található" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: "Szerverhiba" }, { status: 500 });
  }
}
