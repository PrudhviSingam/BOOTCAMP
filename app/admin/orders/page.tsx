"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  X,
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string;
    slug: string;
  } | null;
}

interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_name: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  shipping_phone: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  order_items: OrderItem[];
}

const STATUS_OPTIONS = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders]         = useState<Order[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [errorMsg, setErrorMsg]     = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Selected order for detailed modal view
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load orders");
      setOrders(data.orders ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load orders";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update order status");

      setSuccessMsg(`Order status updated to "${newStatus}".`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      setErrorMsg(msg);
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.shipping_name && order.shipping_name.toLowerCase().includes(search.toLowerCase())) ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      (order.shipping_phone && order.shipping_phone.includes(search));

    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  function getStatusBadgeClass(status: string) {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-success/10 text-success border-success/20";
      case "shipped":
        return "bg-primary/10 text-primary border-primary/20";
      case "delivered":
        return "bg-accent/10 text-accent border-accent/20";
      case "cancelled":
        return "bg-error/10 text-error border-error/20";
      case "pending":
      default:
        return "bg-warning/10 text-warning border-warning/20";
    }
  }

  function getStatusIcon(status: string) {
    switch (status.toLowerCase()) {
      case "paid":
        return <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />;
      case "shipped":
        return <Truck className="w-3.5 h-3.5" aria-hidden="true" />;
      case "delivered":
        return <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />;
      case "cancelled":
        return <XCircle className="w-3.5 h-3.5" aria-hidden="true" />;
      case "pending":
      default:
        return <Clock className="w-3.5 h-3.5" aria-hidden="true" />;
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Orders Management
          </h2>
          <p className="text-sm text-muted">
            Track customer orders, inspect line items, and update fulfillment statuses.
          </p>
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
          <p className="flex-1 font-medium">{successMsg}</p>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          <p className="flex-1 font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search orders"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative w-full sm:w-52">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" aria-hidden="true" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by order status"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors cursor-pointer capitalize"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st} className="capitalize">{st.charAt(0).toUpperCase() + st.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List / Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted">
          <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
          <p className="text-sm">Loading orders list...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-2xl border border-border text-center px-4 gap-3">
          <ShoppingBag className="w-10 h-10 text-muted" aria-hidden="true" />
          <p className="font-semibold text-foreground">No orders found</p>
          <p className="text-sm text-muted max-w-sm">
            {search || statusFilter !== "all"
              ? "No orders match your filter criteria."
              : "No customer orders have been placed yet."}
          </p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm" aria-label="Orders list">
              <thead className="bg-background/50 border-b border-border text-xs uppercase tracking-wider text-muted font-semibold">
                <tr>
                  <th scope="col" className="px-6 py-4">Order ID &amp; Date</th>
                  <th scope="col" className="px-6 py-4">Customer</th>
                  <th scope="col" className="px-6 py-4">Total</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-background/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-mono text-xs font-semibold text-foreground">{order.id.slice(0, 8)}...</p>
                        <p className="text-xs text-muted">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-foreground">{order.shipping_name || "Guest"}</p>
                        <p className="text-xs text-muted">{order.shipping_phone || "No phone"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      ₹{order.total_amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      {/* Inline Status Dropdown */}
                      <div className="relative inline-flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </span>
                        <select
                          disabled={updatingId === order.id}
                          value={order.status.toLowerCase()}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          aria-label={`Change status for order ${order.id}`}
                          className="px-2 py-1 rounded-lg bg-background border border-border text-xs text-foreground focus:outline-none focus:border-primary/60 transition-colors cursor-pointer capitalize"
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st} className="capitalize">{st.charAt(0).toUpperCase() + st.slice(1)}</option>
                          ))}
                        </select>
                        {updatingId === order.id && (
                          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" aria-hidden="true" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-medium text-muted hover:text-foreground hover:border-primary/50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden divide-y divide-border">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-muted">ID: {order.id.slice(0, 8)}...</span>
                    <p className="font-bold text-foreground">{order.shipping_name || "Guest"}</p>
                  </div>
                  <p className="font-bold text-primary text-base">₹{order.total_amount.toLocaleString("en-IN")}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-muted">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  {/* Inline Status Select */}
                  <div className="flex items-center gap-2">
                    <select
                      disabled={updatingId === order.id}
                      value={order.status.toLowerCase()}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      aria-label={`Change status for order ${order.id}`}
                      className="px-2 py-1 rounded-lg bg-background border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-primary/60 transition-colors cursor-pointer capitalize"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st} className="capitalize">{st.charAt(0).toUpperCase() + st.slice(1)}</option>
                      ))}
                    </select>
                    {updatingId === order.id && (
                      <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" aria-hidden="true" />
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-medium text-muted hover:text-foreground transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                    View Order Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl p-6 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Order Details</h3>
                <p className="font-mono text-xs text-muted">{selectedOrder.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg bg-background border border-border text-muted hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="space-y-2 text-sm bg-background/50 p-4 rounded-xl border border-border/60">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Shipping Address</p>
              <p className="font-bold text-foreground">{selectedOrder.shipping_name || "N/A"}</p>
              <p className="text-muted text-xs leading-relaxed">
                {selectedOrder.shipping_address}<br />
                {selectedOrder.shipping_city}, {selectedOrder.shipping_postal_code}<br />
                Phone: {selectedOrder.shipping_phone || "N/A"}
              </p>
            </div>

            {/* Payment Info */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-background/50 p-4 rounded-xl border border-border/60">
              <div>
                <span className="text-muted block">Status</span>
                <span className="font-bold text-foreground capitalize">{selectedOrder.status}</span>
              </div>
              <div>
                <span className="text-muted block">Total Amount</span>
                <span className="font-bold text-primary">₹{selectedOrder.total_amount.toLocaleString("en-IN")}</span>
              </div>
              {selectedOrder.razorpay_payment_id && (
                <div className="col-span-2">
                  <span className="text-muted block">Razorpay Payment ID</span>
                  <span className="font-mono text-foreground">{selectedOrder.razorpay_payment_id}</span>
                </div>
              )}
            </div>

            {/* Items Purchased */}
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Line Items</p>
              <ul className="space-y-3 divide-y divide-border/40" aria-label="Order items list">
                {selectedOrder.order_items?.map((item) => (
                  <li key={item.id} className="pt-3 first:pt-0 flex items-center gap-3 text-sm">
                    <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-border bg-background">
                      <Image
                        src={item.products?.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80"}
                        alt={item.products?.name ?? "Product"}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-xs truncate">{item.products?.name ?? "Product"}</p>
                      <p className="text-xs text-muted">Qty: {item.quantity} &times; ₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <p className="font-bold text-foreground text-xs">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
