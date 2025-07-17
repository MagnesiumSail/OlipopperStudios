// === FILE: src/app/api/admin/orders/route.ts ===
// This file handles the API route for fetching all orders in the admin panel.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Changed: Include orderItems and each associated product
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: { product: { select: { name: true } } },
      },
    },
  });

  // Map each order to list of product names
  const result = orders.map((order) => ({
    ...order,
    products: order.orderItems.map((item) => ({
      name: item.product?.name || "[Deleted Product]",
      quantity: item.quantity,
    })),
  }));

  return NextResponse.json(result);
}
