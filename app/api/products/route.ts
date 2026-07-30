/**
 * app/api/products/route.ts
 * GET /api/products — returns all products.
 * Supports ?search= and ?category= query params.
 *
 * Data source: Supabase products table (falls back to placeholder array
 * if Supabase is not configured).
 */
import { type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// ── Placeholder data (used when Supabase is not configured) ────
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

// ── Data-fetching function (easy to swap for real Supabase query) ──
async function fetchProducts(search?: string | null, category?: string | null) {
  const supabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseConfigured) {
    let query = supabase.from("products").select("*");

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }
    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  // Fallback: filter placeholder array
  let products = [...PLACEHOLDER_PRODUCTS];
  if (search) {
    products = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (category) {
    products = products.filter((p) => p.category === category);
  }
  return products;
}

// ── Route handler ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const search   = request.nextUrl.searchParams.get("search");
    const category = request.nextUrl.searchParams.get("category");

    const products = await fetchProducts(search, category);
    return Response.json({ products });
  } catch (error) {
    console.error("[/api/products] Error:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
