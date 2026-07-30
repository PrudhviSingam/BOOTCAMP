"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Truck, Star } from "lucide-react";

const features = [
  { icon: Truck,       title: "Free Shipping",    desc: "On all orders above ₹999" },
  { icon: ShieldCheck, title: "Secure Payments",  desc: "256-bit SSL encryption"   },
  { icon: Star,        title: "Top-rated Brands", desc: "Curated quality products" },
  { icon: Zap,         title: "Fast Delivery",    desc: "2-3 business days"        },
];

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Decorative background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent)" }}
        />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-accent), transparent)" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent)" }}
        />
      </div>

      {/* Badge */}
      <div className="animate-fade-in mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
          <Zap className="w-3 h-3" aria-hidden="true" />
          Next-gen shopping experience
        </span>
      </div>

      {/* Headline */}
      <h1 className="animate-fade-in relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight max-w-4xl mb-6">
        Discover{" "}
        <span className="gradient-text">Premium Products</span>
        <br />
        Built for You
      </h1>

      {/* Subtext */}
      <p className="animate-fade-in relative z-10 text-base sm:text-lg text-muted max-w-2xl mb-10 leading-relaxed">
        Explore a curated collection of high-quality electronics, accessories,
        and lifestyle products — all at unbeatable prices with fast, secure checkout.
      </p>

      {/* CTAs */}
      <div className="animate-fade-in relative z-10 flex flex-col sm:flex-row gap-4 justify-center mb-20">
        <Link
          href="/products"
          id="hero-shop-now-btn"
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-100 transition-all duration-200"
        >
          Shop Now
          <ArrowRight
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          />
        </Link>
        <Link
          href="/products"
          id="hero-browse-btn"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-surface border border-border text-foreground font-semibold text-sm hover:border-primary/50 hover:bg-surface/80 transition-all duration-200"
        >
          Browse Collection
        </Link>
      </div>

      {/* Feature strip */}
      <div className="animate-fade-in relative z-10 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="glass rounded-xl p-4 text-center hover:border-primary/30 transition-all duration-200 group"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg gradient-primary mb-3 group-hover:scale-110 transition-transform">
              <Icon className="w-5 h-5 text-white" aria-hidden="true" />
            </span>
            <p className="text-sm font-semibold text-foreground mb-0.5">{title}</p>
            <p className="text-xs text-muted">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
