import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with matching, unexpired token
  const user = await prisma.user.findFirst({
    where: {
      emailChangeTokenHash: tokenHash,
      emailChangeTokenExpires: { gt: new Date() },
      emailChangeNew: { not: null },
    },
  });

  if (!user || !user.emailChangeNew) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  const newEmail = user.emailChangeNew;

  // Ensure the email isn't taken (race condition protection)
  const exists = await prisma.user.findUnique({ where: { email: newEmail } });
  if (exists && exists.id !== user.id) {
    // Clear pending fields to force a fresh attempt
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailChangeTokenHash: null,
        emailChangeTokenExpires: null,
        emailChangeNew: null,
      },
    });
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  }

  // Apply the change, clear pending fields, and log the user out everywhere
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        email: newEmail,
        emailChangeTokenHash: null,
        emailChangeTokenExpires: null,
        emailChangeNew: null,
      },
    }),
    prisma.session.deleteMany({ where: { userId: user.id } }), // if using Prisma Adapter sessions
  ]);

  return NextResponse.json({ ok: true });
}
