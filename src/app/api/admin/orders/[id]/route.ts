import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params promise
  const { params } = context;
  const { id: idStr } = await params;

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const orderId = parseInt(idStr, 10);
  if (isNaN(orderId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const { status } = await req.json();
  const validStatuses = ['paid','in_progress','in_transit','delivered','cancelled'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return NextResponse.json(updated);
}
