import nodemailer from "nodemailer";

export async function sendConfirmationEmail(to: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "leda62@ethereal.email",
      pass: "8X4KJqBA63SEFUQHHj",
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
