// src/components/products/product-card.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  category,
  isNew,
  isFeatured,
  isBestseller,
}: ProductCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem } = useCartStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/login");
      return;
    }

    setIsAddingToCart(true);

    try {
      // Add item to cart using the new API
      await addItem(id, 1, "US 9", "Black");

      // Show success notification (could be implemented with a toast)
    } catch (error) {
      // Show error notification
      console.error("Failed to add item to cart", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Link href={`/products/${id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
        <div className="relative aspect-square bg-gray-100">
          {image && image.trim() !== "" ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}
          {(isNew || isFeatured || isBestseller) && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isNew && <Badge variant="secondary">New Arrival</Badge>}
              {isFeatured && <Badge>Featured</Badge>}
              {isBestseller && <Badge variant="success">Best Seller</Badge>}
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-2">
            <h3 className="font-medium text-lg">{name}</h3>
            {category && (
              <p className="text-sm text-gray-500 mb-1">{category}</p>
            )}
            <p className="font-bold text-lg">${price.toFixed(2)}</p>
          </div>
          <div className="mt-auto pt-3">
            <Button
              variant="default"
              fullWidth
              onClick={handleQuickAdd}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? "Adding..." : "Quick Add"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
