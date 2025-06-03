const { PrismaClient } = require('../src/generated/prisma')
const prisma = new PrismaClient()

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'Sunset Dress',
        description: 'A flowing, sunset-inspired gown.',
        price: 12000,
        imageUrl: '/images/sunset-dress.jpg',
      },
      {
        name: 'Floral Top Pattern',
        description: 'Downloadable sewing pattern.',
        price: 2500,
        imageUrl: '/images/floral-top.jpg',
      },
    ],
  })
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
