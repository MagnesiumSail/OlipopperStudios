// === FILE: src/app/api/admin/size-guides/route.ts ===
// This file handles the API route for fetching size guides in the admin panel.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const guides = await prisma.sizeGuide.findMany({
      select: { id: true, name: true }
    });

    return NextResponse.json(guides);
  } catch (error) {
    console.error('Error fetching size guides:', error);
    return NextResponse.json({ error: 'Failed to fetch size guides' }, { status: 500 });
  }
}
