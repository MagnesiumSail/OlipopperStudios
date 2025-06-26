// === FILE: src/app/api/media-library/route.ts ===
// This file handles the API route for fetching images from the media library.

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const images = await prisma.mediaLibrary.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(images);
}
