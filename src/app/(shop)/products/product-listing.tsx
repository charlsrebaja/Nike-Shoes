// src/app/(shop)/products/product-listing.tsx
"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: {
    id: string;
    name: string;
  };
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface ProductListingProps {
  searchParams: { [key: string]: string | string[] | undefined };
  categories: Category[];
}

export function ProductListing({
  searchParams,
  categories,
}: ProductListingProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  // Parse search params - handle both string and string[] types
  const search = Array.isArray(searchParams.search)
    ? searchParams.search[0] || ""
    : searchParams.search || "";
  const categoryParam = Array.isArray(searchParams.category)
    ? searchParams.category[0] || ""
    : searchParams.category || "";
  const minPrice = Array.isArray(searchParams.minPrice)
    ? searchParams.minPrice[0] || "0"
    : searchParams.minPrice || "0";
  const maxPrice = Array.isArray(searchParams.maxPrice)
    ? searchParams.maxPrice[0] || "1000"
    : searchParams.maxPrice || "1000";
  const sort = Array.isArray(searchParams.sort)
    ? searchParams.sort[0] || ""
    : searchParams.sort || "";
  const featured =
    (Array.isArray(searchParams.featured)
      ? searchParams.featured[0]
      : searchParams.featured) === "true";
  const newArrival =
    (Array.isArray(searchParams.new)
      ? searchParams.new[0]
      : searchParams.new) === "true";
  const bestseller =
    (Array.isArray(searchParams.bestseller)
      ? searchParams.bestseller[0]
      : searchParams.bestseller) === "true";

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build query string from search params
        const queryParams = new URLSearchParams();
        if (search) queryParams.set("search", search);
        if (categoryParam) queryParams.set("category", categoryParam);
        if (minPrice) queryParams.set("minPrice", minPrice);
        if (maxPrice) queryParams.set("maxPrice", maxPrice);
        if (sort) queryParams.set("sort", sort);
        if (featured) queryParams.set("featured", "true");
        if (newArrival) queryParams.set("new", "true");
        if (bestseller) queryParams.set("bestseller", "true");
        queryParams.set("page", page.toString());
        queryParams.set("limit", "12");

        const response = await fetch(`/api/products?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (page === 1) {
          setProducts(data.products);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...data.products]);
        }

        setHasMore(data.pagination.hasMore);
        setTotalProducts(data.pagination.totalCount);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    search,
    categoryParam,
    minPrice,
    maxPrice,
    sort,
    featured,
    newArrival,
    bestseller,
    page,
  ]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    search,
    categoryParam,
    minPrice,
    maxPrice,
    sort,
    featured,
    newArrival,
    bestseller,
  ]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filters sidebar */}
      <div className="md:col-span-1">
        <ProductFilters categories={categories} />
      </div>

      {/* Product grid */}
      <div className="md:col-span-3">
        {/* Results summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {products.length} of {totalProducts} products
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {loading && page === 1 ? (
          <div className="flex justify-center items-center h-96">
            <Spinner size="large" />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={parseFloat(product.price.toString())}
                  image={product.images[0]}
                  category={product.category.name}
                  isNew={product.newArrival}
                  isFeatured={product.featured}
                  isBestseller={product.bestseller}
                />
              ))}
            </div>

            {/* Load more button */}
            {hasMore && (
              <div className="mt-12 text-center">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  size="lg"
                >
                  {loading ? <Spinner size="small" className="mr-2" /> : null}
                  Load More Products
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
