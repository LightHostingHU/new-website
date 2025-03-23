import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

interface Service {
  id: string;
  user_id: string;
}

interface ErrorResponse {
  error: string;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const userId = parseInt(session.user.userid, 10)

  try {
    const services = await db.service.findMany({
      where: {
        user_id: userId,
      },
    });

    const formattedServices = services.map((service) => ({
      ...service,
      id: service.id.toString(),
      user_id: service.user_id.toString(),
    }));

    return NextResponse.json(formattedServices, { status: 200 });
} catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}