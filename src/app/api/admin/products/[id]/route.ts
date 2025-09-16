// === FILE: src/app/api/admin/products/[id]/route.ts ===
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/admin/products/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // CHANGED: Promise
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;                        // CHANGED: await
  const productId = Number(id);
  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/admin/products/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }     // CHANGED: Promise
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;                        // CHANGED: await
  const productId = Number(id);
  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    const body = await req.json();

    const updatedProduct = await prisma.$transaction(async (tx) => {
      if (Array.isArray(body.images)) {
        await tx.productImage.deleteMany({ where: { productId } });
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
        include: { images: true, sizeGuide: true },
      });
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
