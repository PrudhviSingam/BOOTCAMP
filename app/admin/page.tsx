"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface DashboardMetrics {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  totalProducts: number;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/metrics");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load dashboard metrics");
      
      setMetrics(data.metrics);
    } catch (err: unknown) {
      console.error("[AdminDashboard] Error loading metrics:", err);
      setError("Failed to load dashboard metrics. Check database connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-sm text-muted">
            Real-time store performance and operational metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMetrics}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground hover:border-primary/50 transition-colors disabled:opacity-50"
          aria-label="Refresh dashboard data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-primary" : "text-muted"}`} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          <p className="flex-1 font-medium">{error}</p>
        </div>
      )}

      {/* Metrics Grid — 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders Card */}
        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between gap-4 transition-all hover:border-primary/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Total Orders
            </span>
            <span className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            </span>
          </div>
          <div>
            {loading ? (
              <div className="h-9 w-20 skeleton rounded-lg" />
            ) : (
              <p className="text-3xl font-extrabold text-foreground">
                {metrics?.totalOrders.toLocaleString("en-IN") ?? 0}
              </p>
            )}
            <p className="text-xs text-muted mt-1">All time order records</p>
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between gap-4 transition-all hover:border-warning/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Pending Orders
            </span>
            <span className="p-2.5 rounded-xl bg-warning/10 border border-warning/20 text-warning">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </span>
          </div>
          <div>
            {loading ? (
              <div className="h-9 w-20 skeleton rounded-lg" />
            ) : (
              <p className="text-3xl font-extrabold text-warning">
                {metrics?.pendingOrders.toLocaleString("en-IN") ?? 0}
              </p>
            )}
            <p className="text-xs text-muted mt-1">Awaiting payment verification</p>
          </div>
        </div>

        {/* Paid Orders Card */}
        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between gap-4 transition-all hover:border-success/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Paid Orders
            </span>
            <span className="p-2.5 rounded-xl bg-success/10 border border-success/20 text-success">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            </span>
          </div>
          <div>
            {loading ? (
              <div className="h-9 w-20 skeleton rounded-lg" />
            ) : (
              <p className="text-3xl font-extrabold text-success">
                {metrics?.paidOrders.toLocaleString("en-IN") ?? 0}
              </p>
            )}
            <p className="text-xs text-muted mt-1">Payment confirmed</p>
          </div>
        </div>

        {/* Total Products Card */}
        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between gap-4 transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">
              Total Products
            </span>
            <span className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <Package className="w-5 h-5" aria-hidden="true" />
            </span>
          </div>
          <div>
            {loading ? (
              <div className="h-9 w-20 skeleton rounded-lg" />
            ) : (
              <p className="text-3xl font-extrabold text-accent">
                {metrics?.totalProducts.toLocaleString("en-IN") ?? 0}
              </p>
            )}
            <p className="text-xs text-muted mt-1">Active catalog items</p>
          </div>
        </div>
      </div>
    </div>
  );
}
