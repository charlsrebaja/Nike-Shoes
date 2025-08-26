// src/app/admin/products/create/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth/auth-options";
import { ProductForm } from "../product-form";

export const metadata: Metadata = {
  title: "Create Product | Admin | Nike Shoes Shop",
  description: "Create a new product in the Nike Shoes Shop",
};

export default async function CreateProductPage() {
  // Verify admin in server component
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch categories for the form
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Product</h1>
      </div>
      
      <ProductForm categories={categories} />
    </div>
  );
}
