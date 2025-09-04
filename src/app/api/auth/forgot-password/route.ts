import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const { email } = await req.json();
  // Always send a generic response to avoid user enumeration
  const generic = NextResponse.json({ message: "If that email exists, we've sent instructions." });

  if (!email || typeof email !== "string") return generic;

  // Normalize email
  const normalized = email.toLowerCase();

  // Generate raw token and store only the hash
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  // Upsert reset fields for existing user, but don’t leak whether they exist
  await prisma.user.updateMany({
    where: { email: normalized },
    data: { resetTokenHash: tokenHash, resetTokenExpires: expiresAt },
  });

  // Build reset URL regardless
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const resetUrl = `${base}/user/reset-password?token=${rawToken}&email=${encodeURIComponent(normalized)}`;

  try {
    // Send the email (even if the user doesn't exist, for indistinguishability)
    await resend.emails.send({
      from: process.env.EMAIL_FROM!, // e.g. onboarding@resend.dev
      to: normalized,
      subject: "Reset your password",
      html: `
        <p>We received a request to reset your password.</p>
        <p><a href="${resetUrl}">Click here to reset it</a>. This link expires in 1 hour.</p>
        <p>If you didn’t request this, you can ignore this email.</p>
      `,
    });
  } catch (_) {
    // Swallow errors to keep response generic
  }

  return generic;
}
