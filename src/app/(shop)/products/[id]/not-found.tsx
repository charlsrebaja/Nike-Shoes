// src/app/(shop)/products/[id]/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function ProductNotFound() {
  return (
    <Container className="py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">
          We couldn&apos;t find the product you were looking for.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
