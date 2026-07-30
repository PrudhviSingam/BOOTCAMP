import Link from "next/link";
import { Zap, Code2, Send, Camera, Mail } from "lucide-react";

const navLinks = [
  { href: "/",        label: "Home"     },
  { href: "/products", label: "Products" },
  { href: "/cart",    label: "Cart"     },
  { href: "/checkout", label: "Checkout" },
];

const socialLinks = [
  { href: "https://github.com",    icon: Code2,  label: "GitHub"    },
  { href: "https://twitter.com",   icon: Send,   label: "Twitter"   },
  { href: "https://instagram.com", icon: Camera, label: "Instagram" },
  { href: "mailto:hello@nexcart.dev", icon: Mail, label: "Email"   },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-surface border-t border-border mt-auto"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 group w-fit"
              aria-label="NexCart home"
            >
              <span className="gradient-primary rounded-lg p-1.5 group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4 text-white" aria-hidden="true" />
              </span>
              <span className="font-bold text-lg text-foreground">
                Nex<span className="gradient-text">Cart</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-[260px]">
              Your trusted destination for premium products delivered with care and speed.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-background border border-border text-muted hover:text-primary hover:border-primary/40 transition-all duration-150"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-widest">Navigation</h3>
            <ul className="space-y-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / legal column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-widest">Contact</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>hello@nexcart.dev</li>
              <li>+91 98765 43210</li>
              <li>Bengaluru, Karnataka</li>
              <li>India — 560001</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <p>
            &copy; {year}{" "}
            <span className="gradient-text font-semibold">NexCart</span>
            . All rights reserved.
          </p>
          <p>Built with Next.js, Supabase &amp; Razorpay</p>
        </div>
      </div>
    </footer>
  );
}
