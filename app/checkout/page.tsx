import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutClient from "./_components/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <h1 className="text-3xl font-extrabold text-foreground mb-8">Checkout</h1>
        <CheckoutClient />
      </main>
      <Footer />
    </>
  );
}
