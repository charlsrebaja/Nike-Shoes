// src/app/api/cart/[itemId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const updateCartItemSchema = z.object({
  quantity: z.number().min(0),
});

// PUT /api/cart/[itemId] - Update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;
    const body = await request.json();
    const { quantity } = updateCartItemSchema.parse(body);

    // Verify item belongs to user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Check if item exists and belongs to user's cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
      return NextResponse.json({ message: "Item removed from cart" });
    } else {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
            },
          },
        },
      });

      // Transform to match the expected format
      const transformedItem = {
        id: updatedItem.id,
        productId: updatedItem.productId,
        name: updatedItem.product.name,
        price: parseFloat(updatedItem.product.price.toString()),
        image: updatedItem.product.images[0] || "",
        quantity: updatedItem.quantity,
        size: updatedItem.size,
        color: updatedItem.color,
      };

      return NextResponse.json(transformedItem);
    }
  } catch (error) {
    console.error("Error updating cart item:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[itemId] - Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;

    // Verify item belongs to user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Check if item exists and belongs to user's cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
