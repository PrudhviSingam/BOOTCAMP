/**
 * app/products/[slug]/not-found.tsx
 * Rendered when notFound() is called from the product detail page server component.
 * Matches the site's dark design system (bg-background, surface cards, primary accent).
 */
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PackageX, ArrowLeft, Search } from "lucide-react";

export default function ProductNotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-20">
        <div className="animate-fade-in text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-5 rounded-2xl bg-surface border border-border">
              <PackageX className="w-12 h-12 text-muted" aria-hidden="true" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-foreground mb-3">
            Product Not Found
          </h1>
          <p className="text-muted leading-relaxed mb-8">
            We couldn&apos;t find the product you&apos;re looking for. It may
            have been removed or the link might be incorrect.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              id="not-found-browse-products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-all duration-150"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              Browse All Products
            </Link>
            <Link
              href="/"
              id="not-found-go-home"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border text-foreground font-semibold text-sm hover:border-primary/40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
