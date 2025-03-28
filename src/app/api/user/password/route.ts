import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toast } from "sonner";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !("userid" in session.user)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.userid as string;
    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return new NextResponse("Passwords do not match", { status: 400 });
    }

    const user = await db.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return new NextResponse("Invalid current password", { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await db.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        password: hashedNewPassword,
      },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}