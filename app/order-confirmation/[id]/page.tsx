import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderConfirmationClient from "./_components/OrderConfirmationClient";

export const metadata: Metadata = {
  title: "Order Confirmation",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <OrderConfirmationClient orderId={id} />
      </main>
      <Footer />
    </>
  );
}
