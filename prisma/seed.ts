import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();

  await prisma.table.createMany({
    data: [{ name: "Table 1" }, { name: "Table 2" }],
  });

  await prisma.category.createMany({
    data: [
      {
        name: "Drinks",
        printable: false,
      },
      {
        name: "Kitchen",
        printable: true,
      },
    ],
  });

  const data = [
    {
      name: "Soda",
      price: 1.99,
      position: 1,
      categoryId: 1,
      manual: false,
    },
    {
      name: "Coffee",
      price: 2.49,
      position: 2,
      categoryId: 1,
      manual: false,
    },
    {
      name: "Juice",
      price: 3.99,
      position: 3,
      categoryId: 1,
      manual: false,
    },
    {
      name: "Pasta",
      price: 5.99,
      position: 1,
      categoryId: 2,
      manual: false,
    },
    {
      name: "Pizza",
      price: 8.99,
      position: 2,
      categoryId: 2,
      manual: false,
    },
    {
      name: "Salad",
      price: 4.99,
      position: 3,
      categoryId: 2,
      manual: false,
    },
  ];

  await prisma.product.createMany({
    data,
  });
}

main();
