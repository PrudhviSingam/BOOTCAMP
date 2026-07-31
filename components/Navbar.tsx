"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
  User as UserIcon,
} from "lucide-react";
import { useAuth, signInWithGoogle, signOutUser } from "@/lib/firebase";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { user, loading } = useAuth();
  const { cartCount, setDrawerOpen } = useCart();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: Package },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Store Logo / Name (Left) */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-opacity hover:opacity-90"
              aria-label="NexCart Store"
            >
              <div className="p-2 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <Zap className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Nex<span className="gradient-text">Cart</span>
              </span>
            </Link>
          </div>

          {/* Centered Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center justify-center space-x-1 flex-1 px-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition-all duration-150"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Cart, Auth & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Shopping Cart Icon with Item-Count Badge */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative p-2.5 rounded-xl bg-surface border border-border text-muted hover:text-foreground hover:border-primary/50 transition-all duration-150"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-bold text-primary-foreground bg-primary rounded-full shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Desktop Auth */}
            <div className="hidden md:block" ref={profileRef}>
              {loading ? (
                <div
                  className="w-9 h-9 rounded-xl animate-pulse bg-surface border border-border"
                  aria-label="Loading profile"
                />
              ) : user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border hover:border-primary/50 transition-all duration-150"
                    aria-label="User profile menu"
                    aria-expanded={isProfileOpen}
                  >
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || "User profile photo"}
                        width={28}
                        height={28}
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-primary-foreground">
                        <UserIcon className="w-4 h-4" aria-hidden="true" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                      {user.displayName || user.email?.split("@")[0] || "Account"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted transition-transform duration-200 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface shadow-xl p-1 animate-fade-in z-50">
                      <div className="px-3 py-2 border-b border-border/60 mb-1">
                        <p className="text-xs font-medium text-foreground truncate">
                          {user.displayName || "Signed In"}
                        </p>
                        {user.email && (
                          <p className="text-xs text-muted truncate">{user.email}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          setIsProfileOpen(false);
                          await signOutUser();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" aria-hidden="true" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium shadow-sm hover:opacity-95 active:scale-[0.98] transition-all duration-150"
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu Button (below md breakpoint) */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-surface border border-border text-muted hover:text-foreground transition-all duration-150"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown (below md breakpoint) */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface/95 backdrop-blur-md animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-muted hover:text-foreground hover:bg-background/50 transition-colors"
                >
                  <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Mobile Auth Button */}
            <div className="pt-2 border-t border-border/60">
              {loading ? (
                <div className="h-10 rounded-xl animate-pulse bg-surface border border-border" />
              ) : user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || "User profile photo"}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground">
                        <UserIcon className="w-4 h-4" aria-hidden="true" />
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.displayName || "Signed In"}
                      </p>
                      {user.email && (
                        <p className="text-xs text-muted truncate">{user.email}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await signOutUser();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-error hover:bg-error/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" aria-hidden="true" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    signInWithGoogle();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-base font-medium shadow-sm active:scale-[0.98] transition-all"
                >
                  <LogIn className="w-5 h-5" aria-hidden="true" />
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
