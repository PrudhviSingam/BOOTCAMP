"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  CreditCard,
  User,
  MapPin,
  Phone,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/lib/firebase";
import { signInWithGoogle } from "@/lib/firebase";

interface ShippingForm {
  name:         string;
  address:      string;
  city:         string;
  postal_code:  string;
  phone:        string;
}

type CheckoutStep = "form" | "loading" | "payment" | "success" | "error";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) { resolve(true); return; }
    const script    = document.createElement("script");
    script.id       = "razorpay-script";
    script.src      = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload   = () => resolve(true);
    script.onerror  = () => resolve(false);
    document.body.appendChild(script);
  });
}

const REQUIRED_FIELDS: (keyof ShippingForm)[] = [
  "name", "address", "city", "postal_code", "phone",
];

export default function CheckoutClient() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState<ShippingForm>({
    name: "", address: "", city: "", postal_code: "", phone: "",
  });
  const [errors, setErrors]     = useState<Partial<ShippingForm>>({});
  const [step, setStep]         = useState<CheckoutStep>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId]   = useState<string | null>(null);
  const [rzpOrderId, setRzpOrderId] = useState<string | null>(null);

  function validate(): boolean {
    const newErrors: Partial<ShippingForm> = {};
    REQUIRED_FIELDS.forEach((field) => {
      if (!form[field].trim()) newErrors[field] = "This field is required.";
    });
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const openRazorpayPopup = useCallback(async (
    supabaseOrderId: string,
    razorpayOrderId: string,
    amountPaise:     number,
  ) => {
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      setErrorMsg("Could not load the payment gateway. Check your internet connection.");
      setStep("error");
      return;
    }

    const options = {
      key:                process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
      amount:             amountPaise,
      currency:           "INR",
      name:               "NexCart",
      description:        "Secure payment for your order",
      image:              "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=120&q=80",
      order_id:           razorpayOrderId,
      prefill: {
        name:    form.name,
        contact: form.phone,
        email:   user?.email ?? "",
      },
      theme: { color: "#6366f1" },
      handler: async (response: {
        razorpay_order_id:   string;
        razorpay_payment_id: string;
        razorpay_signature:  string;
      }) => {
        setStep("loading");
        try {
          const verifyRes = await fetch("/api/verify-razorpay-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.success) {
            throw new Error(verifyData.error ?? "Signature verification failed.");
          }
          await clearCart();
          router.push(`/order-confirmation/${supabaseOrderId}`);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Payment completed but verification failed. Please contact support.";
          setErrorMsg(msg);
          setStep("error");
        }
      },
      modal: {
        ondismiss: async () => {
          // Check if the order was already paid (edge case)
          try {
            const statusRes = await fetch(`/api/order-status/${supabaseOrderId}`);
            const statusData = await statusRes.json();
            if (statusData.order?.status === "paid" || statusData.status === "paid") {
              await clearCart();
              router.push(`/order-confirmation/${supabaseOrderId}`);
              return;
            }
          } catch (e) {
            console.error("[CheckoutClient] Order status check failed", e);
          }
          setErrorMsg("Payment was not completed. You can try again.");
          setStep("error");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setStep("payment");
  }, [form, user, clearCart, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStep("loading");

    try {
      // 1) Create Supabase order
      const orderRes = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id:             user!.uid,
          items:               items.map((i) => ({ product_id: i.product_id, quantity: i.quantity, price: i.price })),
          shipping_name:       form.name,
          shipping_address:    form.address,
          shipping_city:       form.city,
          shipping_postal_code: form.postal_code,
          shipping_phone:      form.phone,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error ?? "Failed to create order.");
      const newOrderId = orderData.order_id as string;
      setOrderId(newOrderId);

      // 2) Create Razorpay order
      const rzpRes = await fetch("/api/create-razorpay-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: newOrderId }),
      });
      const rzpData = await rzpRes.json();

      if (!rzpRes.ok || !rzpData.razorpay_order_id) {
        throw new Error(rzpData.error ?? "Failed to create Razorpay order.");
      }

      setRzpOrderId(rzpData.razorpay_order_id);
      await openRazorpayPopup(newOrderId, rzpData.razorpay_order_id, rzpData.amount);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setErrorMsg(msg);
      setStep("error");
    }
  }

  async function handleRetry() {
    if (!orderId) {
      setStep("form");
      return;
    }
    setStep("loading");
    try {
      // 1) Verify current status via /api/order-status/[id]
      const statusRes = await fetch(`/api/order-status/${orderId}`);
      const statusData = await statusRes.json();
      const currentStatus = statusData.order?.status || statusData.status;

      if (currentStatus === "paid") {
        setStep("success");
        await clearCart();
        router.push(`/order-confirmation/${orderId}`);
        return;
      }

      // 2) Re-create/fetch Razorpay order for same orderId
      const rzpRes = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
      const rzpData = await rzpRes.json();

      if (!rzpRes.ok || !rzpData.razorpay_order_id) {
        throw new Error(rzpData.error ?? "Failed to re-open payment gateway.");
      }

      setRzpOrderId(rzpData.razorpay_order_id);
      await openRazorpayPopup(orderId, rzpData.razorpay_order_id, rzpData.amount);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment was not completed. You can try again.";
      setErrorMsg(msg);
      setStep("error");
    }
  }

  // ── Auth guard ────────────────────────────────────────────
  if (!user) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <CreditCard className="w-12 h-12 text-muted" aria-hidden="true" />
        <p className="text-lg font-semibold text-foreground">Sign in to checkout</p>
        <button id="checkout-signin-btn" onClick={signInWithGoogle} className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold">
          Sign in with Google
        </button>
      </div>
    );
  }

  // ── Empty cart ─────────────────────────────────────────────
  if (items.length === 0 && step === "form") {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <CreditCard className="w-12 h-12 text-muted" aria-hidden="true" />
        <p className="text-lg font-semibold text-foreground">Your cart is empty</p>
        <a href="/products" className="text-sm text-primary hover:underline">Browse Products</a>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────
  if (step === "loading") {
    return (
      <div className="flex flex-col items-center gap-4 py-32 text-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" aria-hidden="true" />
        <p className="text-foreground font-medium">Processing your order...</p>
        <p className="text-sm text-muted">Please wait. Do not close this page.</p>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center max-w-md mx-auto">
        <span className="w-16 h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-success" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xl font-bold text-foreground mb-2">Payment Successful!</p>
          <p className="text-sm text-muted">Redirecting to order confirmation...</p>
        </div>
        <Loader2 className="w-6 h-6 text-primary animate-spin" aria-hidden="true" />
      </div>
    );
  }

  // ── Error / Pending Retry ─────────────────────────────────
  if (step === "error") {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center max-w-md mx-auto">
        <span className="w-16 h-16 rounded-full bg-error/10 border border-error/30 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-error" aria-hidden="true" />
        </span>
        <div>
          <p className="text-lg font-semibold text-foreground mb-2">Payment Incomplete</p>
          <p className="text-sm text-muted">{errorMsg || "Payment was not completed. You can try again."}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="checkout-retry-btn"
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
          <button
            onClick={() => setStep("form")}
            className="px-6 py-2.5 rounded-xl bg-surface border border-border text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Edit Order
          </button>
        </div>
      </div>
    );
  }

  // ── Checkout form ─────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        id="checkout-form"
        noValidate
        aria-label="Shipping information form"
        className="lg:col-span-3 flex flex-col gap-6"
      >
        <section className="bg-surface rounded-2xl border border-border p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">
            <User className="w-5 h-5 text-primary" aria-hidden="true" />
            Contact & Shipping
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full name */}
            <div className="sm:col-span-2">
              <label htmlFor="checkout-name" className="block text-xs font-medium text-muted mb-1.5">
                Full Name <span aria-hidden="true" className="text-error">*</span>
              </label>
              <input
                id="checkout-name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                aria-required="true"
                aria-describedby={errors.name ? "error-name" : undefined}
                aria-invalid={!!errors.name}
                placeholder="Priya Sharma"
                className={`w-full px-4 py-2.5 rounded-xl bg-background border text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-primary/60 transition-colors ${errors.name ? "border-error" : "border-border"}`}
              />
              {errors.name && <p id="error-name" role="alert" className="flex items-center gap-1 text-xs text-error mt-1"><AlertCircle className="w-3 h-3" aria-hidden="true" />{errors.name}</p>}
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label htmlFor="checkout-address" className="block text-xs font-medium text-muted mb-1.5">
                Street Address <span aria-hidden="true" className="text-error">*</span>
              </label>
              <input
                id="checkout-address"
                type="text"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                aria-required="true"
                aria-describedby={errors.address ? "error-address" : undefined}
                aria-invalid={!!errors.address}
                placeholder="42 MG Road, Indiranagar"
                className={`w-full px-4 py-2.5 rounded-xl bg-background border text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-primary/60 transition-colors ${errors.address ? "border-error" : "border-border"}`}
              />
              {errors.address && <p id="error-address" role="alert" className="flex items-center gap-1 text-xs text-error mt-1"><AlertCircle className="w-3 h-3" aria-hidden="true" />{errors.address}</p>}
            </div>

            {/* City */}
            <div>
              <label htmlFor="checkout-city" className="block text-xs font-medium text-muted mb-1.5">
                City <span aria-hidden="true" className="text-error">*</span>
              </label>
              <input
                id="checkout-city"
                type="text"
                autoComplete="address-level2"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                aria-required="true"
                aria-describedby={errors.city ? "error-city" : undefined}
                aria-invalid={!!errors.city}
                placeholder="Bengaluru"
                className={`w-full px-4 py-2.5 rounded-xl bg-background border text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-primary/60 transition-colors ${errors.city ? "border-error" : "border-border"}`}
              />
              {errors.city && <p id="error-city" role="alert" className="flex items-center gap-1 text-xs text-error mt-1"><AlertCircle className="w-3 h-3" aria-hidden="true" />{errors.city}</p>}
            </div>

            {/* Postal code */}
            <div>
              <label htmlFor="checkout-postal" className="block text-xs font-medium text-muted mb-1.5">
                Postal Code <span aria-hidden="true" className="text-error">*</span>
              </label>
              <input
                id="checkout-postal"
                type="text"
                autoComplete="postal-code"
                value={form.postal_code}
                onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
                aria-required="true"
                aria-describedby={errors.postal_code ? "error-postal" : undefined}
                aria-invalid={!!errors.postal_code}
                placeholder="560001"
                className={`w-full px-4 py-2.5 rounded-xl bg-background border text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-primary/60 transition-colors ${errors.postal_code ? "border-error" : "border-border"}`}
              />
              {errors.postal_code && <p id="error-postal" role="alert" className="flex items-center gap-1 text-xs text-error mt-1"><AlertCircle className="w-3 h-3" aria-hidden="true" />{errors.postal_code}</p>}
            </div>

            {/* Phone */}
            <div className="sm:col-span-2">
              <label htmlFor="checkout-phone" className="block text-xs font-medium text-muted mb-1.5">
                Phone Number <span aria-hidden="true" className="text-error">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" aria-hidden="true" />
                <input
                  id="checkout-phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  aria-required="true"
                  aria-describedby={errors.phone ? "error-phone" : undefined}
                  aria-invalid={!!errors.phone}
                  placeholder="9876543210"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-primary/60 transition-colors ${errors.phone ? "border-error" : "border-border"}`}
                />
              </div>
              {errors.phone && <p id="error-phone" role="alert" className="flex items-center gap-1 text-xs text-error mt-1"><AlertCircle className="w-3 h-3" aria-hidden="true" />{errors.phone}</p>}
            </div>
          </div>
        </section>

        <button
          id="checkout-pay-btn"
          type="submit"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl gradient-primary text-primary-foreground font-bold text-base hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          <CreditCard className="w-5 h-5" aria-hidden="true" />
          Pay ₹{subtotal.toLocaleString("en-IN")}
        </button>
      </form>

      {/* Order summary */}
      <aside className="lg:col-span-2" aria-label="Order summary">
        <div className="bg-surface rounded-2xl border border-border p-6 sticky top-24">
          <h2 className="text-base font-semibold text-foreground mb-4">Order Summary</h2>
          <ul className="space-y-4 mb-6" aria-label="Items in order">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 items-start">
                <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border bg-background">
                  <Image
                    src={item.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80"}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground line-clamp-2">{item.name}</p>
                  <p className="text-xs text-muted">Qty: {item.quantity}</p>
                </div>
                <p className="text-xs font-semibold text-foreground shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </li>
            ))}
          </ul>
          <div className="border-t border-border pt-4 flex justify-between">
            <span className="text-sm text-muted">Total</span>
            <span className="font-bold text-lg text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
