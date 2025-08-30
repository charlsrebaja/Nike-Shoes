// src/app/(shop)/cart/cart-content.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TrashIcon } from "./trash-icon";

export function CartContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    getTotal,
    clearCart,
    isLoading,
    error,
  } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId);
  };

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login?redirect=/cart");
      return;
    }

    setIsCheckingOut(true);

    try {
      // In a future step, we'll integrate with Stripe here
      router.push("/checkout");
    } catch (error) {
      console.error("Checkout error:", error);
      setIsCheckingOut(false);
      // Could show an error notification here
    }
  };

  // Calculate subtotal, shipping, and total
  const subtotal = getTotal();
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
  const total = subtotal + shipping;

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="py-8 sm:py-12 text-center">
        <div className="bg-gray-50 rounded-lg p-6 sm:p-8 max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            Looks like you haven&apos;t added any products to your cart yet.
          </p>
          <Link href="/products">
            <Button className="w-full sm:w-auto">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 sm:h-96">
        <Spinner size="large" />
        <span className="ml-2 mt-4 text-sm sm:text-base">
          Loading your cart...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-800 p-4 sm:p-6 rounded-md mx-4 sm:mx-0">
        <p className="font-medium text-sm sm:text-base">Error loading cart</p>
        <p className="text-xs sm:text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Product Image */}
                <div className="w-full sm:w-24 h-32 sm:h-24 relative flex-shrink-0 mx-auto sm:mx-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain sm:object-cover rounded-md"
                    sizes="(max-width: 640px) 100vw, 96px"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-sm sm:text-base truncate sm:whitespace-normal">
                        <Link
                          href={`/products/${item.id}`}
                          className="hover:underline"
                        >
                          {item.name}
                        </Link>
                      </h3>
                      <div className="mt-1 text-xs sm:text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          <span>Size: {item.size}</span>
                          <span className="hidden sm:inline">|</span>
                          <span>Color: {item.color}</span>
                        </div>
                      </div>
                      <div className="mt-1 font-medium text-sm sm:text-base">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="self-start sm:self-center text-gray-400 hover:text-gray-500 flex-shrink-0"
                      aria-label="Remove item"
                    >
                      <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mt-3 sm:mt-2 flex items-center justify-between sm:justify-start gap-2">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`quantity-${item.id}`}
                        className="text-xs sm:text-sm text-gray-700 font-medium"
                      >
                        Qty:
                      </label>
                      <div className="flex border border-gray-300 rounded">
                        <button
                          type="button"
                          className="px-2 py-1 border-r border-gray-300 text-sm hover:bg-gray-50"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <input
                          id={`quantity-${item.id}`}
                          type="text"
                          className="w-10 sm:w-12 text-center text-sm"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) {
                              handleUpdateQuantity(item.id, val);
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="px-2 py-1 border-l border-gray-300 text-sm hover:bg-gray-50"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">Order Summary</h2>

          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                {subtotal > 100 && shipping === 0 && (
                  <span className="block text-xs text-green-600">
                    Free shipping for orders over $100
                  </span>
                )}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full"
              size="lg"
            >
              {isCheckingOut ? <Spinner size="small" className="mr-2" /> : null}
              {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </Button>

            <Button variant="outline" className="w-full" onClick={clearCart}>
              Clear Cart
            </Button>

            <Link href="/products">
              <Button variant="ghost" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-xs text-gray-500 text-center">
            <p>Secure checkout powered by Stripe</p>
            <p className="mt-1">Free returns within 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
