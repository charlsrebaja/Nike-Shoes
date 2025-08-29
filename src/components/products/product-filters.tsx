// src/components/products/product-filters.tsx
"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
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
  const currentCategoryParam = searchParams.get("category") || "";
  const currentCategories = useMemo(
    () =>
      currentCategoryParam
        ? currentCategoryParam.split(",").filter(Boolean)
        : [],
    [currentCategoryParam]
  );
  const currentMinPrice = searchParams.get("minPrice") || minPrice.toString();
  const currentMaxPrice = searchParams.get("maxPrice") || maxPrice.toString();
  const currentSort = searchParams.get("sort") || "";
  const showFeatured = searchParams.get("featured") === "true";
  const showNew = searchParams.get("new") === "true";
  const showBestseller = searchParams.get("bestseller") === "true";

  // Local state for filters (for UI)
  const [localCategories, setLocalCategories] =
    useState<string[]>(currentCategories);
  const [localMinPrice, setLocalMinPrice] = useState(currentMinPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(currentMaxPrice);
  const [localSort, setLocalSort] = useState(currentSort);
  const [localFeatured, setLocalFeatured] = useState(showFeatured);
  const [localNew, setLocalNew] = useState(showNew);
  const [localBestseller, setLocalBestseller] = useState(showBestseller);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Helper function to build URL params and navigate
  const applyFiltersToURL = (
    updates: Partial<{
      categories: string[];
      minPrice: string;
      maxPrice: string;
      sort: string;
      featured: boolean;
      new: boolean;
      bestseller: boolean;
    }> = {}
  ) => {
    const params = new URLSearchParams();

    const finalCategories =
      updates.categories !== undefined ? updates.categories : localCategories;
    const finalMinPrice =
      updates.minPrice !== undefined ? updates.minPrice : localMinPrice;
    const finalMaxPrice =
      updates.maxPrice !== undefined ? updates.maxPrice : localMaxPrice;
    const finalSort = updates.sort !== undefined ? updates.sort : localSort;
    const finalFeatured =
      updates.featured !== undefined ? updates.featured : localFeatured;
    const finalNew = updates.new !== undefined ? updates.new : localNew;
    const finalBestseller =
      updates.bestseller !== undefined ? updates.bestseller : localBestseller;

    if (finalCategories.length > 0)
      params.set("category", finalCategories.join(","));
    if (finalMinPrice !== minPrice.toString())
      params.set("minPrice", finalMinPrice);
    if (finalMaxPrice !== maxPrice.toString())
      params.set("maxPrice", finalMaxPrice);
    if (finalSort) params.set("sort", finalSort);
    if (finalFeatured) params.set("featured", "true");
    if (finalNew) params.set("new", "true");
    if (finalBestseller) params.set("bestseller", "true");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Sync local state with URL changes
  useEffect(() => {
    setLocalCategories(currentCategories);
    setLocalMinPrice(currentMinPrice);
    setLocalMaxPrice(currentMaxPrice);
    setLocalSort(currentSort);
    setLocalFeatured(showFeatured);
    setLocalNew(showNew);
    setLocalBestseller(showBestseller);
  }, [
    currentCategories,
    currentMinPrice,
    currentMaxPrice,
    currentSort,
    showFeatured,
    showNew,
    showBestseller,
  ]);

  // Create new search params and navigate
  const applyFilters = () => {
    applyFiltersToURL();
    setIsFiltersOpen(false);
  };

  const resetFilters = () => {
    setLocalCategories([]);
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
                type="checkbox"
                checked={localCategories.length === 0}
                onChange={() => {
                  setLocalCategories([]);
                  applyFiltersToURL({ categories: [] });
                }}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label
                htmlFor="all-categories"
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                All Categories
              </label>
            </div>

            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <input
                  id={`category-${category.id}`}
                  type="checkbox"
                  checked={localCategories.includes(category.id)}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...localCategories, category.id]
                      : localCategories.filter((id) => id !== category.id);
                    setLocalCategories(newCategories);
                    applyFiltersToURL({ categories: newCategories });
                  }}
                  className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
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
                  onBlur={() => {
                    applyFiltersToURL({ minPrice: localMinPrice });
                  }}
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
                  onBlur={() => {
                    applyFiltersToURL({ maxPrice: localMaxPrice });
                  }}
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
            onChange={(e) => {
              setLocalSort(e.target.value);
              applyFiltersToURL({ sort: e.target.value });
            }}
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
                onChange={(e) => {
                  setLocalFeatured(e.target.checked);
                  applyFiltersToURL({ featured: e.target.checked });
                }}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label
                htmlFor="featured"
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                Featured Products
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="new"
                type="checkbox"
                checked={localNew}
                onChange={(e) => {
                  setLocalNew(e.target.checked);
                  applyFiltersToURL({ new: e.target.checked });
                }}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label
                htmlFor="new"
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                New Arrivals
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="bestseller"
                type="checkbox"
                checked={localBestseller}
                onChange={(e) => {
                  setLocalBestseller(e.target.checked);
                  applyFiltersToURL({ bestseller: e.target.checked });
                }}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label
                htmlFor="bestseller"
                className="ml-2 text-sm text-gray-700 cursor-pointer"
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
