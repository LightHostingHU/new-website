import { getResetPasswordEmailTemplate } from "./(templates)/(password)/email-template";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",

  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const html = getResetPasswordEmailTemplate({
    resetLink,
    supportEmail: process.env.SUPPORT_EMAIL || "support@example.com",
    appName: process.env.APP_NAME || "Our App",
  });

  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM || "Our App"}" <${process.env.EMAIL_SERVER_USER}>`,
      to: email,
      subject: `Password Reset Request for ${process.env.APP_NAME || "Our App"}`,
      html,
      text: `Please reset your password by visiting this link: ${resetLink}\n\nThis link expires in 1 hour.`,
    });
    
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
