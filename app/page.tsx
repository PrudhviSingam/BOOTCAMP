import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "NexCart — Premium Products, Fast Delivery",
};

// Placeholder featured products — replaced by real Supabase data in T11
const FEATURED_PRODUCTS = [
  {
    slug: "wireless-noise-cancelling-headphones",
    name: "Wireless Noise-Cancelling Headphones",
    price: 4999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    category: "Electronics",
  },
  {
    slug: "mechanical-gaming-keyboard",
    name: "Mechanical Gaming Keyboard",
    price: 3499,
    image: "https://images.unsplash.com/photo-1601445638532-c90e31ece6e6?w=600&q=80",
    category: "Electronics",
  },
  {
    slug: "minimalist-leather-wallet",
    name: "Minimalist Leather Wallet",
    price: 899,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
    category: "Accessories",
  },
  {
    slug: "stainless-steel-water-bottle",
    name: "Stainless Steel Water Bottle",
    price: 1299,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    category: "Lifestyle",
  },
  {
    slug: "portable-bluetooth-speaker",
    name: "Portable Bluetooth Speaker",
    price: 2199,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
    category: "Electronics",
  },
  {
    slug: "organic-cotton-tote-bag",
    name: "Organic Cotton Tote Bag",
    price: 599,
    image: "https://images.unsplash.com/photo-1597484661973-ee6cd0b6482c?w=600&q=80",
    category: "Lifestyle",
  },
  {
    slug: "smart-fitness-tracker",
    name: "Smart Fitness Tracker",
    price: 3999,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80",
    category: "Electronics",
  },
  {
    slug: "ceramic-pour-over-coffee-set",
    name: "Ceramic Pour-Over Coffee Set",
    price: 1799,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    category: "Kitchen",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* Featured Products Section */}
        <section
          id="featured-products"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
          aria-label="Featured products"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                Hand-picked for you
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products"
              id="homepage-view-all-btn"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              aria-label="View all products"
            >
              View all
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard
                key={product.slug}
                image={product.image}
                name={product.name}
                price={product.price}
                slug={product.slug}
                category={product.category}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
