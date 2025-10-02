import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

// Helper to add CORS headers
function withCORS(response: NextResponse) {
  return response;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return withCORS(
        NextResponse.json(
          { message: "You must be logged in to view your profile." },
          { status: 401 }
        )
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return withCORS(
        NextResponse.json(
          { message: "Session expired or invalid. Please log in again." },
          { status: 401 }
        )
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        balance: true,
        idCardPhoto: true,
        idCardPhotoUrl: true,
        idCardVerified: true,
      },
    });

    if (!user) {
      return withCORS(
        NextResponse.json(
          {
            message:
              "User not found. Please contact support if this is unexpected.",
          },
          { status: 404 }
        )
      );
    }

    return withCORS(NextResponse.json(user));
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
