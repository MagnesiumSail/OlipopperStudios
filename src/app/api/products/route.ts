// === FILE: src/app/api/products/route.ts ===
// This file handles the API route for fetching all products.

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  // Added: Log the URL and tag param
  const url = new URL(req.url);
  const tag = url.searchParams.get('tag');
  console.log("[API] Fetching products. tag param:", tag);

  try {
    const products = await prisma.product.findMany({
      where: tag
        ? {
            tags: {
              has: tag,
            },
          }
        : {},
      include: {
        images: true,
        sizeGuide: true,
      },
    });

    // Added: Log result length and a sample product
    console.log("[API] Products returned:", products.length, products[0]);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}