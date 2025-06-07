import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Red Dress",
        description: "Elegant evening dress",
        price: 7999,
        isPattern: false,
        imageUrl: "/images/red-dress.jpg",
      },
      {
        name: "Summer Top Pattern",
        description: "Printable pattern for a light summer top",
        price: 1299,
        isPattern: true,
        imageUrl: "/images/summer-pattern.jpg",
      },
    ],
  })
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
