// src/app/(shop)/cart/page.tsx
import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CartContent } from "./cart-content";

export const metadata: Metadata = {
  title: "Shopping Cart | Nike Shoes Shop",
  description: "Review the items in your shopping cart",
};

export default function CartPage() {
  return (
    <div className="py-6 sm:py-8">
      <Container>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Your Shopping Cart</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Review your items before proceeding to checkout
          </p>
        </div>

        <CartContent />
      </Container>
    </div>
  );
}
