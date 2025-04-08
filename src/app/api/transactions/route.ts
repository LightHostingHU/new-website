  import { NextResponse } from "next/server";
  import { db } from "@/lib/db";
  import { getServerSession } from "next-auth";
  import { authOptions } from "@/lib/auth";

  export async function GET() {
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const transactions = await db.transactions.findMany({
        where: {
          userId: Number(session.user.id)
        }
      });
    
      return NextResponse.json(transactions);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch transactions" },
        { status: 500 }
      );
    }
  }
