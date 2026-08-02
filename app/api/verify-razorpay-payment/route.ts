/**
 * app/api/verify-razorpay-payment/route.ts  — SERVER ONLY
 * Verifies a Razorpay payment signature using HMAC SHA256.
 *
 * POST body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * Uses RAZORPAY_KEY_SECRET — never exposed to the browser.
 * On success: updates order status to 'paid' and stores razorpay_payment_id.
 * On failure: returns 400 without updating the order.
 */
import { type NextRequest } from "next/server";
import { createHmac } from "crypto";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { razorpay } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json(
        { error: "razorpay_order_id, razorpay_payment_id, and razorpay_signature are required" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!secret) {
      return Response.json(
        { error: "Payment verification is not configured" },
        { status: 503 }
      );
    }

    // 1) Recompute expected signature per Razorpay's official method
    const expectedSignature = createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn("[verify-razorpay-payment] Signature mismatch — possible tampered request");
      return Response.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // 2) Optional check with Razorpay API to confirm payment is captured/authorized
    try {
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      if (payment && payment.status && !["captured", "authorized"].includes(payment.status)) {
        console.warn(`[verify-razorpay-payment] Payment status is not captured/authorized: ${payment.status}`);
        return Response.json(
          { error: `Payment state invalid (${payment.status})` },
          { status: 400 }
        );
      }
    } catch (rzpFetchErr) {
      console.warn("[verify-razorpay-payment] Optional payment fetch warning:", rzpFetchErr);
    }

    // 3) Update order to paid by razorpay_order_id
    const { data: updatedByRzp, error: updateError } = await supabase
      .from("orders")
      .update({
        status: "paid",
        razorpay_payment_id,
        razorpay_order_id,
      })
      .eq("razorpay_order_id", razorpay_order_id)
      .select();

    if (updateError) throw updateError;

    let confirmedOrderId = updatedByRzp?.[0]?.id ?? null;

    // Fallback: if no row updated by razorpay_order_id and order_id was provided, update by id
    if (!confirmedOrderId && order_id) {
      const { data: updatedById, error: fallbackError } = await supabase
        .from("orders")
        .update({
          status: "paid",
          razorpay_payment_id,
          razorpay_order_id,
        })
        .eq("id", order_id)
        .select();

      if (fallbackError) throw fallbackError;

      if (!updatedById || updatedById.length === 0) {
        console.error("[/api/verify-razorpay-payment] No order matched for ID:", order_id);
        return Response.json({ error: "Order not found or update failed" }, { status: 404 });
      }
      confirmedOrderId = updatedById[0].id;
    } else if (!confirmedOrderId) {
      console.error("[/api/verify-razorpay-payment] No order matched for razorpay_order_id:", razorpay_order_id);
      return Response.json({ error: "Order not found or update failed" }, { status: 404 });
    }

    return Response.json({ success: true, order_id: confirmedOrderId });
  } catch (error) {
    console.error("[/api/verify-razorpay-payment]", error);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
