// src/lib/siteSettings.ts
import { prisma } from "@/lib/prisma";

export async function getPurchasingPaused(): Promise<boolean> {
  const s = await prisma.siteSettings.findUnique({
    where: { id: 1 },
    select: { purchasingPaused: true },
  });
  return !!s?.purchasingPaused;
}

export async function setPurchasingPaused(val: boolean) {
  return prisma.siteSettings.update({
    where: { id: 1 },
    data: { purchasingPaused: val },
  });
}
