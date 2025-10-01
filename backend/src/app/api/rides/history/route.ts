import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

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

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return withCORS(
        NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return withCORS(
        NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      );
    }

    const rentals = await prisma.rental.findMany({
      where: { userId: decoded.userId },
      include: { bike: true },
      orderBy: { startTime: "desc" },
    });

    return withCORS(NextResponse.json(rentals));
  } catch {
    return withCORS(
      NextResponse.json({ message: "Internal server error" }, { status: 500 })
    );
  }
}
