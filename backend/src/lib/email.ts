import nodemailer from "nodemailer";

export async function sendConfirmationEmail(to: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "Confirm your email",
    text: `Your confirmation code is: ${code}`,
    html: `<p>Your confirmation code is: <b>${code}</b> </br> green pedal </p>`,
  };

  await transporter.sendMail(mailOptions);
}
