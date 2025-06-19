import { prisma } from '@/lib/prisma';

async function main() {
  await prisma.sizeGuide.create({
    data: {
      name: 'Default Size Guide',
      tableData: [["Size", "Bust", "Waist", "Hips"], ["S", "34", "26", "36"]],
    },
  });

  console.log('Seeded size guide!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
