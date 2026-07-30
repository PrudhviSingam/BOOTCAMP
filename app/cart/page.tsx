import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartPageClient from "./_components/CartPageClient";

export const metadata: Metadata = {
  title: "Your Cart",
};

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <h1 className="text-3xl font-extrabold text-foreground mb-8">Your Cart</h1>
        <CartPageClient />
      </main>
      <Footer />
    </>
  );
}
