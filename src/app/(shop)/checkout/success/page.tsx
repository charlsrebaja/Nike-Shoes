// src/app/(shop)/checkout/success/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Confirmed | Nike Shoes Shop",
  description: "Thank you for your purchase",
};

export default function OrderSuccessPage() {
  return (
    <div className="py-16">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-full bg-green-100 p-4 mx-auto w-16 h-16 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-4">Thank You For Your Order!</h1>
          <p className="text-gray-600 mb-8">
            Your order has been placed and is being processed. You will receive
            an email confirmation shortly with your order details.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium mb-4">Order Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Order Number:</span>{" "}
                <span className="text-gray-600">
                  #NKE
                  {Math.floor(Math.random() * 10000)
                    .toString()
                    .padStart(4, "0")}
                </span>
              </p>
              <p>
                <span className="font-medium">Estimated Delivery:</span>{" "}
                <span className="text-gray-600">
                  {new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </span>
              </p>
              <p>
                <span className="font-medium">Shipping Method:</span>{" "}
                <span className="text-gray-600">Standard Shipping</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
            {/* In the future we can link to an order tracking page */}
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
