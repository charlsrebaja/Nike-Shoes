// prisma/seed.js
// Simple, idempotent seed for creating an admin user.
// Run with: node prisma/seed.js  OR `npm run seed`

import bcrypt from "bcrypt";
import { PrismaClient } from "./src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";
  const password = "admin123";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin user already exists, skipping seed.");
    return;
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
