import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { ChargilyWebhookEvent } from "@/lib/types";
import { getIO } from "@/lib/socket";
const io = getIO();

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.CHARGILY_SECRET_KEY as string;
    const signature = req.headers.get("signature");
    const body = await req.text();

    // ✅ Verify signature
    const hash = crypto.createHmac("sha256", secret).update(body).digest("hex");
    if (signature !== hash) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    const event: ChargilyWebhookEvent = JSON.parse(body);
    console.log(event);

    // ✅ Handle successful payment
    if (event.type === "checkout.paid") {
      const checkout = event.data;

      console.log("✅ Payment Successful checkout");

      const amount = checkout.amount;
      const status = checkout.status;
      const paymentId = checkout.id;
      const method = checkout.payment_method ?? "unknown";
      const metadata = checkout.metadata || {};
      const userId = metadata.userId;

      if (!userId || !amount) {
        console.warn("⚠️ Missing userId or amount in metadata");
        return NextResponse.json({ success: false });
      }

      // ✅ Update user balance
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          balance: {
            increment: amount, // amount is already in centimes
          },
        },
      });

      // ✅ Save recharge record
      await prisma.balanceTransaction.create({
        data: {
          amount,
          userId,
          paymentId,
          method,
          status,
          type: "RECHARGE",
        },
      });

      io.emit("balance:update", { userId, newBalance: user.balance });

      console.log(`💰 Updated user ${userId} balance to ${user.balance}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("⚠️ Webhook Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
