import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  console.log("lkjh");

  return NextResponse.json({ xx: "hellow" }, { status: 400 });
}
