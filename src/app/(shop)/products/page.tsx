// src/app/(shop)/products/page.tsx
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { ProductListing } from "./product-listing";
import { prisma } from "@/lib/db/prisma";

export const metadata = {
  title: "Products | Nike Shoes Shop",
  description: "Browse our collection of premium Nike shoes",
};

// Revalidate page every hour
export const revalidate = 3600;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Fetch categories for filters
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Nike Shoes Collection</h1>
          <p className="text-gray-600 mt-2">
            Discover the perfect Nike footwear for your active lifestyle
          </p>
        </div>

        <Suspense fallback={<div>Loading products...</div>}>
          <ProductListing searchParams={searchParams} categories={categories} />
        </Suspense>
      </Container>
    </div>
  );
}
