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
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            Review your items before proceeding to checkout
          </p>
        </div>

        <CartContent />
      </Container>
    </div>
  );
}
