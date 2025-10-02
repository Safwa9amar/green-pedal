import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function GET(req: NextRequest) {
  const token: any = req.headers.get("authorization")?.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json(
      { message: "Session expired or invalid. Please log in again." },
      { status: 401 }
    );
  }
  return NextResponse.json(
    {
      success: false,
    },
    {
      status: 200,
    }
  );
}
