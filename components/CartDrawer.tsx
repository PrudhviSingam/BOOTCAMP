"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  LogIn,
  Loader2,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/lib/firebase";
import { signInWithGoogle } from "@/lib/firebase";

export default function CartDrawer() {
  const { user } = useAuth();
  const { items, subtotal, loading, drawerOpen, setDrawerOpen, updateQuantity, removeFromCart } =
    useCart();

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  if (!drawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm flex flex-col bg-surface border-l border-border shadow-2xl animate-slide-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 className="font-semibold text-foreground">Shopping Cart</h2>
          </div>
          <button
            id="cart-drawer-close-btn"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close cart"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-background border border-border text-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Not signed in */}
          {!user ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <span className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
                <LogIn className="w-8 h-8 text-primary-foreground" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-foreground mb-1">Sign in to view your cart</p>
                <p className="text-sm text-muted">Your saved items will appear here.</p>
              </div>
              <button
                id="cart-drawer-signin-btn"
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Sign in with Google
              </button>
            </div>
          ) : loading ? (
            /* Loading state */
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted">
              <Loader2 className="w-8 h-8 animate-spin" aria-hidden="true" />
              <p className="text-sm">Loading your cart...</p>
            </div>
          ) : items.length === 0 ? (
            /* Empty cart */
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <span className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-muted" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-foreground mb-1">Your cart is empty</p>
                <p className="text-sm text-muted">Add some products to get started.</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-sm text-primary hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            /* Cart items list */
            <ul className="divide-y divide-border" role="list" aria-label="Cart items">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 p-4">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-background border border-border">
                    <Image
                      src={item.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80"}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={() => setDrawerOpen(false)}
                      className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm font-bold text-primary">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>

                    {/* Quantity & remove row */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 bg-background rounded-lg border border-border overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-muted hover:text-foreground hover:bg-surface disabled:opacity-40 transition-colors"
                        >
                          <Minus className="w-3 h-3" aria-hidden="true" />
                        </button>
                        <span
                          className="w-6 text-center text-sm font-semibold text-foreground"
                          aria-label={`Quantity: ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="w-7 h-7 flex items-center justify-center text-muted hover:text-foreground hover:bg-surface transition-colors"
                        >
                          <Plus className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-error hover:bg-error/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only when signed in with items */}
        {user && items.length > 0 && (
          <div className="border-t border-border px-5 py-4 flex flex-col gap-3 bg-surface">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-bold text-lg text-foreground">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-xs text-muted">Shipping &amp; taxes calculated at checkout.</p>
            <Link
              href="/checkout"
              id="cart-drawer-checkout-btn"
              onClick={() => setDrawerOpen(false)}
              className="group flex items-center justify-center gap-2 w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
            >
              Proceed to Checkout
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
