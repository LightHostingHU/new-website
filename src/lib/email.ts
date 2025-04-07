import { readFileSync } from "fs";
import nodemailer from "nodemailer";
import path from "path";
import { getResetPasswordEmailTemplate } from "./(templates)/(password)/email-template";

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
    supportEmail: process.env.SUPPORT_EMAIL || "",
    appName: process.env.APP_NAME || "LightHosting",
  });

  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM}" <${process.env.EMAIL_SERVER_USER}>`,
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

export async function sendVirtualizorRegistrationEmail(title: string, email: string, fname: string, lname: string, newpass: string) {
  try {
    const templatePath = path.join(
      process.cwd(),
      "public",
      "assets",
      "emails",
      "virtualizor.html"
    );

    const emailHtml = replace(
      readFileSync(templatePath, "utf-8"),
      {title, fname, lname, newpass, email }
    );

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM}" <${process.env.EMAIL_SERVER_USER}>`,
      to: email,
      subject: `Fiók létrehozása`,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

function replace(template: string, values: { [key: string]: string }): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, "g"), value),
    template
  );
}
