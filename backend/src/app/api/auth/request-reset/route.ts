import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    const { email } = await req.json();
    if (!email) {
      return withCORS(
        NextResponse.json({ message: "Email is required." }, { status: 400 })
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
    // Generate reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await prisma.user.update({
      where: { id: user.id },
      data: {
        confirmationCode: resetCode,
        confirmationCodeExpires: resetCodeExpires,
      },
    });
    try {
      const { sendConfirmationEmail } = await import("@/lib/email");
      await sendConfirmationEmail(user.email, resetCode);
    } catch (mailErr) {
      console.error("Failed to send reset email", mailErr);
      return withCORS(
        NextResponse.json(
          {
            message:
              "Failed to send reset email. Please try again later or contact support.",
          },
          { status: 500 }
        )
      );
    }
    return withCORS(
      NextResponse.json(
        { message: "A reset code has been sent to your email." },
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
