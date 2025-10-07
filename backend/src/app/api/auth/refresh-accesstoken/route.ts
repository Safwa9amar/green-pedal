import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token)
    return NextResponse.json(
      { success: false, message: "No token" },
      { status: 401 }
    );

  try {
    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);

    const newAccessToken = jwt.sign(
      { userId: (user as any).userId },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Invalid refresh token" },
      { status: 403 }
    );
  }
}
