import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { BikeStation } from "@prisma/client";

// CREATE station
export async function POST(req: NextRequest) {
  try {
    const data: BikeStation = await req.json();
    const station = await prisma.bikeStation.create({ data });
    return NextResponse.json({ station }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create station" },
      { status: 500 }
    );
  }
}

// GET all stations
export async function GET() {
  try {
    const stations = await prisma.bikeStation.findMany();
    return NextResponse.json({ stations }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch stations" },
      { status: 500 }
    );
  }
}

// UPDATE station by id
export async function PUT(req: NextRequest) {
  try {
    const { id, ...data } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Station ID is required" },
        { status: 400 }
      );
    }

    const station = await prisma.bikeStation.update({
      where: { id },
      data,
    });

    return NextResponse.json({ station }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update station" },
      { status: 500 }
    );
  }
}

// DELETE station by id
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Station ID is required" },
        { status: 400 }
      );
    }

    await prisma.bikeStation.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Station deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete station" },
      { status: 500 }
    );
  }
}
