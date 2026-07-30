/**
 * app/api/products/[slug]/route.ts
 * GET /api/products/:slug — returns a single product by its slug.
 * Returns 404 JSON if not found.
 *
 * Data source: in-memory placeholder array (same 8 products as the parent
 * route, kept as a local copy so this file has no dependency on it).
 * To swap for a real Supabase query, replace the body of
 * `fetchProductBySlug` — see the comment there for a ready-made snippet.
 */
import { type NextRequest } from "next/server";

// ── Placeholder data ──────────────────────────────────────────────────────
// Local copy of the 8 shared products. Keep in sync with
// app/api/products/route.ts until a shared data-access layer is introduced.
const PLACEHOLDER_PRODUCTS = [
  { id: "p1", name: "Wireless Noise-Cancelling Headphones", description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and studio-quality sound.", price: 4999, image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", category: "Electronics", stock: 50, slug: "wireless-noise-cancelling-headphones" },
  { id: "p2", name: "Mechanical Gaming Keyboard", description: "Compact TKL layout with tactile blue switches, per-key RGB backlighting, and aircraft-grade aluminum frame.", price: 3499, image_url: "https://images.unsplash.com/photo-1601445638532-c90e31ece6e6?w=600&q=80", category: "Electronics", stock: 35, slug: "mechanical-gaming-keyboard" },
  { id: "p3", name: "Minimalist Leather Wallet", description: "Slim bifold wallet crafted from full-grain leather. RFID-blocking lining protects your contactless cards.", price: 899, image_url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80", category: "Accessories", stock: 120, slug: "minimalist-leather-wallet" },
  { id: "p4", name: "Stainless Steel Water Bottle", description: "Triple-insulated 750ml bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof lid.", price: 1299, image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80", category: "Lifestyle", stock: 200, slug: "stainless-steel-water-bottle" },
  { id: "p5", name: "Portable Bluetooth Speaker", description: "Compact 20W speaker with 360-degree sound, deep bass, and IPX7 waterproofing. 12 hours playback.", price: 2199, image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80", category: "Electronics", stock: 60, slug: "portable-bluetooth-speaker" },
  { id: "p6", name: "Organic Cotton Tote Bag", description: "Durable 100% organic cotton canvas tote with reinforced handles and interior zip pocket.", price: 599, image_url: "https://images.unsplash.com/photo-1597484661973-ee6cd0b6482c?w=600&q=80", category: "Lifestyle", stock: 300, slug: "organic-cotton-tote-bag" },
  { id: "p7", name: "Smart Fitness Tracker", description: "Slim wrist band with heart rate monitor, SpO2 sensor, sleep tracking, and 7-day battery.", price: 3999, image_url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80", category: "Electronics", stock: 80, slug: "smart-fitness-tracker" },
  { id: "p8", name: "Ceramic Pour-Over Coffee Set", description: "Handcrafted ceramic dripper and server set for the perfect pour-over ritual. Holds 600ml, dishwasher-safe.", price: 1799, image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", category: "Kitchen", stock: 45, slug: "ceramic-pour-over-coffee-set" },
];

// ── Data-fetching function ────────────────────────────────────────────────
/**
 * Returns the product matching `slug`, or `null` when not found.
 *
 * ─── Supabase swap-in (replace the entire function body) ───────────────
 *   import { supabase } from "@/lib/supabase";
 *
 *   const { data, error } = await supabase
 *     .from("products")
 *     .select("*")
 *     .eq("slug", slug)
 *     .maybeSingle();          // returns null instead of error on 0 rows
 *
 *   if (error) throw error;
 *   return data;               // null when no row matches
 * ───────────────────────────────────────────────────────────────────────
 */
async function fetchProductBySlug(slug: string) {
  return PLACEHOLDER_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

// ── Route handler ─────────────────────────────────────────────────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await fetchProductBySlug(slug);

    if (!product) {
      return Response.json(
        { error: "Product not found", slug },
        { status: 404 }
      );
    }

    return Response.json({ product });
  } catch (error) {
    console.error("[/api/products/[slug]] Error:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
