/**
 * app/api/admin/orders/route.ts — ADMIN ONLY
 * GET /api/admin/orders — returns all orders with their order_items & product details.
 *
 * Uses lib/supabase.ts
 */
import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          products (
            name,
            image_url,
            slug
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ orders: orders ?? [] });
  } catch (error) {
    console.error("[/api/admin/orders GET]", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
