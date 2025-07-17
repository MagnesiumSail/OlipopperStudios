// === FILE: src/app/api/pattern-download/route.ts ===
// Secure endpoint to deliver a pattern PDF if token/order is valid

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken"; // npm i jsonwebtoken

const JWT_SECRET = process.env.PATTERN_DOWNLOAD_SECRET || "something-very-secret";

// URL: /api/pattern-download?token=...

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  try {
    const { orderId, patternId, email } = jwt.verify(token, JWT_SECRET) as any;

    // Confirm the order, pattern, and email exist/match
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: { include: { product: true } }, user: true },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Confirm order has this pattern, and belongs to this email
    const patternProduct = order.items.find(
      (item) => item.productId === patternId && item.product.patternURL
    );
    if (!patternProduct) return NextResponse.json({ error: "Pattern not found in order" }, { status: 403 });

    // Optionally check order.user.email === email, if you use users
    // or check order.customerEmail === email

    // Redirect to the PDF (you can also stream it if you want to hide the URL further)
    return NextResponse.redirect(patternProduct.product.patternURL, 302);
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
  }
}
