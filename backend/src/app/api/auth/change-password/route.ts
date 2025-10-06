import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Find the user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Old password is incorrect" },
        { status: 400 }
      );
    }

    // ✅ Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // ✅ Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return NextResponse.json(
      { success: true, message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
