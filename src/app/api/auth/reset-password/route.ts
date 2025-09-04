import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, token, newPassword } = await req.json();

  if (!email || !token || !newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (
    !user ||
    !user.resetTokenHash ||
    !user.resetTokenExpires ||
    user.resetTokenHash !== tokenHash ||
    user.resetTokenExpires < new Date()
  ) {
    // Don’t reveal which check failed
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email: user.email },
    data: {
      password: hashed,
      resetTokenHash: null,
      resetTokenExpires: null,
    },
  });

  return NextResponse.json({ ok: true });
}
