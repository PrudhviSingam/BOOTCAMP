import Link from "next/link";
import {
  ShoppingBag,
  Globe,
  MessageCircle,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const shopLinks = [
    { href: "/products",                     label: "All Products"  },
    { href: "/products?category=Electronics", label: "Electronics"   },
    { href: "/products?category=Clothing",    label: "Clothing"      },
    { href: "/products?category=Home",        label: "Home & Living" },
    { href: "/products?category=Bags",        label: "Bags"          },
  ];

  const supportLinks = [
    { href: "#", label: "FAQ"          },
    { href: "#", label: "Returns"      },
    { href: "#", label: "Shipping"     },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
  ];

  const socialLinks = [
    { href: "https://github.com",  icon: Globe,         label: "GitHub"  },
    { href: "https://twitter.com", icon: MessageCircle, label: "Twitter" },
    { href: "mailto:hello@nexcart.dev", icon: Mail, label: "Email" },
  ];

  return (
    <footer className="mt-auto border-t border-border bg-surface" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-4">
            {/* Store name */}
            <Link
              href="/"
              aria-label="NexCart — go to homepage"
              className="flex items-center gap-2 w-fit group"
            >
              <span
                className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg
                           group-hover:scale-110 transition-transform duration-200"
              >
                <ShoppingBag className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
              </span>
              <span className="text-xl font-bold text-foreground">
                Nex<span className="gradient-text">Cart</span>
              </span>
            </Link>

            <p className="max-w-[240px] text-sm leading-relaxed text-muted">
              Your trusted destination for premium products, delivered with care and speed.
            </p>

            {/* Contact info */}
            <ul className="flex flex-col gap-2 text-xs text-muted">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                hello@nexcart.dev
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                Bengaluru, India — 560001
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border
                             bg-background text-muted transition-all duration-150
                             hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">
              Shop
            </h3>
            <ul className="flex flex-col gap-2">
              {shopLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">
              Support
            </h3>
            <ul className="flex flex-col gap-2">
              {supportLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / tagline block */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Stay in the loop
            </h3>
            <p className="text-sm text-muted">
              New arrivals, deals, and style tips — straight to you.
            </p>
            <div className="flex w-full overflow-hidden rounded-xl border border-border bg-background">
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email address for newsletter"
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground
                           placeholder:text-muted focus:outline-none"
              />
              <button
                type="button"
                aria-label="Subscribe to newsletter"
                className="gradient-primary shrink-0 px-4 py-2.5 text-xs font-semibold
                           text-primary-foreground transition-opacity hover:opacity-90"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom bar — store name + copyright ── */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted">
            &copy; {year}{" "}
            <span className="gradient-text font-semibold">NexCart</span>
            {". "}
            All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Built with Next.js &middot; Supabase &middot; Razorpay
          </p>
        </div>

      </div>
    </footer>
  );
}
