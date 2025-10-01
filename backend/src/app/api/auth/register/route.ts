import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  // Helper to add CORS headers
  function withCORS(response: NextResponse) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return response;
  }

  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return withCORS(
        NextResponse.json(
          {
            message:
              "An account with this email already exists. Please log in or use a different email.",
          },
          { status: 400 }
        )
      );
    }

    // Generate confirmation code
    const confirmationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const confirmationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailConfirmed: false,
        confirmationCode,
        confirmationCodeExpires,
      },
    });

    // Send confirmation email
    let emailSent = true;
    try {
      const { sendConfirmationEmail } = await import("@/lib/email");
      await sendConfirmationEmail(email, confirmationCode);
    } catch (mailErr) {
      console.error("Failed to send confirmation email", mailErr);
      emailSent = false;
    }

    if (!emailSent) {
      // Option 1: Delete user and reject registration
      await prisma.user.delete({ where: { email } });
      return withCORS(
        NextResponse.json(
          {
            message:
              "Failed to send confirmation email. Please try registering again.",
            retry: true,
          },
          { status: 500 }
        )
      );
    }

    return withCORS(
      NextResponse.json(
        {
          message:
            "Registration successful! Please check your email for a confirmation code.",
        },
        { status: 201 }
      )
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return withCORS(
        NextResponse.json(
          {
            message:
              "Please enter a valid name, email, and password (min 6 characters).",
          },
          { status: 400 }
        )
      );
    }
    console.log(error);
    return withCORS(
      NextResponse.json(
        { message: "Oops! Something went wrong. Please try again later." },
        { status: 500 }
      )
    );
  }
}
