import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import MychargilyClient from "@/lib/chargilyClient";

export async function GET(req: NextRequest) {
  try {
    // 🔒 1️⃣ Verify Authorization Header
    const authHeader = req.headers.get("authorization");

    if (
      !authHeader ||
      typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    const { searchParams } = new URL(req.url);
    const amount = Number(searchParams.get("amount"));

    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // 🧾 2️⃣ Create checkout (NOT payment link)
    const checkout = await MychargilyClient.createCheckout({
      amount: amount || 1000, // 💰 Amount in centimes (e.g., 50000 = 500 DZD)
      currency: "dzd",
      // success_url: "http://geeenpedal.com",
      success_url: process.env.APP_PAYMENT_STATUS_SUCCESS as string,

      description: "Recharge wallet balance",
      locale: "ar",
      metadata: {
        userId: decoded?.userId,
        createdAt: new Date(),
        success_url: process.env.APP_PAYMENT_STATUS_SUCCESS as string,
        failure_url: process.env.APP_PAYMENT_STATUS_FAILURE as string,
      },
    });

    // 3️⃣ Return checkout URL to frontend
    return NextResponse.json(
      {
        success: true,
        checkout_url: checkout.checkout_url,
        checkout,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Chargily error:", error?.response?.data || error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create checkout",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
