import { NextResponse, NextMiddleware, NextRequest } from "next/server";
import { verifyToken } from "./auth";

export function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    ok: true,
    decoded,
  };
}
