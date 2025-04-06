import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};
export async function POST(
  req: Request,
  context: RouteContext
) {
  const service = await db.service.findUnique({
    where: { id: parseInt((await context.params).id) },
  });

  if (!service)
    return NextResponse.json({ error: "Not Found" }, { status: 404 });

  const newExpireDate = new Date(service.expire_date);
  newExpireDate.setMonth(newExpireDate.getMonth() + 1);

  await db.service.update({
    where: { id: service.id },
    data: { expire_date: newExpireDate },
  });

  return NextResponse.json({ message: "Service extended" });
}
