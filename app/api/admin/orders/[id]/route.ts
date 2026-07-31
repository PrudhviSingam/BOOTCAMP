/**
 * app/api/admin/orders/[id]/route.ts — ADMIN ONLY
 * PATCH /api/admin/orders/:id — update an order's status.
 *
 * Uses lib/supabase.ts
 */
import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const normalizedStatus = status.toString().toLowerCase().trim();

    const { data: order, error } = await supabase
      .from("orders")
      .update({ status: normalizedStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("[/api/admin/orders/[id] PATCH]", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
