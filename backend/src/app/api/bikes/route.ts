import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export async function GET(req: NextRequest) {
  try {
    const bikes = await prisma.bike.findMany({
      where: { status: "AVAILABLE" },
    });
    return withCORS(NextResponse.json(bikes));
  } catch (error) {
    console.log(error);
    return withCORS(
      NextResponse.json({ message: "Internal server error" }, { status: 500 })
    );
  }
}
