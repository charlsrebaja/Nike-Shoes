// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Stripe from "stripe";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import { CheckoutRequestData } from "@/lib/types/checkout";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-07-30.basil", // Use the required Stripe API version
});

export async function POST(request: Request) {
  try {
    console.log("[CHECKOUT] Starting checkout process");

    // Check authentication
    const session = await getServerSession(authOptions);
    console.log("[CHECKOUT] Session check:", {
      hasSession: !!session,
      userId: session?.user?.id,
    });

    if (!session?.user) {
      console.log("[CHECKOUT] No session found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Parse request body
    const body = await request.json();
    const { items, customer, total } = body as CheckoutRequestData;
    console.log("[CHECKOUT] Request data:", {
      itemCount: items?.length,
      hasCustomer: !!customer,
      total,
    });

    if (!items || items.length === 0) {
      console.log("[CHECKOUT] No items in cart");
      return NextResponse.json(
        { message: "No items in cart" },
        { status: 400 }
      );
    }

    // Validate required customer fields
    if (!customer?.name || !customer?.email || !customer?.address) {
      console.log("[CHECKOUT] Missing customer data:", {
        name: !!customer?.name,
        email: !!customer?.email,
        address: !!customer?.address,
      });
      return NextResponse.json(
        { message: "Missing required customer information" },
        { status: 400 }
      );
    }

    // Validate Stripe secret key
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error(
        "[CHECKOUT] Missing STRIPE_SECRET_KEY environment variable"
      );
      return NextResponse.json(
        { message: "Payment service not configured" },
        { status: 500 }
      );
    }

    console.log("[CHECKOUT] Creating Stripe session");

    // Log items for debugging
    console.log(
      "[CHECKOUT] Items being processed:",
      items.map((item) => ({
        name: item.name,
        image: item.image,
        price: item.price,
      }))
    );

    // Create a Stripe checkout session
    // In a production application, we would create line items for each product
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => {
        // Validate and format image URL for Stripe
        let images: string[] = [];
        if (item.image && item.image.trim() !== "") {
          try {
            // Check if it's already an absolute URL
            if (
              item.image.startsWith("http://") ||
              item.image.startsWith("https://")
            ) {
              images = [item.image];
            } else if (item.image.startsWith("/")) {
              // Convert relative URL to absolute URL
              const baseUrl =
                process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
              images = [`${baseUrl}${item.image}`];
            }
            // If it's not a valid URL format, skip it
          } catch {
            console.warn(
              `[CHECKOUT] Invalid image URL for ${item.name}:`,
              item.image
            );
          }
        }

        console.log(`[CHECKOUT] Processed image for ${item.name}:`, {
          original: item.image,
          processed: images,
        });

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${item.name} (${item.size}, ${item.color})`,
              images: images.length > 0 ? images : undefined,
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
    console.log("[CHECKOUT] Stripe session created:", stripeSession.id);

    // First create shipping address
    console.log("[CHECKOUT] Creating address");
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
    console.log("[CHECKOUT] Address created:", address.id);

    // Then create order with address reference
    console.log("[CHECKOUT] Creating order");
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
    console.log("[CHECKOUT] Order created:", order.id);

    return NextResponse.json({
      orderId: order.id,
      url: stripeSession.url,
    });
  } catch (error) {
    console.error("[CHECKOUT_POST] Error occurred:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      console.error("[CHECKOUT_POST] Error message:", error.message);
      console.error("[CHECKOUT_POST] Error stack:", error.stack);

      if (error.message.includes("authentication")) {
        return NextResponse.json(
          { message: "Payment service authentication failed" },
          { status: 500 }
        );
      }
      if (error.message.includes("validation")) {
        return NextResponse.json(
          { message: "Invalid payment data" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
