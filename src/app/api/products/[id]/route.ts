// === FILE: src/app/api/products/[id]/route.ts ===
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(product);
}
