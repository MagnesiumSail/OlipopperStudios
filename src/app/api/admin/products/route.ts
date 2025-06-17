// src/app/api/admin/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Make sure this path is correct based on your project
import { prisma } from '@/lib/prisma';    // Singleton Prisma client

// GET: Return all products for the admin panel
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Only allow admins to access this endpoint
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all products, sorted by most recently updated
    const products = await prisma.product.findMany({
      orderBy: { updateAt: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new product
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Only allow admins to create products
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Extract JSON body
    const body = await req.json();
    const { name, description, price, imageUrl, isPattern = false, isActive = true } = body;

    // Basic validation
    if (!name || !price || typeof price !== 'number') {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    // Create product in DB
    const newProduct = await prisma.product.create({
      data: { name, description, price, imageUrl, isPattern, isActive },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
