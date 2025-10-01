import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import { z } from "zod";

const prisma = new PrismaClient();

const startRideSchema = z.object({
  bikeId: z.number(),
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

    const body = await req.json();
    const { bikeId } = startRideSchema.parse(body);

    const bike = await prisma.bike.findUnique({ where: { id: bikeId } });
    if (!bike || bike.status !== "AVAILABLE") {
      return withCORS(
        NextResponse.json({ message: "Bike not available" }, { status: 400 })
      );
    }

    const rental = await prisma.rental.create({
      data: {
        userId: decoded.userId,
        bikeId,
        startTime: new Date(),
      },
    });

    await prisma.bike.update({
      where: { id: bikeId },
      data: { status: "IN_USE" },
    });

    return NextResponse.json(rental, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.cause }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
