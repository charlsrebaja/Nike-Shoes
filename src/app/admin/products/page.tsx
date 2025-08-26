// src/app/admin/products/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth/auth-options";
import { ProductsTable } from "./products-table";

export const metadata: Metadata = {
  title: "Admin Products | Nike Shoes Shop",
  description: "Manage product listings in the Nike Shoes Shop admin dashboard",
};

export default async function AdminProductsPage() {
  // Verify admin in server component
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>

      <ProductsTable products={products} categories={categories} />
    </div>
  );
}
