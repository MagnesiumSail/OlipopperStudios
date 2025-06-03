import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Sunset Dress',
        description: 'A flowing, sunset-inspired gown.',
        price: 12000, // cents
        imageUrl: '/images/sunset-dress.jpg',
      },
      {
        name: 'Custom Pattern - Floral Top',
        description: 'Downloadable sewing pattern for floral top.',
        price: 2500,
        imageUrl: '/images/floral-top-pattern.jpg',
      },
    ],
  })
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
