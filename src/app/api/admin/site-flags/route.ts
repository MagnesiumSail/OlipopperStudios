// src/app/api/admin/site-flags/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { setPurchasingPaused } from "@/lib/siteSettings";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { purchasingPaused } = await req.json();
  if (typeof purchasingPaused !== "boolean") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await setPurchasingPaused(purchasingPaused);
  return NextResponse.json({ ok: true });
}
