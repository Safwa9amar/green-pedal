import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getIO } from "@/lib/socket";
import { calculateOngoingRideCost } from "@/lib/calculateRideCost";

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();
    console.log(data);
    
    const rentalID = data?.rentalID;
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!rentalID) {
      return NextResponse.json({ error: "Missing rentalID" }, { status: 400 });
    }
    console.log( { userId: decoded.userId, rentalID, status: "ACTIVE" });
    
    // Find active rental for this user & bike
    const activeRental = await prisma.rental.findUnique({
      where: {  id : rentalID },
      include: { bike: true },
    });
    

    if (!activeRental) {
      return NextResponse.json({ error: "No active rental found for this bike/user." }, { status: 404 });
    }

    // Compute cost and set end time
    const endTime = new Date();
    const { cost } = calculateOngoingRideCost(activeRental.startTime.toISOString());

    // Update rental record
    const updatedRental = await prisma.rental.update({
      where: { id: activeRental.id },
      data: {
        endTime: endTime,
        totalCost: cost,
        status: "COMPLETED",
      },
      include: { bike: true },
    });

    // Set bike available
    await prisma.bike.update({
      where: { id: updatedRental.bikeId },
      data: { status: "AVAILABLE" },
    });

    // Take user balance
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { balance: { decrement: cost } },
    });
    await prisma.balanceTransaction.create({
      data: {
        amount: cost,
        userId: decoded.userId,
        type: "DEDUCTION",
        status: "payed",
        method: "rental",
        paymentId: `rental-${activeRental.id}-${Date.now()}`
      }
    });

    // Optionally, emit via socket if needed (already imported getIO)
    getIO()?.emit("rental:ended", updatedRental);

    return NextResponse.json({ success: true, message: "Rental ended successfully", rental: updatedRental }, { status: 200 });
  } catch (error) {
    console.error("Error creating rental:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
