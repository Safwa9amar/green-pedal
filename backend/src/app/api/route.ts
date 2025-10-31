import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { sendConfirmationEmail } = await import("@/lib/email");
  const email = "hassani.hamza.0397@gmail.com";
  const confirmationCode = "1234asdasd56";
  await sendConfirmationEmail(email, confirmationCode);
  return new Response("API is running");
}
