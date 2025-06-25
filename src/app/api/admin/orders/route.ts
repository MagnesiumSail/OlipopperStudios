import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      Product: {
        select: { name: true },
      },
    },
  });

  // Map result to match frontend's expected shape (flatten Product.name)
  const result = orders.map((order) => ({
    ...order,
    product: {
      name: order.Product?.name || "[Deleted Product]",
    },
  }));

  return NextResponse.json(result);
}
