/**
 * app/api/products/[slug]/route.ts
 * GET /api/products/:slug — returns a single product by its slug.
 * Returns 404 JSON if not found.
 *
 * Data source: Supabase `products` table, matched on the `slug` column.
 */
import { type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// ── Data-fetching function ────────────────────────────────────────────────
/**
 * Queries the `products` table for a row whose `slug` matches the argument.
 * Returns the product object, or `null` when no row is found.
 *
 * Uses `.maybeSingle()` so that "zero rows" resolves to `null` instead of
 * throwing a PostgREST error — keeping 404 handling simple in the handler.
 */
async function fetchProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data; // null when no row matches
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
