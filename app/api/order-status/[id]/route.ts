/**
 * app/api/order-status/[id]/route.ts
 * GET /api/order-status/:id
 * Returns the current status of an order by ID.
 * Used by the checkout page to poll / retry payment state.
 */
import { type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("orders")
      .select("id, status, razorpay_order_id, razorpay_payment_id, total_amount, created_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({ order: data });
  } catch (error) {
    console.error("[/api/order-status/[id]]", error);
    return Response.json({ error: "Failed to fetch order status" }, { status: 500 });
  }
}
