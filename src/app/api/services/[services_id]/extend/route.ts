import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const service = await db.service.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!service)
    return NextResponse.json({ error: "Not Found" }, { status: 404 });

  const newExpireDate = new Date(service.expire_date);
  newExpireDate.setMonth(newExpireDate.getMonth() + 1); // +1 hónap

  await db.service.update({
    where: { id: service.id },
    data: { expire_date: newExpireDate },
  });

  return NextResponse.json({ message: "Service extended" });
}
