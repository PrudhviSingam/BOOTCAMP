"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Package, Loader2, AlertCircle, ArrowRight } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  products: { name: string; image_url: string; slug: string } | null;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_phone: string;
  razorpay_payment_id: string | null;
  created_at: string;
  order_items: OrderItem[];
}

export default function OrderConfirmationClient({ orderId }: { orderId: string }) {
  const [order, setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res  = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load order.");
        setOrder(data.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-32">
        <Loader2 className="w-10 h-10 text-primary animate-spin" aria-hidden="true" />
        <p className="text-muted text-sm">Loading your order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <AlertCircle className="w-10 h-10 text-error" aria-hidden="true" />
        <p className="font-semibold text-foreground">{error || "Order not found."}</p>
        <Link href="/products" className="text-sm text-primary hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  const isPaid = order.status === "paid";

  return (
    <div className="animate-fade-in space-y-8">
      {/* Status banner */}
      <div className={`flex flex-col items-center gap-4 py-10 text-center rounded-2xl border ${isPaid ? "bg-success/5 border-success/20" : "bg-surface border-border"}`}>
        <span className={`w-16 h-16 rounded-full flex items-center justify-center ${isPaid ? "bg-success/10 border border-success/30" : "bg-surface border border-border"}`}>
          {isPaid
            ? <CheckCircle className="w-8 h-8 text-success" aria-hidden="true" />
            : <Package className="w-8 h-8 text-muted" aria-hidden="true" />}
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground mb-1">
            {isPaid ? "Payment Successful!" : "Order Placed"}
          </h1>
          <p className="text-sm text-muted">
            {isPaid
              ? "Your payment has been confirmed. We will ship your order soon."
              : "Your order is placed but payment is pending."}
          </p>
        </div>

        {/* Status badge */}
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${isPaid ? "bg-success/15 text-success" : "bg-muted/15 text-muted"}`}
          aria-label={`Order status: ${order.status}`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Order details */}
      <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Order Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted text-xs">Order ID</dt>
            <dd className="font-mono text-foreground text-xs truncate">{order.id}</dd>
          </div>
          {order.razorpay_payment_id && (
            <div>
              <dt className="text-muted text-xs">Payment ID</dt>
              <dd className="font-mono text-foreground text-xs truncate">{order.razorpay_payment_id}</dd>
            </div>
          )}
          <div>
            <dt className="text-muted text-xs">Date</dt>
            <dd className="text-foreground">{new Date(order.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</dd>
          </div>
          <div>
            <dt className="text-muted text-xs">Total</dt>
            <dd className="font-bold text-primary text-base">₹{order.total_amount.toLocaleString("en-IN")}</dd>
          </div>
        </dl>

        <hr className="border-border" />

        <h3 className="font-medium text-sm text-foreground">Shipping Address</h3>
        <address className="not-italic text-sm text-muted leading-relaxed">
          {order.shipping_name}<br />
          {order.shipping_address}<br />
          {order.shipping_city}, {order.shipping_postal_code}<br />
          {order.shipping_phone}
        </address>
      </div>

      {/* Items */}
      {order.order_items?.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="font-semibold text-foreground mb-4">Items Ordered</h2>
          <ul className="space-y-4" aria-label="Ordered items">
            {order.order_items.map((item) => (
              <li key={item.id} className="flex gap-4">
                <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-border bg-background">
                  <Image
                    src={item.products?.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80"}
                    alt={item.products?.name ?? "Product"}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{item.products?.name ?? "Product"}</p>
                  <p className="text-xs text-muted">Qty: {item.quantity} &times; ₹{item.price.toLocaleString("en-IN")}</p>
                </div>
                <p className="text-sm font-semibold text-foreground shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="flex justify-center">
        <Link
          href="/products"
          id="order-confirm-continue-btn"
          className="group inline-flex items-center gap-2 px-7 py-3 rounded-xl gradient-primary text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
