/**
 * app/api/admin/products/route.ts — ADMIN ONLY
 *
 * GET  /api/admin/products — list all products
 * POST /api/admin/products — create a new product
 *
 * Uses lib/supabase.ts
 */
import { type NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ products: data ?? [] });
  } catch (error) {
    console.error("[/api/admin/products GET]", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, image_url, category, stock, slug } = body;

    if (!name || price == null || !description) {
      return NextResponse.json(
        { error: "Name, price, and description are required" },
        { status: 400 }
      );
    }

    const generatedSlug = slug?.trim()
      ? slug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      : name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const { data, error } = await supabase
      .from("products")
      .insert({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        image_url: image_url?.trim() || null,
        category: category?.trim() || "General",
        stock: Number(stock ?? 0),
        slug: generatedSlug,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, product: data }, { status: 201 });
  } catch (error) {
    console.error("[/api/admin/products POST]", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
