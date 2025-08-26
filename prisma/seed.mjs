// prisma/seed.mjs
// ESM seed for creating an admin user. Run with: node --experimental-specifier-resolution=node prisma/seed.mjs

import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

const email = "admin@gmail.com";
const password = "admin123";

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) {
  console.log("Admin user already exists, skipping seed.");
  await prisma.$disconnect();
  process.exit(0);
}

const hashed = await bcrypt.hash(password, 10);

const user = await prisma.user.create({
  data: {
    email,
    name: "Admin",
    hashedPassword: hashed,
    role: "ADMIN",
  },
});

console.log("Created admin user with id:", user.id);

await prisma.$disconnect();
