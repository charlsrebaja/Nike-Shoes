// src/app/(shop)/products/[id]/product-details.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

// Based on our schema where sizes and colors are stored in the Product model
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  sizes: Record<string, number>; // Size name to stock count
  colors: string[];
  category: {
    id: string;
    name: string;
  };
  reviews: Review[];
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
}

export interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: {
    id: string;
    name: string;
  };
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
}

export interface ProductDetailsProps {
  product: Product;
  relatedProducts: RelatedProduct[];
}

export function ProductDetails({
  product,
  relatedProducts,
}: ProductDetailsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem } = useCartStore();

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse sizes from product.sizes (JSON object)
  const sizesObj = typeof product.sizes === "object" ? product.sizes : {};
  const availableSizes = Object.entries(sizesObj).map(([name, stock]) => ({
    id: name,
    name,
    stock: stock as number,
  }));

  // Use colors from product.colors array
  const availableColors = product.colors.map((color) => ({
    id: color,
    name: color,
  }));

  // Check if the selected size and color combination is available
  const getStockForSelectedSize = () => {
    if (!selectedSize) return 0;
    return (sizesObj as Record<string, number>)[selectedSize] || 0;
  };

  // Check if current selection is in stock
  const isInStock = getStockForSelectedSize() > 0;

  // Calculate average rating
  const averageRating = product.reviews.length
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length
    : 0;

  const handleAddToCart = () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (!selectedSize) {
      setError("Please select a size");
      return;
    }

    if (!selectedColor) {
      setError("Please select a color");
      return;
    }

    if (!isInStock) {
      setError("Selected size is out of stock");
      return;
    }

    setIsAddingToCart(true);
    setError(null);

    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
        size: selectedSize,
        color: selectedColor,
      });

      // Could show a success toast here
    } catch (error) {
      console.error("Failed to add item to cart", error);
      setError("Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`relative aspect-square rounded-md overflow-hidden ${
                  selectedImage === image
                    ? "ring-2 ring-black"
                    : "hover:opacity-75"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-1">{product.name}</h1>
                <p className="text-gray-500">{product.category.name}</p>
              </div>
              <div className="text-xl font-bold">
                ${product.price.toFixed(2)}
              </div>
            </div>

            {/* Product badges */}
            {(product.newArrival || product.featured || product.bestseller) && (
              <div className="flex mt-3 space-x-2">
                {product.newArrival && (
                  <Badge variant="secondary">New Arrival</Badge>
                )}
                {product.bestseller && (
                  <Badge variant="destructive">Bestseller</Badge>
                )}
                {product.featured && <Badge>Featured</Badge>}
              </div>
            )}

            {/* Ratings */}
            {product.reviews.length > 0 && (
              <div className="flex items-center mt-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 15.585l-5.295 3.278 1.455-6.327L1.1 7.865l6.357-.61L10 1.4l2.543 5.855 6.357.61-5.06 4.67 1.455 6.327L10 15.585z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.reviews.length} reviews
                </span>
              </div>
            )}
          </div>

          {/* Product description */}
          {product.description && (
            <div className="mb-6 prose prose-sm max-w-none">
              <p>{product.description}</p>
            </div>
          )}

          {/* Product options */}
          <div className="space-y-6">
            {/* Size selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {availableSizes.map(
                  (size: { id: string; name: string; stock: number }) => (
                    <button
                      key={size.id}
                      onClick={() => {
                        setSelectedSize(size.id);
                        setError(null);
                      }}
                      disabled={size.stock <= 0}
                      className={`
                      border rounded-md py-2 px-3 text-center text-sm
                      ${
                        selectedSize === size.id
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-300"
                      }
                      ${size.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                    >
                      {size.name}
                      {size.stock <= 0 && (
                        <span className="block text-xs mt-1">
                          (Out of stock)
                        </span>
                      )}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Color selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {availableColors.map((color: { id: string; name: string }) => (
                  <button
                    key={color.id}
                    onClick={() => {
                      setSelectedColor(color.id);
                      setError(null);
                    }}
                    className={`
                      border rounded-md py-2 px-3 text-center text-sm
                      ${
                        selectedColor === color.id
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 border border-gray-300 flex items-center justify-center rounded-l"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="h-10 w-16 text-center border-t border-b border-gray-300 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 border border-gray-300 flex items-center justify-center rounded-r"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart button */}
            <div className="pt-2">
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <Button
                onClick={handleAddToCart}
                disabled={
                  isAddingToCart ||
                  !isInStock ||
                  !selectedSize ||
                  !selectedColor
                }
                className="w-full"
                size="lg"
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              {!isInStock && selectedSize && selectedColor && (
                <p className="text-red-500 text-sm mt-2">Out of stock</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 15.585l-5.295 3.278 1.455-6.327L1.1 7.865l6.357-.61L10 1.4l2.543 5.855 6.357.61-5.06 4.67 1.455 6.327L10 15.585z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {review.user.name}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">
              No reviews yet
            </h3>
            <p className="text-gray-600 mt-1">
              Be the first to review this product
            </p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                id={relatedProduct.id}
                name={relatedProduct.name}
                price={parseFloat(relatedProduct.price.toString())}
                image={relatedProduct.images[0]}
                category={relatedProduct.category.name}
                isNew={relatedProduct.newArrival}
                isFeatured={relatedProduct.featured}
                isBestseller={relatedProduct.bestseller}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
