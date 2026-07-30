"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  slug: string;
  category: string;
}

const CATEGORIES = ["All", "Electronics", "Accessories", "Lifestyle", "Kitchen"];

export default function ProductsGrid() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All");

  const fetchProducts = useCallback(async (q: string, cat: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q)           params.set("search",   q);
      if (cat && cat !== "All") params.set("category", cat);

      const res  = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(search, category); }, []);

  // Push search+category to URL params
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search)            params.set("search",   search);
    if (category !== "All") params.set("category", category);
    router.replace(`/products?${params}`);
    fetchProducts(search, category);
  }

  function handleCategoryChange(cat: string) {
    setCategory(cat);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (cat !== "All") params.set("category", cat);
    router.replace(`/products?${params}`);
    fetchProducts(search, cat);
  }

  function clearFilters() {
    setSearch("");
    setCategory("All");
    router.replace("/products");
    fetchProducts("", "All");
  }

  const hasFilters = search || category !== "All";

  return (
    <div>
      {/* Search + filter bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-8"
        role="search"
        aria-label="Search and filter products"
      >
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="products-search-input"
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Category dropdown */}
        <div className="relative">
          <SlidersHorizontal
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
            aria-hidden="true"
          />
          <select
            id="products-category-filter"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            aria-label="Filter by category"
            className="pl-10 pr-8 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm appearance-none focus:outline-none focus:border-primary/60 transition-colors cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          id="products-search-btn"
          className="px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Search
        </button>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            aria-label="Clear filters"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-muted hover:text-error hover:border-error/40 transition-colors"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            Clear
          </button>
        )}
      </form>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-muted mb-6">
          {products.length} product{products.length !== 1 ? "s" : ""} found
          {hasFilters && " for your filters"}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-surface border border-border">
              <div className="aspect-square skeleton" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="skeleton h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <Search className="w-12 h-12 text-muted" aria-hidden="true" />
          <p className="text-lg font-semibold text-foreground">No products found</p>
          <p className="text-sm text-muted">Try adjusting your search or filters.</p>
          <button
            onClick={clearFilters}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image_url}
              name={product.name}
              price={product.price}
              slug={product.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
