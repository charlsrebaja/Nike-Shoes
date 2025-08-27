import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  // Ensure there's at least one category to attach to
  let category = await prisma.category.findFirst();
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "Running",
        description: "Running shoes and gear",
        image: "/images/categories/running.jpg",
      },
    });
    console.log("Created category:", category.id);
  }

  const productData = {
    name: "Test Runner X",
    description: "Lightweight running shoe for everyday training.",
    price: 129.99,
    images: ["/images/products/product1.jpg"],
    sizes: { "US 8": 10, "US 9": 12, "US 10": 8 },
    colors: ["Black", "White"],
    categoryId: category.id,
    featured: true,
    bestseller: false,
    newArrival: true,
  };

  const existing = await prisma.product.findFirst({
    where: { name: productData.name },
  });
  if (existing) {
    console.log("Product already exists:", existing.id);
    return;
  }

  const created = await prisma.product.create({ data: productData });
  console.log("Created product with id:", created.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
