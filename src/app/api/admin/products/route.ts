// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth/auth-options";

// Define the product schema for validation
const productSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  price: z.number().positive({ message: "Price must be a positive number" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  images: z
    .array(z.string().url())
    .min(1, { message: "At least one image is required" }),
  sizes: z.record(z.string(), z.number().int().nonnegative()),
  colors: z
    .array(z.string())
    .min(1, { message: "At least one color is required" }),
  featured: z.boolean().default(false),
  bestseller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
});

// POST - Create a new product
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: result.error.format() },
        { status: 400 }
      );
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: result.data.name,
        description: result.data.description,
        price: result.data.price,
        images: result.data.images,
        categoryId: result.data.categoryId,
        sizes: result.data.sizes,
        colors: result.data.colors,
        featured: result.data.featured,
        bestseller: result.data.bestseller,
        newArrival: result.data.newArrival,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET - List all products (for admin)
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const featured = url.searchParams.has("featured")
      ? url.searchParams.get("featured") === "true"
      : undefined;
    const bestseller = url.searchParams.has("bestseller")
      ? url.searchParams.get("bestseller") === "true"
      : undefined;
    const newArrival = url.searchParams.has("newArrival")
      ? url.searchParams.get("newArrival") === "true"
      : undefined;

    // Build filter conditions
    const whereClause: {
      categoryId?: string;
      featured?: boolean;
      bestseller?: boolean;
      newArrival?: boolean;
    } = {};

    if (category) {
      whereClause.categoryId = category;
    }

    if (featured !== undefined) {
      whereClause.featured = featured;
    }

    if (bestseller !== undefined) {
      whereClause.bestseller = bestseller;
    }

    if (newArrival !== undefined) {
      whereClause.newArrival = newArrival;
    }

    // Fetch products with filters
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
