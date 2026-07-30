import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse the full NexCart catalogue — electronics, accessories, lifestyle products and more at great prices.",
  openGraph: {
    title: "Shop All Products | NexCart",
    description:
      "Browse the full NexCart catalogue — electronics, accessories, lifestyle products and more.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
