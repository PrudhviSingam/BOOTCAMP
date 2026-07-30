import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | NexCart",
    default: "NexCart — Premium Products, Fast Delivery",
  },
  description:
    "NexCart is your trusted destination for premium electronics, accessories, and lifestyle products with fast, secure checkout powered by Razorpay.",
  keywords: ["online shopping", "electronics", "accessories", "NexCart", "ecommerce"],
  authors: [{ name: "NexCart Team" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nexcart.dev",
    siteName: "NexCart",
    title: "NexCart — Premium Products, Fast Delivery",
    description:
      "Explore a curated collection of high-quality products at unbeatable prices with fast, secure checkout.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NexCart" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexCart — Premium Products, Fast Delivery",
    description:
      "Explore a curated collection of high-quality products at unbeatable prices.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
