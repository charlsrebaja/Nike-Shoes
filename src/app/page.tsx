// Revalidate every 30 minutes for fresh content
export const revalidate = 1800;

// Force static generation for better performance
export const dynamic = "force-static";
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
        <section className="relative py-16 overflow-hidden min-h-[600px] flex items-center">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50"></div>
          <div className="absolute inset-0 bg-[url('/images/banners/hero-bg.jpg')] bg-cover bg-center opacity-10"></div>

          {/* Animated Bubble Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="bubble-bg bubble-1"></div>
            <div className="bubble-bg bubble-2"></div>
            <div className="bubble-bg bubble-3"></div>
            <div className="bubble-bg bubble-4"></div>
            <div className="bubble-bg bubble-5"></div>
            <div className="bubble-bg bubble-6"></div>
          </div>

          {/* Floating geometric shapes for visual interest */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-emerald-200/20 rounded-full blur-xl animate-pulse-slow animation-delay-200"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-teal-200/20 rounded-full blur-lg animate-pulse-slow animation-delay-400"></div>

          <Container className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Glassmorphism Content Card */}
              <div className="space-y-8 animate-fade-in-up">
                <div className="glassmorphism-card p-8 md:p-10 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 animate-slide-in-left mb-6">
                    Find Your Perfect Nike Shoes
                  </h1>
                  <p className="text-lg text-gray-700 max-w-md animate-fade-in-up animation-delay-200 leading-relaxed">
                    Step into innovation and style with the latest Nike footwear
                    collection, engineered for performance and designed for
                    life.
                  </p>

                  <div className="flex flex-wrap gap-4 mt-8 animate-fade-in-up animation-delay-400">
                    <Link href="/products">
                      <Button
                        size="lg"
                        className="bg-black hover:bg-gray-900 text-white border-0 transform hover:scale-105 transition-all duration-300 hover:shadow-xl font-semibold"
                      >
                        Shop Now
                      </Button>
                    </Link>
                    <Link href="/products?new=true">
                      <Button
                        variant="outline"
                        size="lg"
                        className="glassmorphism-button bg-white/20 hover:bg-white/30 text-gray-900 border-white/40 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                      >
                        New Arrivals
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 animate-fade-in-up animation-delay-600">
                  <div className="glassmorphism-stats bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                    <div className="text-2xl font-bold text-gray-900">
                      1000+
                    </div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div className="glassmorphism-stats bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                    <div className="text-2xl font-bold text-gray-900">50k+</div>
                    <div className="text-sm text-gray-600">Customers</div>
                  </div>
                  <div className="glassmorphism-stats bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                    <div className="text-2xl font-bold text-gray-900">4.9★</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Image Section */}
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] animate-slide-in-right">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="relative h-full transform hover:scale-105 transition-transform duration-700 ease-out group">
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-2xl"></div>
                  <Image
                    src="/images/banners/banner-image.png"
                    alt="Nike Shoes Hero"
                    fill
                    className="object-contain drop-shadow-2xl group-hover:drop-shadow-3xl transition-all duration-500"
                    priority
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Featured Categories */}
        <section className="py-16">
          <Container>
            <h2 className="text-3xl font-bold mb-8 text-center animate-fade-in-up">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.length === 0
                ? // fallback to the original category list when DB is empty
                  ["Running", "Basketball", "Lifestyle", "Training"].map(
                    (category, index) => (
                      <div
                        key={category}
                        className="relative h-60 group overflow-hidden rounded-lg bg-gray-100 hover-lift animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 transition-opacity duration-300 group-hover:from-black/70"></div>
                        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
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
                        <div className="absolute bottom-0 left-0 p-4 z-20 w-full transform transition-transform duration-300 group-hover:translate-y-[-5px]">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {category}
                          </h3>
                          <Link
                            href={`/products?category=${category.toLowerCase()}`}
                          >
                            <Button
                              variant="secondary"
                              size="sm"
                              className="transform hover:scale-105 transition-all duration-200"
                            >
                              Shop Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )
                  )
                : categories.map((cat, index) => (
                    <div
                      key={cat.id}
                      className="relative h-60 group overflow-hidden rounded-lg bg-gray-100 hover-lift animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 transition-opacity duration-300 group-hover:from-black/70"></div>
                      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
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
              <h2 className="text-3xl font-bold animate-fade-in-up">
                Featured Products
              </h2>
              <Link href="/products?featured=true">
                <Button
                  variant="link"
                  className="animate-fade-in-up animation-delay-200 hover:text-black transition-colors duration-300"
                >
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.length === 0
                ? // fallback placeholders when no featured products in DB
                  [1, 2, 3, 4].map((index) => (
                    <Link href={`/products/${index}`} key={index}>
                      <div
                        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover-lift animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={`/images/products/placeholder.svg`}
                            alt={`Featured Product ${index}`}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                      </div>
                    </Link>
                  ))
                : featuredProducts.map((p, index) => (
                    <div
                      key={p.id}
                      className="animate-fade-in-up hover-lift"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard
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
                    </div>
                  ))}
            </div>
          </Container>
        </section>

        {/* CTA Banner */}
        <section className="py-16 relative overflow-hidden">
          <Container>
            <div className="relative overflow-hidden rounded-2xl bg-black hover-lift group">
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80 backdrop-blur-sm"></div>

              <div className="absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-70">
                <Image
                  src="/images/banners/banner-2.png"
                  alt="Nike Shoes"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Glassmorphism content card */}
              <div className="relative z-10 py-12 px-6 md:py-24 md:px-12 text-white text-center">
                <div className="glassmorphism-cta-content max-w-2xl mx-auto p-8 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-in-left">
                    Join Nike Membership
                  </h2>
                  <p className="text-lg mb-6 max-w-2xl mx-auto animate-fade-in-up animation-delay-200 leading-relaxed">
                    Sign up for Nike Membership to get priority access to the
                    best Nike products, inspiration and community, all for free.
                  </p>
                  <div className="animate-fade-in-up animation-delay-400">
                    <Link href="/register">
                      <Button
                        size="lg"
                        variant="secondary"
                        className="glassmorphism-cta-button bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                      >
                        Join Us
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
