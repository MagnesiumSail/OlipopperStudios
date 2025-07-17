// === FILE: src/app/api/user/orders/route.ts ===

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Returns orders for current user (must be logged in)
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find all orders for this user
  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: { product: true }
      }
    },
  });

  return NextResponse.json(orders);
}
