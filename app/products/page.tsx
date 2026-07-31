"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";
import type { Product } from "@/app/api/products/route";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    "Electronics",
    "Accessories",
    "Home & Kitchen",
    "Furniture",
    "Apparel",
    "Sports & Outdoors",
  ];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (category) params.append("category", category);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    }

    // Debounce the fetch slightly for smooth search input
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
          Our Products
        </h1>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-foreground/50" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative w-full sm:w-56">
            <select
              className="w-full px-4 py-2.5 border border-border rounded-xl bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 appearance-none shadow-sm cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-foreground/50">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
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
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-surface rounded-3xl border border-border shadow-sm text-center px-4">
          <div className="bg-background p-4 rounded-full mb-4">
            <Search className="h-8 w-8 text-foreground/40" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-foreground/60 mb-6 max-w-md">
            We couldn't find any products matching your search for "{search}" in {category || "all categories"}.
          </p>
          <button 
            onClick={() => { setSearch(""); setCategory(""); }}
            className="px-6 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-xl font-medium transition-colors duration-200"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
