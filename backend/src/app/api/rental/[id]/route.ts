import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "rental ID is required." },
      { status: 400 }
    );
  }

  try {
    const rental = await prisma.rental.findUnique({
      where: { id },
      include: {
        bike: true,
        user: true,
      },
    });

    if (!rental) {
      return NextResponse.json({ error: "Rental not found." }, { status: 404 });
    }

    return NextResponse.json({ rental }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bike:", error);
    return NextResponse.json(
      { error: "Failed to fetch rental details." },
      { status: 500 }
    );
  }
}
