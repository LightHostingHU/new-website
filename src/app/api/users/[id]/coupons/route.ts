import { db } from "@/lib/db";
import { NextRequest } from "next/server";

interface Params {
  id: string;
}

type RouteContext = {
  params: Promise<Params>;
};

interface Row {
  id: number;
  user_id: number;
  code: string;
  discount: number;
  expiry_date: Date;
  is_active: boolean;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const params = context.params;
  const { id: userId } = await params;

  try {;
    const rows: Row[] = await db.$queryRaw<
      Row[]
    >`SELECT id, user_id, code, discount, expire, is_active FROM coupons WHERE user_id = ${userId}`;

    const formattedRows = rows.map((row: Row) => ({
      id: row.id,
      user_id: row.user_id,
      code: row.code,
      discount: row.discount,
      expiry_date: row.expiry_date,
      is_active: row.is_active,
    }));

    return new Response(JSON.stringify(formattedRows), { status: 200 });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  const params = context.params;
  const { id: userId } = await params;
  const { code, discount, expiryDate, isActive } = await req.json();

  if (!code || !discount || !expiryDate) {
    return new Response(JSON.stringify({ error: "All fields are required" }), {
      status: 400,
    });
  }

  try {
    const result = await db.coupons.create({
      data: {
        user_id: parseInt(userId),
        code,
        discount: Number(discount),
        expire: new Date(expiryDate),
        is_active: isActive,
      },
    });

    const newCoupon = {
      id: result.id,
      user_id: result.user_id,
      code: result.code,
      discount: result.discount,
      expire: result.expire,
      is_active: result.is_active,
    };

    return new Response(JSON.stringify(newCoupon), { status: 201 });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
