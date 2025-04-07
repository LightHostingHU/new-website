import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { parse } from "path";

type  RouteContext = {
  params: Promise<{
    services_id: string;
  }>;
};
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  const serviceId = parseInt((await context.params).services_id);

  await db.service.update({
    where: { id: serviceId },
    data: { status: "canceled" },
  });

  return NextResponse.json({ message: "Service canceled" });
}