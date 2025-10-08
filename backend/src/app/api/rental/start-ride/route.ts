import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getIO } from "@/lib/socket";

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();
    const bikeId = data?.bikeId;
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!bikeId) {
      return NextResponse.json({ error: "Missing bikeId" }, { status: 400 });
    }

    // 1️⃣ Create rental record
    const rental = await prisma.rental.create({
      data: {
        startTime: new Date(),
        bikeId,
        status: "ACTIVE",
        userId: decoded.userId,
      },
    });

    // 2️⃣ Get the global socket instance
    const io = getIO();

    // 3️⃣ Start broadcasting elapsed time to the user
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      io.to(`user:${decoded.userId}`).emit("rental:timeUpdate", {
        rentalId: rental.id,
        elapsed,
      });
    }, 1000);

    // Optional stop after a safety timeout (e.g., 1h)
    setTimeout(() => clearInterval(interval), 60 * 60 * 1000);

    return NextResponse.json(
      { success: true, message: "Rental started successfully", rental },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating rental:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
