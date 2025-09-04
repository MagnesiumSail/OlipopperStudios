// === FILE: prisma/seed.ts ===
// This file seeds the database with initial data for the size guide.

import { prisma } from '@/lib/prisma';

async function main() {
  await prisma.siteSettings.upsert({
  where: { id: 1 },
  update: {},
  create: { id: 1, purchasingPaused: false },
});
 console.log('Database has been seeded. 🌱');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
