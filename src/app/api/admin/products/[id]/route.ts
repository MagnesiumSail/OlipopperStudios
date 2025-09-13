// === FILE: src/app/api/admin/products/[id]/route.ts ===
// This file handles the API routes for updating and deleting products in the admin panel.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/admin/products/:id
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // Auth check: only allow admins
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const productId = parseInt(context.params.id);

  // Validate the ID
  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    // Attempt to delete the product
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: 'Product deleted' });
  } catch (error: any) {
    console.error('Error deleting product:', error);

    // Return 404 if product not found
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/admin/products/:id
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } } // <-- full object
) {
  const session = await getServerSession(authOptions);

  // Only allow admins
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const productId = parseInt(context.params.id);
  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    const body = await req.json();

    // Begin a transaction if replacing images
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Delete all existing images if new ones provided
      if (Array.isArray(body.images)) {
        await tx.productImage.deleteMany({
          where: { productId },
        });

        for (const [index, img] of body.images.entries()) {
          await tx.productImage.create({
            data: {
              productId,
              url: img.url,
              altText: img.altText || '',
              order: img.order ?? index,
            },
          });
        }
      }

      // Update the main product fields
      return tx.product.update({
        where: { id: productId },
        data: {
          name: body.name,
          price: body.price,
          description: body.description,
          isPattern: body.isPattern,
          isActive: body.isActive,
          tags: body.tags,
          sizeGuideId: body.sizeGuideId || null,
        },
        include: {
          images: true,
          sizeGuide: true,
        },
      });
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
