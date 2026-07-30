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
      items,
      cart_items,
      shipping,
      shipping_name,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      shipping_phone,
    } = body;

    const itemList = items || cart_items;

    if (!user_id || !Array.isArray(itemList) || itemList.length === 0) {
      return Response.json(
        { error: "user_id and items are required" },
        { status: 400 }
      );
    }

    const name = shipping_name ?? shipping?.name ?? shipping?.shipping_name ?? null;
    const address = shipping_address ?? shipping?.address ?? shipping?.shipping_address ?? null;
    const city = shipping_city ?? shipping?.city ?? shipping?.shipping_city ?? null;
    const postal_code = shipping_postal_code ?? shipping?.postal_code ?? shipping?.shipping_postal_code ?? null;
    const phone = shipping_phone ?? shipping?.phone ?? shipping?.shipping_phone ?? null;

    // Calculate total amount
    const total_amount = itemList.reduce(
      (sum: number, item: { quantity: number; price: number }) =>
        sum + Number(item.quantity) * Number(item.price),
      0
    );

    // 1) Insert new row into orders with status "pending" and shipping fields
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id,
        status: "pending",
        total_amount,
        shipping_name: name,
        shipping_address: address,
        shipping_city: city,
        shipping_postal_code: postal_code,
        shipping_phone: phone,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("[/api/orders POST] Order insert error:", orderError);
      return Response.json({ error: "Failed to create order" }, { status: 500 });
    }

    // 2) Insert matching rows into order_items linked to that order
    const orderItems = itemList.map((item: { product_id: string; quantity: number; price: number }) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("[/api/orders POST] Order items insert error:", itemsError);
      return Response.json({ error: "Failed to create order items" }, { status: 500 });
    }

    // 3) Clear the user's cart_items rows
    const { error: cartError } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user_id);

    if (cartError) {
      console.warn("[/api/orders POST] Cart clear failed:", cartError);
    }

    // 4) Return the new order's id
    return Response.json({ success: true, order_id: order.id, id: order.id }, { status: 201 });
  } catch (error) {
    console.error("[/api/orders POST]", error);
    return Response.json({ error: "Failed to process order" }, { status: 500 });
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
