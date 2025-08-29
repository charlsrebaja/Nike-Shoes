// src/app/(shop)/checkout/checkout-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface CheckoutFormProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function CheckoutForm({ user }: CheckoutFormProps) {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  // Calculate totals
  const subtotal = getTotal();
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
  const tax = subtotal * 0.1; // 10% tax example
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Map cart items to checkout format
      const checkoutItems = items.map((item) => ({
        id: item.productId, // Use productId as the id for checkout
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: checkoutItems,
          customer: formData,
          total,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Checkout failed: ${response.status}`
        );
      }

      const data = await response.json();

      // Redirect to Stripe checkout
      const { url } = data;
      if (url) {
        window.location.href = url;
      } else {
        clearCart();
        router.push("/checkout/success");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      // Show error message to user
      alert(
        error instanceof Error
          ? error.message
          : "Checkout failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return <div className="py-8 text-center">Redirecting to cart...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Checkout form */}
      <div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-medium mb-6">Shipping Information</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Street Address
                </label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State/Province
                  </label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    ZIP/Postal Code
                  </label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country
                  </label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    required
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="small" className="mr-2" />
                    Processing...
                  </>
                ) : (
                  `Pay ${total.toFixed(2)} USD`
                )}
              </Button>
              <p className="mt-2 text-xs text-center text-gray-500">
                By placing your order, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Order summary */}
      <div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
          <h2 className="text-lg font-medium mb-4">Order Summary</h2>

          {/* Order items */}
          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color}`}
                className="flex justify-between text-sm pb-2 border-b border-gray-100"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Order totals */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
