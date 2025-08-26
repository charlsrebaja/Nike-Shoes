// src/app/admin/products/[id]/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-2">Product Not Found</h1>
      <p className="text-gray-600 mb-6">
        The product you are looking for does not exist or may have been removed.
      </p>
      <div className="flex space-x-4">
        <Link href="/admin/products">
          <Button>Back to Products</Button>
        </Link>
        <Link href="/admin/products/create">
          <Button variant="outline">Create New Product</Button>
        </Link>
      </div>
    </div>
  );
}
