import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch orders data (status values)
    const { data: orders, error: ordersErr } = await supabase
      .from("orders")
      .select("status");

    if (ordersErr) throw ordersErr;

    // 2. Fetch total products count
    const { count: productsCount, error: productsErr } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true });

    if (productsErr) throw productsErr;

    const totalOrders   = orders?.length ?? 0;
    const pendingOrders = orders?.filter((o) => o.status === "pending").length ?? 0;
    const paidOrders    = orders?.filter((o) => o.status === "paid").length ?? 0;
    const totalProducts = productsCount ?? 0;

    return NextResponse.json({
      metrics: {
        totalOrders,
        pendingOrders,
        paidOrders,
        totalProducts,
      }
    });
  } catch (error) {
    console.error("[/api/admin/metrics GET]", error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
