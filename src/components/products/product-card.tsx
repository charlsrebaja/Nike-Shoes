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
        <div className="relative aspect-square">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
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
