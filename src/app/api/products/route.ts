// === FILE: src/app/api/products/route.ts ===
// This file handles the API route for fetching all products.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tag = url.searchParams.get("tag");

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(tag && {
          tags: {
            has: tag,
          },
        }),
      },
      include: {
        images: true,
        sizeGuide: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
