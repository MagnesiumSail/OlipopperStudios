// === FILE: src/app/api/products/route.ts ===
// This file handles the API route for fetching all products.

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET() {
  try { 
    const products = await prisma.product.findMany({
      include: {
        images: true,
        sizeGuide: true,
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
