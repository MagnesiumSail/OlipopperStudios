import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newEmail } = await req.json();
  if (
    typeof currentPassword !== "string" ||
    typeof newEmail !== "string" ||
    !newEmail.includes("@")
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { id: true, email: true, password: true },
  });
  if (!user?.password) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) return NextResponse.json({ error: "Invalid password" }, { status: 400 });

  const normalizedNew = newEmail.toLowerCase();

  // Ensure the desired email is not already used by someone else
  const exists = await prisma.user.findUnique({ where: { email: normalizedNew } });
  if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 400 });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  // Store pending data on the user
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailChangeTokenHash: tokenHash,
      emailChangeTokenExpires: expiresAt,
      emailChangeNew: normalizedNew,
    },
  });

  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const confirmUrl = `${base}/user/confirm-email-change?token=${rawToken}`;

  // Email only the NEW address for confirmation; optionally notify old email too.
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: normalizedNew,
      subject: "Confirm your new email",
      html: `
        <p>Click to confirm your new login email:</p>
        <p><a href="${confirmUrl}">${confirmUrl}</a></p>
        <p>This link expires in 1 hour.</p>
      `,
    });
  } catch (e) {
    // Roll back the pending fields if email fails to send
    await prisma.user.update({
      where: { id: user.id },
      data: {
        //This is untested and probably broken
        emailChangeTokenHash: null,
        emailChangeTokenExpires: null,
        emailChangeNew: null,
      },
    });
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  // Optional: notify old email that a change was requested (no link)
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: user.email,
      subject: "Email change requested",
      html: `<p>If you didn't request this, change your password immediately.</p>`,
    });
  } catch (_) {}

  return NextResponse.json({ ok: true });
}
