"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle,
  ChevronLeft,
  Package,
  Star,
  LogIn,
  Loader2,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/lib/firebase";
import { signInWithGoogle } from "@/lib/firebase";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  slug: string;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { user } = useAuth();
  const { addToCart, setDrawerOpen, loading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded]       = useState(false);

  async function handleAddToCart() {
    if (!user) {
      await signInWithGoogle();
      return;
    }
    await addToCart(product.id, quantity);
    setAdded(true);
    setDrawerOpen(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="animate-fade-in">
      {/* Back link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-8"
        aria-label="Back to all products"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface border border-border">
          <Image
            src={product.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          {/* Category badge */}
          {product.category && (
            <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Package className="w-3 h-3" aria-hidden="true" />
              {product.category}
            </span>
          )}

          {/* Name */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight">
            {product.name}
          </h1>

          {/* Rating placeholder */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5" aria-label="Rating: 4.5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-sm text-muted">(124 reviews)</span>
          </div>

          {/* Price */}
          <p className="text-3xl font-bold text-primary">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          {/* Description */}
          <p className="text-sm text-muted leading-relaxed">{product.description}</p>

          {/* Stock */}
          <p className={`text-sm font-medium ${product.stock > 0 ? "text-success" : "text-error"}`}>
            {product.stock > 0
              ? `In Stock — ${product.stock} units available`
              : "Out of Stock"}
          </p>

          {/* Quantity selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted font-medium">Quantity</span>
            <div className="flex items-center gap-1 bg-surface border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="w-10 h-10 flex items-center justify-center text-muted hover:text-foreground hover:bg-background disabled:opacity-40 transition-colors"
              >
                <Minus className="w-4 h-4" aria-hidden="true" />
              </button>
              <span
                className="w-10 text-center font-semibold text-foreground"
                aria-label={`Quantity: ${quantity}`}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                disabled={quantity >= (product.stock || 99)}
                aria-label="Increase quantity"
                className="w-10 h-10 flex items-center justify-center text-muted hover:text-foreground hover:bg-background disabled:opacity-40 transition-colors"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Add to Cart button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="product-detail-add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={loading || product.stock === 0}
              className={`group flex items-center justify-center gap-2 flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                added
                  ? "bg-success text-white"
                  : "gradient-primary text-white hover:opacity-90 active:scale-95"
              }`}
              aria-label={user ? "Add to cart" : "Sign in to add to cart"}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Adding...
                </>
              ) : added ? (
                <>
                  <CheckCircle className="w-4 h-4" aria-hidden="true" />
                  Added to Cart
                </>
              ) : user ? (
                <>
                  <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                  Add to Cart
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  Sign in to Add
                </>
              )}
            </button>

            <Link
              href="/checkout"
              id="product-detail-buy-now-btn"
              className="flex items-center justify-center gap-2 flex-1 py-3.5 rounded-xl bg-surface border border-border text-foreground font-semibold text-sm hover:border-primary/40 transition-colors"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
