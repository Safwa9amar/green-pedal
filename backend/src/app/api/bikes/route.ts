import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  console.log(req);

  try {
    const bikes = await prisma.bike.findMany({
      where: { status: "AVAILABLE" },
    });
    return NextResponse.json(bikes);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
