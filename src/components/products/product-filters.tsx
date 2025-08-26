// src/components/products/product-filters.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: Category[];
  minPrice?: number;
  maxPrice?: number;
}

export function ProductFilters({
  categories,
  minPrice = 0,
  maxPrice = 300,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get current filter values from URL
  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("minPrice") || minPrice.toString();
  const currentMaxPrice = searchParams.get("maxPrice") || maxPrice.toString();
  const currentSort = searchParams.get("sort") || "";
  const showFeatured = searchParams.get("featured") === "true";
  const showNew = searchParams.get("new") === "true";
  const showBestseller = searchParams.get("bestseller") === "true";

  // Local state for filters (for UI)
  const [localCategory, setLocalCategory] = useState(currentCategory);
  const [localMinPrice, setLocalMinPrice] = useState(currentMinPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(currentMaxPrice);
  const [localSort, setLocalSort] = useState(currentSort);
  const [localFeatured, setLocalFeatured] = useState(showFeatured);
  const [localNew, setLocalNew] = useState(showNew);
  const [localBestseller, setLocalBestseller] = useState(showBestseller);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Create new search params and navigate
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (localCategory) params.set("category", localCategory);
    if (localMinPrice !== minPrice.toString())
      params.set("minPrice", localMinPrice);
    if (localMaxPrice !== maxPrice.toString())
      params.set("maxPrice", localMaxPrice);
    if (localSort) params.set("sort", localSort);
    if (localFeatured) params.set("featured", "true");
    if (localNew) params.set("new", "true");
    if (localBestseller) params.set("bestseller", "true");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
      setIsFiltersOpen(false);
    });
  };

  const resetFilters = () => {
    setLocalCategory("");
    setLocalMinPrice(minPrice.toString());
    setLocalMaxPrice(maxPrice.toString());
    setLocalSort("");
    setLocalFeatured(false);
    setLocalNew(false);
    setLocalBestseller(false);

    startTransition(() => {
      router.push(pathname);
      setIsFiltersOpen(false);
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Filters</h3>
        <button
          className="text-sm text-gray-600 md:hidden"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          {isFiltersOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className={`${isFiltersOpen || "hidden md:block"} space-y-6`}>
        {/* Categories */}
        <div>
          <h4 className="font-medium mb-2 text-sm">Categories</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="all-categories"
                type="radio"
                name="category"
                checked={localCategory === ""}
                onChange={() => setLocalCategory("")}
                className="h-4 w-4 text-black border-gray-300 focus:ring-black"
              />
              <label
                htmlFor="all-categories"
                className="ml-2 text-sm text-gray-700"
              >
                All Categories
              </label>
            </div>

            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <input
                  id={`category-${category.id}`}
                  type="radio"
                  name="category"
                  checked={localCategory === category.id}
                  onChange={() => setLocalCategory(category.id)}
                  className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-2 text-sm">Price Range</h4>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="sr-only">Min Price</label>
              <div className="relative rounded-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-7 pr-2 py-1.5 text-sm focus:border-black focus:ring-black"
                  placeholder="Min"
                />
              </div>
            </div>
            <div className="w-1/2">
              <label className="sr-only">Max Price</label>
              <div className="relative rounded-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-7 pr-2 py-1.5 text-sm focus:border-black focus:ring-black"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div>
          <h4 className="font-medium mb-2 text-sm">Sort By</h4>
          <select
            value={localSort}
            onChange={(e) => setLocalSort(e.target.value)}
            className="block w-full rounded-md border-gray-300 py-1.5 text-sm focus:border-black focus:ring-black"
          >
            <option value="">Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Additional Filters */}
        <div>
          <h4 className="font-medium mb-2 text-sm">Additional Filters</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="featured"
                type="checkbox"
                checked={localFeatured}
                onChange={(e) => setLocalFeatured(e.target.checked)}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                Featured Products
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="new"
                type="checkbox"
                checked={localNew}
                onChange={(e) => setLocalNew(e.target.checked)}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label htmlFor="new" className="ml-2 text-sm text-gray-700">
                New Arrivals
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="bestseller"
                type="checkbox"
                checked={localBestseller}
                onChange={(e) => setLocalBestseller(e.target.checked)}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label
                htmlFor="bestseller"
                className="ml-2 text-sm text-gray-700"
              >
                Bestsellers
              </label>
            </div>
          </div>
        </div>

        {/* Apply/Reset Buttons */}
        <div className="pt-2 flex gap-3">
          <Button
            type="button"
            onClick={applyFilters}
            disabled={isPending}
            fullWidth
          >
            {isPending ? "Applying..." : "Apply Filters"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            disabled={isPending}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
