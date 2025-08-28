// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000");
    const sort = searchParams.get("sort");
    const featured = searchParams.get("featured") === "true";
    const newArrival = searchParams.get("new") === "true";
    const bestseller = searchParams.get("bestseller") === "true";

    // Calculate offset
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      AND: [
        // Search term
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},

        // Category filter
        category ? { categoryId: category } : {},

        // Price range filter
        {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },

        // Product type filters
        featured ? { featured: true } : {},
        newArrival ? { newArrival: true } : {},
        bestseller ? { bestseller: true } : {},
      ],
    };

    // Build order by
    let orderBy: Prisma.ProductOrderByWithRelationInput = {};

    if (sort) {
      switch (sort) {
        case "price_asc":
          orderBy = { price: "asc" };
          break;
        case "price_desc":
          orderBy = { price: "desc" };
          break;
        case "newest":
          orderBy = { createdAt: "desc" };
          break;
        default:
          orderBy = { createdAt: "desc" };
      }
    } else {
      // Default sort
      orderBy = { createdAt: "desc" };
    }

    // Query products
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
