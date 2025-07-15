// === FILE: src/app/api/admin/products/route.ts ===
// This file handles the API routes for managing products in the admin panel.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Make sure this path is correct based on your project
import { prisma } from "@/lib/prisma"; // Singleton Prisma client

// GET: Return all products for the admin panel
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Only allow admins to access this endpoint
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { updateAt: "desc" },
      include: {
        images: true,
        sizeGuide: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      description,
      price,
      isPattern = false,
      isActive = true,
      tags,
      sizeGuideId,
      images = [],
    } = body;

    if (!name || typeof price !== 'number') {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    // Normalize tags to an array of strings
    let tagsArray: string[] = [];
    if (Array.isArray(tags)) {
      tagsArray = tags.map(tag => tag.trim().toLowerCase()).filter(Boolean);
    } else if (typeof tags === "string") {
      tagsArray = tags
        .split(",")
        .map(tag => tag.trim().toLowerCase())
        .filter(Boolean);
    }

    // Create product first
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        isPattern,
        isActive,
        tags,
        sizeGuideId,
      },
    });

    // Create associated images if provided
    if (Array.isArray(images) && images.length > 0) {
      const imageData = images.map((img: any, index: number) => ({
        productId: newProduct.id,
        url: img.url,
        altText: img.altText || '',
        order: img.order ?? index,
      }));

      await prisma.productImage.createMany({
        data: imageData,
      });
    }

    // Return the product with images
    const fullProduct = await prisma.product.findUnique({
      where: { id: newProduct.id },
      include: {
        images: true,
        sizeGuide: true,
      },
    });

    return NextResponse.json(fullProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
