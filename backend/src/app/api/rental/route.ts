import { verifyAuth } from "@/lib/verifyAuth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(req: NextRequest) {
  const { ok, decoded, response } = verifyAuth(req);
  if (!ok) return response;

  if (decoded) {
    const userId = decoded.userId;
    const userRentals = await prisma.rental.findMany({
      where: { userId },
      include: {
        bike: true,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    if (userRentals)
      return NextResponse.json(
        { data: userRentals, success: true },
        { status: 200 }
      );
    else
      return NextResponse.json({ success: false, data: null }, { status: 404 });
  }
}
