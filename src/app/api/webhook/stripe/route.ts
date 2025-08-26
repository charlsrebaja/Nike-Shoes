// src/app/api/webhook/stripe/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/db/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      throw new Error("Missing Stripe webhook secret");
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const err = error as Error;
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { message: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Find the order associated with this payment
      const order = await prisma.order.findFirst({
        where: {
          paymentIntentId: session.id,
        },
      });

      if (!order) {
        throw new Error(`No order found for payment: ${session.id}`);
      }

      // Update the order status to PAID
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "PROCESSING",
        },
      });

      // In a real-world application, you might want to:
      // 1. Send confirmation email to the customer
      // 2. Update inventory
      // 3. Notify fulfillment team
    } catch (error) {
      console.error("Error processing webhook:", error);
      return NextResponse.json(
        { message: "Error processing webhook" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
