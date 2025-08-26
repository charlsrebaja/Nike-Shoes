// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Stripe from "stripe";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import { CheckoutItem, CheckoutRequestData } from "@/lib/types/checkout";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16", // Use a compatible version
});

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Parse request body
    const body = await request.json();
    const { items, customer, total } = body as CheckoutRequestData;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "No items in cart" },
        { status: 400 }
      );
    }

    // Create a Stripe checkout session
    // In a production application, we would create line items for each product
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${item.name} (${item.size}, ${item.color})`,
              images: [item.image],
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        userId,
      },
    });

    // First create shipping address
    const address = await prisma.address.create({
      data: {
        userId,
        street: customer.address,
        city: customer.city,
        state: customer.state,
        postalCode: customer.postalCode,
        country: customer.country,
      },
    });

    // Then create order with address reference
    const order = await prisma.order.create({
      data: {
        userId,
        total: total,
        status: "PENDING",
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price,
          })),
        },
        addressId: address.id,
        paymentIntentId: stripeSession.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      url: stripeSession.url,
    });
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
