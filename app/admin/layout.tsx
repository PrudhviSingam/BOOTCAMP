"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  ArrowLeft,
  Loader2,
  LayoutDashboard,
  Package,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/firebase";
import { isAdmin } from "@/lib/isAdmin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] pt-28 pb-20 px-4">
          <div className="flex flex-col items-center gap-3 text-muted">
            <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
            <p className="text-sm font-medium">Verifying admin permissions...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user || !isAdmin(user.email)) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] pt-28 pb-20 px-4">
          <div className="animate-fade-in flex flex-col items-center gap-6 text-center max-w-md mx-auto p-8 rounded-2xl bg-surface border border-border shadow-xl">
            <span className="w-16 h-16 rounded-2xl bg-error/10 border border-error/30 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-error" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-foreground mb-2">Not Authorized</h1>
              <p className="text-sm text-muted leading-relaxed">
                You are not authorized to view this page. Admin access is restricted to authorized accounts.
              </p>
            </div>
            <Link
              href="/"
              id="admin-unauthorized-home-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Admin Header & Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl gradient-primary text-primary-foreground flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Portal</h1>
              <p className="text-xs text-muted">Authorized: {user.email}</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-surface border border-border p-1 rounded-xl w-full sm:w-auto overflow-x-auto" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                    isActive
                      ? "gradient-primary text-primary-foreground shadow-sm"
                      : "text-muted hover:text-foreground hover:bg-background"
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {children}
      </main>
      <Footer />
    </>
  );
}
