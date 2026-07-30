import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsGrid from "./_components/ProductsGrid";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse our curated collection of premium electronics, accessories, and lifestyle products.",
};

// Products page uses Suspense so the search-params-driven grid can use useSearchParams
export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
            All Products
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">Shop Everything</h1>
        </div>
        <Suspense fallback={<ProductsGridSkeleton />}>
          <ProductsGrid />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function ProductsGridSkeleton() {
  return (
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
  );
}
