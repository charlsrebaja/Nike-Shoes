// src/app/(shop)/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type {
  Product as ClientProduct,
  RelatedProduct,
} from "./product-details";
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
  try {
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
  } catch (e) {
    // If DB is unreachable, return a safe generic metadata
    console.error("Prisma error in generateMetadata:", e);
    return {
      title: "Product | Nike Shoes Shop",
      description: "Product information is currently unavailable.",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product: unknown | null = null;
  let formattedProduct: ClientProduct | null = null;
  let formattedRelated: RelatedProduct[] = [];
  let dbError: Error | null = null;

  try {
    product = await prisma.product.findUnique({
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

    // Convert Decimal and JSON fields to plain JS types for the client component
    const p = product as Record<string, unknown>;
    const toNumber = (v: unknown) => {
      if (v === null || v === undefined) return 0;
      try {
        // Handle objects that implement toString (e.g., Prisma Decimal)
        if (typeof v === "object" && v !== null) {
          const maybe = v as { toString?: unknown };
          if (typeof maybe.toString === "function") {
            return Number(String((maybe.toString as () => string)()));
          }
        }
        return Number(v as unknown as number);
      } catch {
        return 0;
      }
    };

    formattedProduct = {
      id: String(p.id ?? ""),
      name: String(p.name ?? ""),
      description: typeof p.description === "string" ? p.description : null,
      price: toNumber(p.price),
      images: (p.images as string[]) ?? [],
      sizes: (p.sizes as Record<string, number>) ?? {},
      colors: (p.colors as string[]) ?? [],
      category: (p.category as Record<string, unknown>)
        ? {
            id: String((p.category as Record<string, unknown>).id ?? ""),
            name: String((p.category as Record<string, unknown>).name ?? ""),
          }
        : { id: String(p.categoryId ?? ""), name: "" },
      reviews: ((p.reviews as unknown[]) ?? []).map((review: unknown) => {
        const r = review as Record<string, unknown>;
        const ru = r.user as Record<string, unknown> | undefined;
        return {
          id: String(r.id ?? ""),
          rating: Number(r.rating ?? 0),
          comment: String(r.comment ?? ""),
          createdAt: (r.createdAt as Date) ?? new Date(),
          user: {
            name: typeof ru?.name === "string" ? (ru.name as string) : null,
            image: typeof ru?.image === "string" ? (ru.image as string) : null,
          },
        };
      }),
      featured: !!p.featured,
      newArrival: !!p.newArrival,
      bestseller: !!p.bestseller,
    };

    // Fetch related products in the same category
    const categoryId = (p.categoryId ?? (p.category as Record<string, unknown>)?.id) as string | undefined;
    const currentProductId = String(p.id ?? "");

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: categoryId ?? undefined,
        id: {
          not: currentProductId,
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

    formattedRelated = (relatedProducts as unknown[]).map((p) => {
      const rp = p as Record<string, unknown>;
      const cat = (rp.category as Record<string, unknown>) ?? {
        id: rp.categoryId ?? "",
        name: "",
      };
      return {
        id: String(rp.id ?? ""),
        name: String(rp.name ?? ""),
        price: toNumber(rp.price),
        images: (rp.images as string[]) ?? [],
        category: { id: String(cat.id ?? ""), name: String(cat.name ?? "") },
        featured: !!rp.featured,
        newArrival: !!rp.newArrival,
        bestseller: !!rp.bestseller,
      };
    });
  } catch (e: unknown) {
    dbError = e instanceof Error ? e : new Error(String(e));
    console.error("Prisma query failed on Product page:", dbError);
  }

  return (
    <div className="py-8">
      <Container>
        {dbError ? (
          <Alert variant="warning" className="mb-6">
            <AlertTitle>Database connection problem</AlertTitle>
            <AlertDescription>
              Product data is unavailable right now. Try again later or check
              your database connection.
            </AlertDescription>
          </Alert>
        ) : null}

        {formattedProduct ? (
          <ProductDetails
            product={formattedProduct}
            relatedProducts={formattedRelated}
          />
        ) : (
          // Show a minimal fallback UI instead of crashing
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-bold">Product unavailable</h3>
            <p className="text-sm text-gray-600">
              Product details are temporarily unavailable. Please try again
              later.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
