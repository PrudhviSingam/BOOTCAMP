"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Truck, Star } from "lucide-react";

/* ─── Feature strip data ─────────────────────────────────────────────── */
const features = [
  { icon: Truck,       title: "Free Shipping",    desc: "On all orders above ₹999" },
  { icon: ShieldCheck, title: "Secure Payments",  desc: "256-bit SSL encryption"   },
  { icon: Star,        title: "Top-rated Brands", desc: "Curated quality products" },
  { icon: Zap,         title: "Fast Delivery",    desc: "2-3 business days"        },
];

/* ─── Component ──────────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Background: layered gradient from theme tokens only ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Base directional gradient — background → surface → background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, var(--color-background) 0%, var(--color-surface) 50%, var(--color-background) 100%)",
          }}
        />
        {/* Primary glow — top-left */}
        <div
          className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full blur-3xl opacity-25"
          style={{
            background: "radial-gradient(circle at center, var(--color-primary), transparent 70%)",
          }}
        />
        {/* Accent glow — bottom-right */}
        <div
          className="absolute -bottom-40 -right-40 w-[550px] h-[550px] rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle at center, var(--color-accent), transparent 70%)",
          }}
        />
        {/* Centre halo */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-3xl opacity-5"
          style={{
            background: "radial-gradient(circle at center, var(--color-primary), transparent 70%)",
          }}
        />
      </div>

      {/* ── Badge ── */}
      <div className="animate-fade-in relative z-10 mb-6">
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{
            border: "1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)",
            background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
            color: "var(--color-primary)",
          }}
        >
          <Zap className="w-3 h-3" aria-hidden="true" />
          Next-gen shopping experience
        </span>
      </div>

      {/* ── Headline ── */}
      <h1
        className="animate-fade-in relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight max-w-4xl mb-6"
        style={{ color: "var(--color-foreground)" }}
      >
        Discover{" "}
        <span className="gradient-text">Premium Products</span>
        <br />
        Built for You
      </h1>

      {/* ── Subtext ── */}
      <p
        className="animate-fade-in relative z-10 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed"
        style={{ color: "var(--color-muted)" }}
      >
        Explore a curated collection of high-quality electronics, accessories,
        and lifestyle products — all at unbeatable prices with fast, secure checkout.
      </p>

      {/* ── CTAs ── */}
      <div className="animate-fade-in relative z-10 flex flex-col sm:flex-row gap-4 justify-center mb-20">
        {/* Primary CTA — gradient-primary utility = linear-gradient(135deg, primary → accent) */}
        <Link
          href="/products"
          id="hero-shop-now-btn"
          className="group gradient-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-100"
          style={{
            color: "var(--color-primary-foreground)",
            boxShadow:
              "0 8px 32px color-mix(in srgb, var(--color-primary) 35%, transparent)",
          }}
        >
          Shop Now
          <ArrowRight
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          />
        </Link>

        {/* Secondary CTA */}
        <Link
          href="/products"
          id="hero-browse-btn"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-foreground)",
          }}
        >
          Browse Collection
        </Link>
      </div>

      {/* ── Feature strip ── */}
      <div className="animate-fade-in relative z-10 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="glass rounded-xl p-4 text-center transition-all duration-200 group"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg gradient-primary mb-3 group-hover:scale-110 transition-transform">
              <Icon
                className="w-5 h-5"
                style={{ color: "var(--color-primary-foreground)" }}
                aria-hidden="true"
              />
            </span>
            <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-foreground)" }}>
              {title}
            </p>
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
