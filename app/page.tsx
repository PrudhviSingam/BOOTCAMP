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
    image: "https://m.media-amazon.com/images/I/31nvao7P-9L._SL500_.jpg",
    category: "Electronics",
  },
  {
    slug: "mechanical-gaming-keyboard",
    name: "Mechanical Gaming Keyboard",
    price: 3499,
    image: "/images/mechanical-keyboard.png",
    category: "Electronics",
  },
  {
    slug: "premium-wireless-mouse",
    name: "Premium Wireless Mouse",
    price: 2999,
    image: "https://img.evetech.co.za/repository/ez/how-much-should-you-spend-on-a-wireless-gaming-mou-banner.webp",
    category: "Electronics",
  },
  {
    slug: "stainless-steel-water-bottle",
    name: "Stainless Steel Water Bottle",
    price: 1299,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    category: "Lifestyle",
  },
  {
    slug: "marshall-portable-speaker",
    name: "Marshall Portable Speaker",
    price: 21999,
    image: "https://images.ctfassets.net/javen7msabdh/7N04j6wBgof5Uw2e03iCc3/2f9dd0a80c40cbcd88303676eae0993b/01-middleton-front_side-desktop.jpeg",
    category: "Electronics",
  },
  {
    slug: "premium-swing-study-lamp",
    name: "Premium Swing Study Lamp",
    price: 1599,
    image: "https://m.media-amazon.com/images/I/71ey0OvpzcL._SL1500_.jpg",
    category: "Home",
  },
  {
    slug: "smart-fitness-tracker",
    name: "Smart Fitness Tracker",
    price: 3999,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80",
    category: "Electronics",
  },
  {
    slug: "hp-mini-printer",
    name: "HP Mini Printer",
    price: 12999,
    image: "https://i.rtings.com/assets/products/OrmPKs2a/hp-officejet-250/design-medium.jpg",
    category: "Electronics",
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
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
