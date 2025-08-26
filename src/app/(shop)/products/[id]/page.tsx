// src/app/(shop)/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { Container } from "@/components/ui/container";
import { ProductDetails } from "./product-details";

interface ProductPageProps {
  params: {
    id: string;
  };
}

// Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });

  if (!product) {
    return {
      title: "Product Not Found | Nike Shoes Shop",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} | Nike Shoes Shop`,
    description:
      product.description ||
      `${product.name} by Nike - Available now at the Nike Shoes Shop`,
    openGraph: {
      images: product.images?.[0]
        ? [{ url: product.images[0], alt: product.name }]
        : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products in the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: {
        not: product.id,
      },
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    take: 4,
  });

  return (
    <div className="py-8">
      <Container>
        <ProductDetails product={product} relatedProducts={relatedProducts} />
      </Container>
    </div>
  );
}
