// src/app/admin/products/new/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth/auth-options";
import { ProductForm } from "../product-form";

export const metadata: Metadata = {
  title: "Add New Product | Admin | Nike Shoes Shop",
  description: "Add a new product to the Nike Shoes Shop",
};

export default async function NewProductPage() {
  // Verify admin in server component
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch categories for form
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
