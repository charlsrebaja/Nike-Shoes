// src/app/admin/products/[id]/edit/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth/auth-options";
import { ProductForm } from "../../product-form";
import { Decimal } from "@prisma/client/runtime/library";

export const metadata: Metadata = {
  title: "Edit Product | Admin | Nike Shoes Shop",
  description: "Edit a product in the Nike Shoes Shop",
};

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  // Verify admin in server component
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch product and categories
  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Convert Decimal to number for the form component
  const formattedProduct = {
    ...product,
    price:
      product.price instanceof Decimal ? Number(product.price) : product.price,
    sizes: product.sizes as Record<string, number>,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Product: {product.name}</h1>
      </div>

      <ProductForm product={formattedProduct} categories={categories} />
    </div>
  );
}
