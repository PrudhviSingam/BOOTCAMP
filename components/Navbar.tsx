"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, Zap, Home, Package, LogIn, LogOut, User, ChevronDown } from "lucide-react";
import { useAuth, signInWithGoogle, signOutUser } from "@/lib/firebase";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Use our Firebase auth hook
  const { user, loading } = useAuth();
  
  const itemCount = 0;

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

          {/* Right Section: Auth, Cart & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            
            {/* Auth UI */}
            {loading ? (
              <div className="w-9 h-9 rounded-full bg-border animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-full border border-border hover:border-primary/50 bg-surface transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || "User"} 
                      width={32} 
                      height={32} 
                      className="rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground max-w-[100px] truncate hidden sm:block">
                    {user.displayName?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted hidden sm:block" />
                </button>

                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsDropdownOpen(false)} 
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-lg overflow-hidden animate-fade-in z-50">
                      <div className="p-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground truncate">{user.displayName || "User"}</p>
                        <p className="text-xs text-muted truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={async () => {
                          await signOutUser();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign in</span>
              </button>
            )}

            {/* Shopping Cart Icon with Item-Count Badge */}
            <button
              type="button"
              className="relative p-2.5 rounded-xl bg-surface border border-border text-muted hover:text-foreground hover:border-primary/50 transition-all duration-150"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-bold text-primary-foreground bg-primary rounded-full shadow-sm">
                {itemCount}
              </span>
            </button>

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
          <div className="px-4 pt-2 pb-4 space-y-1">
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
          </div>
        </div>
      )}
    </header>
  );
}
