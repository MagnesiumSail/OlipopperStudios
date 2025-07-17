// === FILE: src/app/api/products/[id]/route.ts ===
// This file handles fetching product details by ID

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context;
  const { id } = await params; // must await here!

  const numId = Number(id);
  if (isNaN(numId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const product = await prisma.product.findUnique({
    where: { id: numId },
    include: {
      images: true,
      sizeGuide: true, // <-- ADD THIS!
    },
  });

  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(product);
}
