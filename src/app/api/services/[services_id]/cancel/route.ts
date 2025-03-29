import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await db.service.update({
    where: { id: parseInt(params.id) },
    data: { status: "canceled" },
  });

  return NextResponse.json({ message: "Service canceled" });
}
