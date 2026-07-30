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
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json(
        { error: "razorpay_order_id, razorpay_payment_id, and razorpay_signature are required" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return Response.json(
        { error: "Payment verification is not configured" },
        { status: 503 }
      );
    }

    // Recompute expected signature per Razorpay's official method
    const expectedSignature = createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn("[verify-razorpay-payment] Signature mismatch — possible tampered request");
      return Response.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Update the order to paid
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status:               "paid",
        razorpay_payment_id,
      })
      .eq("razorpay_order_id", razorpay_order_id);

    if (updateError) throw updateError;

    return Response.json({ success: true });
  } catch (error) {
    console.error("[/api/verify-razorpay-payment]", error);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
