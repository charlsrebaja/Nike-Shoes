// src/app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/lib/auth/auth-options";

// Define the product schema for validation
const productSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.number().positive({ message: "Price must be a positive number" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  images: z.array(z.string().url()).min(1, { message: "At least one image is required" }),
  sizes: z.record(z.string(), z.number().int().nonnegative()),
  colors: z.array(z.string()).min(1, { message: "At least one color is required" }),
  featured: z.boolean().default(false),
  bestseller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
});

// GET - Get a product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
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

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
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

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Delete the product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
