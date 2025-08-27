// src/app/page.tsx
// All Unsplash image sources have been replaced with local images from:
// /images/products, /images/categories, /images/banners
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { prisma } from "@/lib/db/prisma";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { Product, Category } from "@/generated/prisma";
import { ProductCard } from "@/components/products/product-card";

const categoryImages: Record<string, string> = {
  Running: "/images/categories/running.jpg",
  Basketball: "/images/categories/basketball.jpg",
  Lifestyle: "/images/categories/lifestyle.jpg",
  Training: "/images/categories/training.jpg",
};

export default async function Home() {
  // Server-side fetch: categories and featured products
  let categories: Category[] = [];
  let featuredProducts: (Product & { category?: Category | null })[] = [];
  let dbError: Error | null = null;

  try {
    [categories, featuredProducts] = await Promise.all([
      prisma.category.findMany({ take: 4, orderBy: { createdAt: "desc" } }),
      prisma.product.findMany({
        where: { featured: true },
        take: 4,
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);
  } catch (e: unknown) {
    // Capture the error and continue rendering fallbacks so the app doesn't crash
    dbError = e instanceof Error ? e : new Error(String(e));
    categories = [];
    featuredProducts = [];
    console.error("Prisma query failed on Home page:", dbError);
  }
  return (
    <>
      <Navbar />
      {dbError ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
          <Alert variant="warning">
            <AlertTitle>Database connection problem</AlertTitle>
            <AlertDescription>
              The site is unable to reach the database right now. You can still
              browse the static content; dynamic data will appear once the
              database is available.
            </AlertDescription>
          </Alert>
        </div>
      ) : null}
      <main>
        {/* Hero Section */}
        <section className="bg-gray-100 py-16">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Find Your Perfect Nike Shoes
                </h1>
                <p className="text-lg text-gray-600 max-w-md">
                  Step into innovation and style with the latest Nike footwear
                  collection, engineered for performance and designed for life.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/products">
                    <Button size="lg">Shop Now</Button>
                  </Link>
                  <Link href="/products?new=true">
                    <Button variant="outline" size="lg">
                      New Arrivals
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
                <Image
                  src="/images/banners/banner-image.png"
                  alt="Nike Shoes Hero"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Featured Categories */}
        <section className="py-16">
          <Container>
            <h2 className="text-3xl font-bold mb-8 text-center">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.length === 0
                ? // fallback to the original category list when DB is empty
                  ["Running", "Basketball", "Lifestyle", "Training"].map(
                    (category) => (
                      <div
                        key={category}
                        className="relative h-60 group overflow-hidden rounded-lg bg-gray-100"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                        <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-110">
                          <Image
                            src={
                              categoryImages[category] ??
                              "/images/categories/placeholder.svg"
                            }
                            alt={`${category} Shoes`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 p-4 z-20 w-full">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {category}
                          </h3>
                          <Link
                            href={`/products?category=${category.toLowerCase()}`}
                          >
                            <Button variant="secondary" size="sm">
                              Shop Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )
                  )
                : categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="relative h-60 group overflow-hidden rounded-lg bg-gray-100"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                      <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-110">
                        <Image
                          src={
                            cat.image ??
                            categoryImages[cat.name] ??
                            "/images/categories/placeholder.svg"
                          }
                          alt={`${cat.name} Shoes`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 p-4 z-20 w-full">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {cat.name}
                        </h3>
                        <Link
                          href={`/products?category=${encodeURIComponent(
                            cat.name.toLowerCase()
                          )}`}
                        >
                          <Button variant="secondary" size="sm">
                            Shop Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
            </div>
          </Container>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <Link href="/products?featured=true">
                <Button variant="link">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.length === 0
                ? // fallback placeholders when no featured products in DB
                  [1, 2, 3, 4].map((index) => (
                    <Link href={`/products/${index}`} key={index}>
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="relative h-64">
                          <Image
                            src={`/images/products/placeholder.svg`}
                            alt={`Featured Product ${index}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </Link>
                  ))
                : featuredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      price={Number(p.price.toString())}
                      image={
                        p.images && p.images.length > 0
                          ? p.images[0]
                          : "/images/products/placeholder.svg"
                      }
                      category={p.category?.name}
                      isNew={p.newArrival}
                      isFeatured={p.featured}
                      isBestseller={p.bestseller}
                    />
                  ))}
            </div>
          </Container>
        </section>

        {/* CTA Banner */}
        <section className="py-16">
          <Container>
            <div className="relative overflow-hidden rounded-xl bg-black">
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="/images/banners/banner-2.png"
                  alt="Nike Shoes"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative z-10 py-12 px-6 md:py-24 md:px-12 text-white text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Join Nike Membership
                </h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                  Sign up for Nike Membership to get priority access to the best
                  Nike products, inspiration and community, all for free.
                </p>
                <Link href="/register">
                  <Button size="lg" variant="secondary">
                    Join Us
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
