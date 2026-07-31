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
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { order_id } = await request.json();
    if (!order_id) {
      return Response.json({ error: "order_id is required" }, { status: 400 });
    }

    // 1) Fetch the order from Supabase
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, total_amount, status, razorpay_order_id")
      .eq("id", order_id)
      .single();

    if (fetchError || !order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    // Guard: do not allow creating a payment for an already-paid order
    if (order.status === "paid") {
      return Response.json(
        { error: "Order is already paid" },
        { status: 409 }
      );
    }

    // Convert rupees → paise (Razorpay requires amount in smallest currency unit)
    const amountPaise = Math.round(order.total_amount * 100);

    // 2) Reuse an existing Razorpay order if one was already created for this
    //    order (e.g. on retry), otherwise create a new one.
    let razorpayOrderId = order.razorpay_order_id;

    if (!razorpayOrderId) {
      const rzpOrder = await razorpay.orders.create({
        amount:   amountPaise,
        currency: "INR",
        receipt:  `receipt_${order_id.slice(0, 16)}`,
      });
      razorpayOrderId = rzpOrder.id;

      // 3) Save the Razorpay order ID back into our Supabase order
      const { error: updateError } = await supabase
        .from("orders")
        .update({ razorpay_order_id: razorpayOrderId })
        .eq("id", order_id);

      if (updateError) throw updateError;
    }

    return Response.json({
      razorpay_order_id: razorpayOrderId,
      amount:            amountPaise,
    });
  } catch (error) {
    console.error("[/api/create-razorpay-order]", error);
    return Response.json({ error: "Failed to create Razorpay order" }, { status: 500 });
  }
}
