import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token: any = req.headers.get("authorization")?.split(" ")[1];

  if (!token) return NextResponse.json({ success: false }, { status: 401 });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET!, (err: any, user: any) => {
    if (err) return NextResponse.json({ success: false }, { status: 403 });

    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1m" }
    );

    NextResponse.json({ accessToken: newAccessToken });
  });
}
