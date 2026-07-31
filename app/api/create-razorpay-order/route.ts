/**
 * app/api/create-razorpay-order/route.ts  — SERVER ONLY
 * Creates a Razorpay order linked to our Supabase order.
 *
 * POST body: { order_id: string }   (our Supabase orders.id)
 * Returns:   { razorpay_order_id, amount }
 *
 * Uses RAZORPAY_KEY_SECRET — never exposed to the browser.
 */
import { type NextRequest } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { order_id } = await request.json();
    if (!order_id) {
      return Response.json({ error: "order_id is required" }, { status: 400 });
    }

    // 1) Fetch the order's total_amount from Supabase
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, total_amount, status")
      .eq("id", order_id)
      .single();

    if (fetchError || !order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    // Convert rupees → paise (Razorpay requires amount in smallest currency unit)
    const amountPaise = Math.round(order.total_amount * 100);

    // 2) Create a Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount:   amountPaise,
      currency: "INR",
      receipt:  `receipt_${order_id.slice(0, 16)}`,
    });

    // 3) Save the Razorpay order ID back into our Supabase order
    const { data: updatedOrders, error: updateError } = await supabase
      .from("orders")
      .update({ razorpay_order_id: rzpOrder.id })
      .eq("id", order_id)
      .select();

    if (updateError) throw updateError;

    if (!updatedOrders || updatedOrders.length === 0) {
      console.error("[/api/create-razorpay-order] Order not found or update failed:", order_id);
      return Response.json({ error: "Order not found or update failed" }, { status: 404 });
    }

    return Response.json({
      razorpay_order_id: rzpOrder.id,
      amount:            amountPaise,
    });
  } catch (error) {
    console.error("[/api/create-razorpay-order]", error);
    return Response.json({ error: "Failed to create Razorpay order" }, { status: 500 });
  }
}
