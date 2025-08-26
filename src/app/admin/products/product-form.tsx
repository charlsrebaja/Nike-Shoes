// src/app/admin/products/product-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  images: string[];
  categoryId: string;
  sizes: Record<string, number>;
  colors: string[];
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
}

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    images: string[];
    categoryId: string;
    sizes: Record<string, number>;
    colors: string[];
    featured: boolean;
    bestseller: boolean;
    newArrival: boolean;
  };
  categories: Category[];
}

// Available sizes for Nike shoes
const availableSizes = ["US 7", "US 7.5", "US 8", "US 8.5", "US 9", "US 9.5", "US 10", "US 10.5", "US 11", "US 12"];

// Some common Nike shoe colors
const commonColors = ["Black", "White", "Red", "Blue", "Grey", "Green", "Orange", "Pink", "Purple", "Yellow"];

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Initialize form data with product values if editing, or default values if creating new
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price ? String(product.price) : "",
    images: product?.images || ["", "", ""],
    categoryId: product?.categoryId || (categories[0]?.id || ""),
    sizes: product?.sizes || availableSizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {}),
    colors: product?.colors || [],
    featured: product?.featured || false,
    bestseller: product?.bestseller || false,
    newArrival: product?.newArrival || false,
  });

  const [selectedColors, setSelectedColors] = useState<Record<string, boolean>>(
    commonColors.reduce((acc, color) => ({
      ...acc,
      [color]: formData.colors.includes(color),
    }), {})
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSizeStockChange = (size: string, stock: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: stock,
      },
    }));
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) => ({
      ...prev,
      [color]: !prev[color],
    }));
    
    // Update formData.colors based on selected colors
    const newColors = Object.keys(selectedColors).filter(
      (color) => color === color ? !selectedColors[color] : selectedColors[color]
    );
    
    setFormData((prev) => ({
      ...prev,
      colors: newColors,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Validate form data
      if (!formData.name || !formData.price || !formData.categoryId) {
        throw new Error("Please fill in all required fields");
      }

      // Filter out empty image URLs
      const filteredImages = formData.images.filter((img) => img.trim() !== "");
      if (filteredImages.length === 0) {
        throw new Error("Please provide at least one product image");
      }

      // Calculate active colors from selectedColors
      const activeColors = Object.keys(selectedColors).filter(
        (color) => selectedColors[color]
      );
      
      if (activeColors.length === 0) {
        throw new Error("Please select at least one color");
      }
      
      // Check if any sizes have stock
      const hasSizesInStock = Object.values(formData.sizes).some((stock) => stock > 0);
      if (!hasSizesInStock) {
        throw new Error("Please add stock for at least one size");
      }

      // Prepare data for submission
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        images: filteredImages,
        colors: activeColors,
      };

      // Determine if we're creating or updating a product
      const url = product 
        ? `/api/admin/products/${product.id}` 
        : "/api/admin/products";
      
      const method = product ? "PUT" : "POST";

      // Submit the form
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save product");
      }

      const result = await response.json();
      
      setSuccessMessage("Product saved successfully!");
      
      // If creating a new product, redirect to edit page after a brief delay
      if (!product) {
        setTimeout(() => {
          router.push(`/admin/products/${result.id}/edit`);
        }, 1500);
      } else {
        // Refresh the page to show updated data
        router.refresh();
      }
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Product Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Basic Information</h2>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name*
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)*
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Category*
            </label>
            <select
              id="categoryId"
              name="categoryId"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Product Images */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Product Images</h2>
          <p className="text-sm text-gray-500 mb-2">
            Enter URLs for product images (at least one required)
          </p>
          
          {formData.images.map((image, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {index === 0 ? "Main Image*" : `Additional Image ${index}`}
              </label>
              <Input
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="https://example.com/image.jpg"
                required={index === 0}
              />
            </div>
          ))}
          
          {formData.images.length < 6 && (
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ""],
              }))}
            >
              Add Another Image
            </Button>
          )}
        </div>
      </div>
      
      {/* Sizes and Stock */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Sizes & Stock</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {availableSizes.map((size) => (
            <div key={size} className="border rounded-md p-3">
              <label className="block text-sm font-medium mb-1">
                {size}
              </label>
              <Input
                type="number"
                min="0"
                value={formData.sizes[size] || 0}
                onChange={(e) => 
                  handleSizeStockChange(size, parseInt(e.target.value) || 0)
                }
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Colors */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Colors</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {commonColors.map((color) => (
            <div 
              key={color}
              className={`border rounded-md p-3 cursor-pointer ${
                selectedColors[color] ? "bg-gray-100 border-black" : ""
              }`}
              onClick={() => handleColorToggle(color)}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedColors[color] || false}
                  onChange={() => handleColorToggle(color)}
                  className="mr-2"
                />
                <span>{color}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Product Flags */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Product Status</h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
              Featured Product
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="newArrival"
              name="newArrival"
              checked={formData.newArrival}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label htmlFor="newArrival" className="ml-2 block text-sm text-gray-900">
              New Arrival
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="bestseller"
              name="bestseller"
              checked={formData.bestseller}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label htmlFor="bestseller" className="ml-2 block text-sm text-gray-900">
              Bestseller
            </label>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner size="small" className="mr-2" />
              {product ? "Updating..." : "Creating..."}
            </>
          ) : (
            product ? "Update Product" : "Create Product"
          )}
        </Button>
      </div>
    </form>
  );
}
