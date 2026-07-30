"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, Zap, Home, Package } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const itemCount = 0;

  const navLinks = [
    { name: "Home", href: "#", icon: Home },
    { name: "Products", href: "#", icon: Package },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Store Logo / Name (Left) */}
          <div className="flex items-center">
            <Link
              href="#"
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

          {/* Right Section: Cart & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
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

