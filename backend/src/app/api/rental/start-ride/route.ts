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

    // check if user already start rental
    const hasRental = await prisma.rental.findFirst({
      where: { userId: decoded.userId, status: "ACTIVE" },
      include: { bike: true },
    });
    if (hasRental?.status === "ACTIVE")
      return NextResponse.json(
        {
          success: true,
          message: "Rental started successfully",
          rental: hasRental,
        },
        { status: 201 }
      );

    const rental = await prisma.rental.create({
      data: {
        startTime: new Date(),
        bikeId,
        status: "ACTIVE",
        userId: decoded.userId,
      },
      include: { bike: true },
    });
    
    await prisma.bike.update({
      where : {id : bikeId},
      data : {status :"IN_USE"}
    })

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
