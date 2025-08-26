// src/app/(shop)/checkout/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { Container } from "@/components/ui/container";
import { authOptions } from "@/lib/auth/auth-options";
import { CheckoutForm } from "./checkout-form";

export const metadata = {
  title: "Checkout | Nike Shoes Shop",
  description: "Complete your purchase",
};

export default async function CheckoutPage() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?redirect=/checkout");
  }

  return (
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </div>

        <CheckoutForm user={session.user} />
      </Container>
    </div>
  );
}
