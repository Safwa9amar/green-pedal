import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { BikeStation } from "@prisma/client";

// GET all stations
export async function GET() {
  try {
    const stations = await prisma.bikeStation.findMany({
      include: {
        bikes: true,
      },
    });
    return NextResponse.json({ stations }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch stations" },
      { status: 500 }
    );
  }
}
