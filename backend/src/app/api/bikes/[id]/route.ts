import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Bike ID is required." },
      { status: 400 }
    );
  }

  try {
    const bike = await prisma.bike.findUnique({
      where: { id },
      include: {
        station: true, // ✅ Example: include station details if related
        specs: true,
      },
    });

    if (!bike) {
      return NextResponse.json({ error: "Bike not found." }, { status: 404 });
    }

    return NextResponse.json({ bike }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bike:", error);
    return NextResponse.json(
      { error: "Failed to fetch bike details." },
      { status: 500 }
    );
  }
}
