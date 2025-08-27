import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const name = "Test Runner X";
  const product = await prisma.product.findFirst({
    where: { name },
    include: { category: true },
  });
  if (!product) {
    console.log("Product not found");
    return;
  }
  console.log("Product found:");
  console.log(
    JSON.stringify(
      {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        images: product.images,
        sizes: product.sizes,
        colors: product.colors,
        category: product.category
          ? { id: product.category.id, name: product.category.name }
          : null,
        featured: product.featured,
        newArrival: product.newArrival,
        bestseller: product.bestseller,
      },
      null,
      2
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
