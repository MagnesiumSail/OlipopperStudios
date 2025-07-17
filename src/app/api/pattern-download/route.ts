// === FILE: src/app/api/pattern-download/route.ts ===
// This file handles the download of pattern PDFs for customers

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken"; // npm i jsonwebtoken

const JWT_SECRET = process.env.PATTERN_DOWNLOAD_SECRET || "something-very-secret";

// URL: /api/pattern-download?token=...

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  try {
    // Decode and verify the JWT token from the email
    const { orderId, patternId, email } = jwt.verify(token, JWT_SECRET) as any;

    // Find the order and its items/products
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check that the email matches (if you want)
    if (order.customerEmail !== email) {
      return NextResponse.json({ error: "Email mismatch" }, { status: 403 });
    }

    // Find the order item for the pattern product
    const patternOrderItem = order.orderItems.find(
      (item) =>
        item.productId === patternId &&
        item.product &&
        item.product.isPattern &&
        item.product.patternURL
    );

    if (!patternOrderItem) {
      return NextResponse.json({ error: "Pattern not found in order" }, { status: 403 });
    }

    // Redirect to the pattern PDF
    if (!patternOrderItem.product.patternURL) {
      return NextResponse.json({ error: "Pattern URL not found" }, { status: 500 });
    }
    return NextResponse.redirect(patternOrderItem.product.patternURL, 302);
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
  }
}
