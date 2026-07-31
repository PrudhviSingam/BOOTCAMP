"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/lib/firebase";
import { signInWithGoogle } from "@/lib/firebase";

export default function CartPageClient() {
  const { user } = useAuth();
  const { items, subtotal, loading, updateQuantity, removeFromCart } = useCart();

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <span className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
          <ShoppingCart className="w-8 h-8 text-primary-foreground" aria-hidden="true" />
        </span>
        <div>
          <p className="text-lg font-semibold text-foreground mb-1">Sign in to view your cart</p>
          <p className="text-sm text-muted">Your saved items will appear here.</p>
        </div>
        <button
          id="cart-page-signin-btn"
          onClick={signInWithGoogle}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-muted">
        <Loader2 className="w-8 h-8 animate-spin" aria-hidden="true" />
        <p className="text-sm">Loading your cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <span className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center">
          <ShoppingCart className="w-8 h-8 text-muted" aria-hidden="true" />
        </span>
        <div>
          <p className="text-lg font-semibold text-foreground mb-1">Your cart is empty</p>
          <p className="text-sm text-muted">Add some products to get started.</p>
        </div>
        <Link href="/products" className="text-sm text-primary hover:underline">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Items list */}
      <ul className="space-y-4" role="list" aria-label="Cart items">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 p-4 bg-surface rounded-2xl border border-border">
            <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-border bg-background">
              <Image
                src={item.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80"}
                alt={item.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <Link href={`/products/${item.slug}`} className="text-sm font-semibold text-foreground hover:text-primary line-clamp-2">
                {item.name}
              </Link>
              <p className="text-primary font-bold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 bg-background border border-border rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1 || loading} aria-label={`Decrease quantity of ${item.name}`} className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground disabled:opacity-40 transition-colors">
                    <Minus className="w-3 h-3" aria-hidden="true" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-foreground" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={loading} aria-label={`Increase quantity of ${item.name}`} className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground disabled:opacity-40 transition-colors">
                    <Plus className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} disabled={loading} aria-label={`Remove ${item.name} from cart`} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-error hover:bg-error/10 disabled:opacity-40 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <div className="p-6 bg-surface border border-border rounded-2xl flex flex-col gap-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-bold text-xl text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <p className="text-xs text-muted">Shipping &amp; taxes calculated at checkout.</p>
        <Link href="/checkout" id="cart-page-checkout-btn" className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-all">
          Proceed to Checkout
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
