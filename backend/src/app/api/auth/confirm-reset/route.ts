import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";


function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

export async function POST(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json();
    if (!email || !code || !newPassword) {
      return withCORS(
        NextResponse.json(
          { message: "Email, code, and new password are required." },
          { status: 400 }
        )
      );
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return withCORS(
        NextResponse.json(
          { message: "No user found with this email." },
          { status: 404 }
        )
      );
    }
    if (!user.confirmationCode || !user.confirmationCodeExpires) {
      return withCORS(
        NextResponse.json(
          { message: "No reset code found. Please request a new one." },
          { status: 400 }
        )
      );
    }
    if (user.confirmationCode !== code) {
      return withCORS(
        NextResponse.json({ message: "Invalid reset code." }, { status: 400 })
      );
    }
    if (user.confirmationCodeExpires < new Date()) {
      return withCORS(
        NextResponse.json(
          { message: "Reset code expired. Please request a new one." },
          { status: 400 }
        )
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        confirmationCode: null,
        confirmationCodeExpires: null,
      },
    });
    return withCORS(
      NextResponse.json(
        { message: "Password reset successful! You can now log in." },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error(error);
    return withCORS(
      NextResponse.json(
        { message: "Oops! Something went wrong. Please try again later." },
        { status: 500 }
      )
    );
  }
}
