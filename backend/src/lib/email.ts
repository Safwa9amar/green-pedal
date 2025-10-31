import nodemailer from "nodemailer";

export async function sendConfirmationEmail(to: string, code: string) {
  // Validate environment variables
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  console.log("Sending confirmation email to:", to);

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error("❌ Missing SMTP environment variables.");
    throw new Error("SMTP configuration is incomplete");
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465 (SSL), false otherwise
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: SMTP_FROM || `"Green Pedal" <${SMTP_USER}>`,
    to,
    subject: "Confirm your email address",
    text: `Your confirmation code is: ${code}`,
    html: `
      <div style="font-family:Arial, sans-serif; line-height:1.6;">
        <h2>Welcome to Green Pedal 🌿</h2>
        <p>Your email confirmation code is:</p>
        <p style="font-size:18px; font-weight:bold; color:#2e7d32;">${code}</p>
        <p>Thank you for joining Green Pedal!</p>
      </div>
    `,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send confirmation email:", error);
    throw new Error("Email sending failed");
  }
}
