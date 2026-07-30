/**
 * app/api/orders/route.ts
 *
 * POST /api/orders — create a new order + order_items, clear cart
 * GET  /api/orders?id=xxx — fetch a single order by ID (for order confirmation page)
 */
import { type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// ── POST — create order ────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      items,           // [{ product_id, quantity, price }]
      shipping_name,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      shipping_phone,
    } = body;

    if (!user_id || !items?.length) {
      return Response.json(
        { error: "user_id and items are required" },
        { status: 400 }
      );
    }

    const total_amount = items.reduce(
      (sum: number, item: { quantity: number; price: number }) =>
        sum + item.quantity * item.price,
      0
    );

    // 1) Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id,
        status: "pending",
        total_amount,
        shipping_name,
        shipping_address,
        shipping_city,
        shipping_postal_code,
        shipping_phone,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2) Insert order_items
    const orderItems = items.map((item: { product_id: string; quantity: number; price: number }) => ({
      order_id:   order.id,
      product_id: item.product_id,
      quantity:   item.quantity,
      price:      item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3) Clear the user's cart
    const { error: cartError } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user_id);

    if (cartError) console.warn("[/api/orders] Cart clear failed:", cartError);

    return Response.json({ success: true, order_id: order.id }, { status: 201 });
  } catch (error) {
    console.error("[/api/orders POST]", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// ── GET — fetch order by ID ────────────────────────────────────
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const { data: order, error } = await supabase
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
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({ order });
  } catch (error) {
    console.error("[/api/orders GET]", error);
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
