// src/app/admin/categories/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth/auth-options";
import { CategoryManager } from "./category-manager";

export const metadata: Metadata = {
  title: "Categories | Admin | Nike Shoes Shop",
  description: "Manage product categories in the Nike Shoes Shop admin panel",
};

export default async function CategoriesPage() {
  // Verify admin in server component
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch categories
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Categories</h1>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}
