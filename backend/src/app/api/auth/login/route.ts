import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return withCORS(
        NextResponse.json(
          {
            message:
              "The email or password you entered is incorrect. Please try again.",
          },
          { status: 400 }
        )
      );
    }

    if (!user.emailConfirmed) {
      // Resend confirmation code
      const confirmationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const confirmationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
      await prisma.user.update({
        where: { id: user.id },
        data: { confirmationCode, confirmationCodeExpires },
      });
      try {
        const { sendConfirmationEmail } = await import("@/lib/email");
        await sendConfirmationEmail(user.email, confirmationCode);
        return withCORS(
          NextResponse.json(
            {
              message:
                "Your email is not verified. A new confirmation code has been sent. Please verify your email.",
              requireVerification: true,
              email: user.email,
            },
            { status: 403 }
          )
        );
      } catch (mailErr) {
        console.error("Failed to send confirmation email", mailErr);
        return withCORS(
          NextResponse.json(
            {
              message:
                "Failed to send confirmation email. Please try again later or contact support.",
              requireVerification: false,
              email: user.email,
            },
            { status: 500 }
          )
        );
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return withCORS(
        NextResponse.json(
          {
            message:
              "The email or password you entered is incorrect. Please try again.",
          },
          { status: 400 }
        )
      );
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return withCORS(NextResponse.json({ token }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return withCORS(
        NextResponse.json(
          { message: "Please enter a valid email and password." },
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

export async function GET(req: NextRequest) {
  return NextResponse.json({ cc: "ss" }, { status: 200 });
}
