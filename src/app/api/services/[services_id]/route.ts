import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";


type RouteContext = {
  params: Promise<{
    services_id: string;
  }>;
};

export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  const services_id = (await context.params).services_id;

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
