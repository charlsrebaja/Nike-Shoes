// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export default function Home() {
  return (
    <>
      <Navbar />
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
                  Step into innovation and style with the latest Nike footwear collection, 
                  engineered for performance and designed for life.
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
                  src="https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/8c76e8a1-be2c-46ad-8f63-27371c0620f8/invincible-3-road-running-shoes-Wwmmlp.png"
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
              {['Running', 'Basketball', 'Lifestyle', 'Training'].map((category) => (
                <div
                  key={category}
                  className="relative h-60 group overflow-hidden rounded-lg bg-gray-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={`https://source.unsplash.com/random/600x400?nike-${category.toLowerCase()}-shoes`}
                      alt={`${category} Shoes`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 p-4 z-20 w-full">
                    <h3 className="text-xl font-bold text-white mb-2">{category}</h3>
                    <Link href={`/products?category=${category.toLowerCase()}`}>
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
              {/* This would typically come from your database */}
              {[1, 2, 3, 4].map((index) => (
                <Link href={`/products/${index}`} key={index}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="relative h-64">
                      <Image
                        src={`https://source.unsplash.com/random/600x400?nike-shoes-${index}`}
                        alt={`Featured Product ${index}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1">Nike Air Max {index * 90}</h3>
                      <p className="text-gray-600 text-sm mb-2">Running Shoes</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">${(index * 40) + 79}.99</span>
                      </div>
                    </div>
                  </div>
                </Link>
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
                  src="https://source.unsplash.com/random/1920x1080?nike-shoes"
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
                  Sign up for Nike Membership to get priority access to the best Nike products, 
                  inspiration and community, all for free.
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
