// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    let averageRating = 0;
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      averageRating = totalRating / product.reviews.length;
    }

    // Get related products
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: {
          not: product.id,
        },
      },
      take: 4,
    });

    return NextResponse.json({
      product,
      averageRating,
      relatedProducts,
    });
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
