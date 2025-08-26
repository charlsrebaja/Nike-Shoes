// src/app/admin/products/[id]/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth/auth-options";
import { Decimal } from "@prisma/client/runtime/library";

export const metadata: Metadata = {
  title: "Product Details | Admin | Nike Shoes Shop",
  description: "View product details in the Nike Shoes Shop admin panel",
};

interface ProductDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  // Verify admin in server component
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch product details
  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Format price for display
  const price =
    product.price instanceof Decimal
      ? Number(product.price).toFixed(2)
      : Number(product.price).toFixed(2);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Details</h1>
        <div className="flex space-x-3">
          <Link href={`/admin/products/${params.id}/edit`}>
            <Button>Edit Product</Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="outline">Back to Products</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Product Images */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
                <span className="text-gray-400">No image available</span>
              </div>
            )}

            {/* Additional Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square relative rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} image ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-gray-500">ID: {product.id}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xl font-semibold">${price}</p>
              <p className="text-sm text-gray-500">
                Category: {product.category.name}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Sizes & Stock</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(product.sizes as Record<string, number>).map(
                  ([size, stock]) => (
                    <div
                      key={size}
                      className="flex justify-between bg-gray-50 p-2 rounded"
                    >
                      <span>{size}</span>
                      <span className="font-medium">{stock} in stock</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Product Status</h3>
              <div className="flex flex-wrap gap-2">
                {product.featured && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Featured
                  </span>
                )}
                {product.bestseller && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    Bestseller
                  </span>
                )}
                {product.newArrival && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    New Arrival
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <h3 className="font-medium">Created & Updated</h3>
              <div className="text-sm text-gray-500">
                <p>Created: {product.createdAt.toLocaleString()}</p>
                <p>Last Updated: {product.updatedAt.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
