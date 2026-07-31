"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/firebase";

// ── Types ──────────────────────────────────────────────────────
export interface CartItem {
  id: string;          // cart_items row id
  product_id: string;
  quantity: number;
  name: string;
  price: number;
  image_url: string;
  slug: string;
}

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  loading: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// ── Context ────────────────────────────────────────────────────
const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────
export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems]           = useState<CartItem[]>([]);
  const [loading, setLoading]       = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Fetch cart from API ──────────────────────────────────────
  const refreshCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/cart?user_id=${encodeURIComponent(user.uid)}`);
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      // silently fail — cart just stays empty
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Reload cart whenever auth user changes
  useEffect(() => { refreshCart(); }, [refreshCart]);

  // ── Add to cart ──────────────────────────────────────────────
  const addToCart = useCallback(async (productId: string, quantity = 1) => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.uid, product_id: productId, quantity }),
      });
      if (res.ok) await refreshCart();
    } finally {
      setLoading(false);
    }
  }, [user, refreshCart]);

  // ── Update quantity ──────────────────────────────────────────
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, quantity }),
      });
      if (res.ok) await refreshCart();
    } finally {
      setLoading(false);
    }
  }, [refreshCart]);

  // ── Remove from cart ─────────────────────────────────────────
  const removeFromCart = useCallback(async (itemId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cart?id=${encodeURIComponent(itemId)}`, {
        method: "DELETE",
      });
      if (res.ok) await refreshCart();
    } finally {
      setLoading(false);
    }
  }, [refreshCart]);

  // ── Clear cart (called after successful payment verification) ──
  const clearCart = useCallback(async () => {
    // Delete every cart item from Supabase via the existing DELETE endpoint
    await Promise.all(
      items.map((item) =>
        fetch(`/api/cart?id=${encodeURIComponent(item.id)}`, { method: "DELETE" })
      )
    );
    setItems([]);
  }, [items]);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal  = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        loading,
        drawerOpen,
        setDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
