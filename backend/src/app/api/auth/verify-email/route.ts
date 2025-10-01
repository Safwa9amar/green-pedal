import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    const { email, code } = await req.json();
    if (!email || !code) {
      return withCORS(
        NextResponse.json(
          { message: "Email and code are required." },
          { status: 400 }
        )
      );
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return withCORS(
        NextResponse.json({ message: "User not found." }, { status: 404 })
      );
    }
    if (user.emailConfirmed) {
      return withCORS(
        NextResponse.json(
          { message: "Email already confirmed." },
          { status: 200 }
        )
      );
    }
    if (!user.confirmationCode || !user.confirmationCodeExpires) {
      return withCORS(
        NextResponse.json(
          { message: "No confirmation code found. Please register again." },
          { status: 400 }
        )
      );
    }
    if (user.confirmationCode !== code) {
      return withCORS(
        NextResponse.json(
          { message: "Invalid confirmation code." },
          { status: 400 }
        )
      );
    }
    if (user.confirmationCodeExpires < new Date()) {
      return withCORS(
        NextResponse.json(
          { message: "Confirmation code expired. Please register again." },
          { status: 400 }
        )
      );
    }
    await prisma.user.update({
      where: { email },
      data: {
        emailConfirmed: true,
        confirmationCode: null,
        confirmationCodeExpires: null,
      },
    });
    return withCORS(
      NextResponse.json(
        { message: "Email confirmed! You can now log in." },
        { status: 200 }
      )
    );
  } catch (error) {
    console.log(error);
    return withCORS(
      NextResponse.json(
        { message: "Oops! Something went wrong. Please try again later." },
        { status: 500 }
      )
    );
  }
}
