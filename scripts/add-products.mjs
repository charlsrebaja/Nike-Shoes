import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

const sampleCategories = [
  { name: "Running", image: "/images/categories/running.jpg" },
  { name: "Basketball", image: "/images/categories/basketball.jpg" },
  { name: "Lifestyle", image: "/images/categories/lifestyle.jpg" },
];

const sampleProducts = [
  {
    name: "Test Runner X",
    description: "Lightweight running shoe for everyday training.",
    price: 129.99,
    images: ["/images/products/product1.jpg"],
    sizes: { "US 8": 10, "US 9": 12, "US 10": 8 },
    colors: ["Black", "White"],
    categoryName: "Running",
    featured: true,
    bestseller: false,
    newArrival: true,
  },
  {
    name: "Hooper Pro",
    description: "Grip-focused basketball shoe for court performance.",
    price: 149.99,
    images: ["/images/products/placeholder.svg"],
    sizes: { "US 9": 6, "US 10": 4, "US 11": 5 },
    colors: ["Red", "Black"],
    categoryName: "Basketball",
    featured: true,
    bestseller: true,
    newArrival: false,
  },
  {
    name: "Everyday Slip-On",
    description: "Casual lifestyle slip-on with premium comfort.",
    price: 89.99,
    images: ["/images/products/placeholder.svg"],
    sizes: { "US 8": 5, "US 9": 7, "US 10": 6 },
    colors: ["Grey", "Navy"],
    categoryName: "Lifestyle",
    featured: false,
    bestseller: false,
    newArrival: true,
  },
  // Additional basketball product batch requested by user
  {
    name: "Nike LeBron 20",
    description:
      "High-performance basketball shoe with elite cushioning and strong ankle support, designed for explosive play.",
    price: 199.99,
    images: ["/images/products/product4.jpg"],
    sizes: { "US 8": 5, "US 9": 12, "US 10": 10, "US 11": 8 },
    colors: ["Black/Gold", "White/Red"],
    categoryName: "Basketball",
    featured: true,
    bestseller: true,
    newArrival: false,
  },
  {
    name: "Nike KD 16",
    description:
      "Lightweight and responsive shoe built for agility and smooth transitions, perfect for versatile scorers.",
    price: 179.99,
    images: ["/images/products/product5.jpg"],
    sizes: { "US 8": 6, "US 9": 10, "US 10": 12 },
    colors: ["Blue/White", "Black/Silver"],
    categoryName: "Basketball",
    featured: false,
    bestseller: true,
    newArrival: true,
  },
  {
    name: "Air Jordan 37",
    description:
      "Modern Jordan sneaker combining heritage design with advanced tech for maximum performance.",
    price: 189.99,
    images: ["/images/products/product6.jpg"],
    sizes: { "US 8": 7, "US 9": 14, "US 10": 9, "US 11": 6 },
    colors: ["Red/Black", "White/Blue"],
    categoryName: "Basketball",
    featured: true,
    bestseller: false,
    newArrival: true,
  },
  {
    name: "Puma Clyde All-Pro",
    description:
      "Lightweight basketball shoe with excellent traction and sleek design, endorsed by top athletes.",
    price: 149.99,
    images: ["/images/products/product7.jpg"],
    sizes: { "US 8": 8, "US 9": 10, "US 10": 11 },
    colors: ["White/Black", "Green/Yellow"],
    categoryName: "Basketball",
    featured: false,
    bestseller: false,
    newArrival: true,
  },
  {
    name: "Adidas Trae Young 1",
    description:
      "Signature shoe designed for quick cuts and high-speed play, optimized for guards.",
    price: 159.99,
    images: ["/images/products/product8.jpg"],
    sizes: { "US 7": 5, "US 8": 7, "US 9": 10, "US 10": 8 },
    colors: ["Black/Neon", "White/Blue"],
    categoryName: "Basketball",
    featured: true,
    bestseller: false,
    newArrival: true,
  },
  {
    name: "New Balance Kawhi 2",
    description:
      "Stability-focused shoe with strong ankle support, engineered for all-around performance.",
    price: 169.99,
    images: ["/images/products/product9.jpg"],
    sizes: { "US 8": 6, "US 9": 12, "US 10": 7, "US 11": 5 },
    colors: ["Black/White", "Grey/Blue"],
    categoryName: "Basketball",
    featured: false,
    bestseller: false,
    newArrival: false,
  },
  {
    name: "Nike Air Zoom Freak 4",
    description:
      "Giannis Antetokounmpo’s signature shoe with explosive cushioning and bold design.",
    price: 179.99,
    images: ["/images/products/product10.jpg"],
    sizes: { "US 8": 8, "US 9": 15, "US 10": 12 },
    colors: ["Black/White", "Orange/Green"],
    categoryName: "Basketball",
    featured: true,
    bestseller: true,
    newArrival: true,
  },
  {
    name: "Under Armour Curry Flow 9",
    description:
      "Stephen Curry’s lightweight shoe with unmatched traction, perfect for shooters.",
    price: 169.99,
    images: ["/images/products/product11.jpg"],
    sizes: { "US 7": 5, "US 8": 9, "US 9": 13 },
    colors: ["Blue/Yellow", "Black/White"],
    categoryName: "Basketball",
    featured: true,
    bestseller: true,
    newArrival: false,
  },
  {
    name: "Adidas Harden Vol. 7",
    description:
      "Signature James Harden shoe with premium cushioning and design for ball handlers.",
    price: 179.99,
    images: ["/images/products/product12.jpg"],
    sizes: { "US 8": 7, "US 9": 11, "US 10": 10 },
    colors: ["Black/Red", "White/Purple"],
    categoryName: "Basketball",
    featured: false,
    bestseller: false,
    newArrival: true,
  },
  {
    name: "Nike Zoom Freak 3",
    description:
      "Durable and cushioned basketball shoe tailored for explosive power and comfort.",
    price: 169.99,
    images: ["/images/products/product13.jpg"],
    sizes: { "US 8": 6, "US 9": 10, "US 10": 12, "US 11": 7 },
    colors: ["Black/White", "Blue/Yellow"],
    categoryName: "Basketball",
    featured: false,
    bestseller: true,
    newArrival: false,
  },
];

async function ensureCategories() {
  const map = {};
  for (const c of sampleCategories) {
    let cat = await prisma.category.findFirst({ where: { name: c.name } });
    if (!cat) {
      cat = await prisma.category.create({
        data: { name: c.name, image: c.image },
      });
      console.log("Created category", c.name, "->", cat.id);
    }
    map[c.name] = cat;
  }
  return map;
}

async function main() {
  const categories = await ensureCategories();

  for (const p of sampleProducts) {
    const exists = await prisma.product.findFirst({ where: { name: p.name } });
    if (exists) {
      console.log("Skipping existing product:", p.name, "id=", exists.id);
      continue;
    }

    const created = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        images: p.images,
        sizes: p.sizes,
        colors: p.colors,
        categoryId: categories[p.categoryName].id,
        featured: p.featured,
        bestseller: p.bestseller,
        newArrival: p.newArrival,
      },
    });

    console.log("Created product:", created.name, "id=", created.id);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
