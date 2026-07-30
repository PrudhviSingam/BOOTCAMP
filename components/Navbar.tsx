"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  Zap,
  Home,
  Package,
  LogIn,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import { useAuth, signInWithGoogle, signOutUser } from "@/lib/firebase";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen]       = useState(false);
  const profileRef                    = useRef<HTMLDivElement>(null);

  const { user, loading } = useAuth();
  const { cartCount, setDrawerOpen } = useCart();

  // Detect scroll for navbar glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { href: "/",        label: "Home",     icon: Home    },
    { href: "/products", label: "Products", icon: Package },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* ── Brand ─────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group"
          aria-label="NexCart home"
        >
          <span className="gradient-primary rounded-lg p-1.5 group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 text-white" aria-hidden="true" />
          </span>
          <span className="font-bold text-lg text-foreground tracking-tight">
            Nex<span className="gradient-text">Cart</span>
          </span>
        </Link>

        {/* ── Desktop Nav Links ─────────────────────────── */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition-all duration-150"
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Actions ───────────────────────────────────── */}
        <div className="flex items-center gap-2">

          {/* Cart button */}
          <button
            id="navbar-cart-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Open cart, ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-surface border border-border text-muted hover:text-foreground hover:border-primary transition-all duration-150"
          >
            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
            {cartCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full gradient-primary text-white text-[10px] font-bold animate-bounce-in"
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Auth — desktop */}
          <div className="hidden md:block" ref={profileRef}>
            {loading ? (
              <div className="w-9 h-9 rounded-xl skeleton" aria-label="Loading auth state" />
            ) : user ? (
              <div className="relative">
                <button
                  id="navbar-profile-btn"
                  onClick={() => setProfileOpen((p) => !p)}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-surface border border-border hover:border-primary transition-all duration-150"
                >
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName ?? "Profile photo"}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                    </span>
                  )}
                  <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                    {user.displayName?.split(" ")[0] ?? "Account"}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass rounded-xl border border-border shadow-xl shadow-black/30 animate-fade-in overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs text-muted">Signed in as</p>
                      <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                    </div>
                    <button
                      id="navbar-signout-btn"
                      onClick={async () => { await signOutUser(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-muted hover:text-error hover:bg-surface transition-colors"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="navbar-signin-btn"
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white text-sm font-medium hover:opacity-90 active:scale-95 transition-all duration-150"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Sign in
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            id="navbar-mobile-menu-btn"
            onClick={() => setMenuOpen((m) => !m)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-surface border border-border text-muted hover:text-foreground transition-all"
          >
            {menuOpen
              ? <X className="w-5 h-5" aria-hidden="true" />
              : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ───────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-border animate-fade-in">
          <ul className="px-4 py-3 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface/60 transition-all"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-4 pb-4">
            {!loading && !user && (
              <button
                id="navbar-mobile-signin-btn"
                onClick={() => { signInWithGoogle(); setMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-medium"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Sign in with Google
              </button>
            )}
            {!loading && user && (
              <button
                id="navbar-mobile-signout-btn"
                onClick={() => { signOutUser(); setMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-medium text-muted hover:text-error transition-colors"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
