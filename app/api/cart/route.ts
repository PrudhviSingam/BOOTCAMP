/**
 * app/api/cart/route.ts
 * Cart CRUD — all operations on cart_items table (Supabase public/anon key).
 *
 * GET    /api/cart?user_id=xxx          → list cart items for user
 * POST   /api/cart  { user_id, product_id, quantity }   → add item
 * PATCH  /api/cart  { id, quantity }    → update quantity
 * DELETE /api/cart?id=xxx               → remove item
 */
import { type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// ── GET — fetch cart items ──────────────────────────────────────
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("user_id");
  if (!userId) {
    return Response.json({ error: "user_id is required" }, { status: 400 });
  }

  try {
    // Join with products so the context gets name / price / image / slug
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        product_id,
        quantity,
        products (
          name,
          price,
          image_url,
          slug
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Flatten the joined data into a clean shape
    const items = (data ?? []).map((row: any) => ({
      id:         row.id,
      product_id: row.product_id,
      quantity:   row.quantity,
      name:       row.products?.name      ?? "",
      price:      row.products?.price     ?? 0,
      image_url:  row.products?.image_url ?? "",
      slug:       row.products?.slug      ?? "",
    }));

    return Response.json({ items });
  } catch (error) {
    console.error("[/api/cart GET]", error);
    return Response.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// ── POST — add item to cart ─────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, product_id, quantity = 1 } = body;

    if (!user_id || !product_id) {
      return Response.json({ error: "user_id and product_id are required" }, { status: 400 });
    }

    // If item already in cart, increment quantity
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user_id)
      .eq("product_id", product_id)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);
      if (error) throw error;
      return Response.json({ success: true, action: "updated" });
    }

    const { error } = await supabase
      .from("cart_items")
      .insert({ user_id, product_id, quantity });

    if (error) throw error;
    return Response.json({ success: true, action: "inserted" }, { status: 201 });
  } catch (error) {
    console.error("[/api/cart POST]", error);
    return Response.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

// ── PATCH — update quantity ─────────────────────────────────────
export async function PATCH(request: NextRequest) {
  try {
    const { id, quantity } = await request.json();

    if (!id || quantity == null) {
      return Response.json({ error: "id and quantity are required" }, { status: 400 });
    }
    if (quantity < 1) {
      return Response.json({ error: "quantity must be at least 1" }, { status: 400 });
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", id);

    if (error) throw error;
    return Response.json({ success: true });
  } catch (error) {
    console.error("[/api/cart PATCH]", error);
    return Response.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

// ── DELETE — remove item ────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) throw error;
    return Response.json({ success: true });
  } catch (error) {
    console.error("[/api/cart DELETE]", error);
    return Response.json({ error: "Failed to remove cart item" }, { status: 500 });
  }
}
