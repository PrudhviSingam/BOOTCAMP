import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./_components/ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

// ── Dynamic SEO metadata ───────────────────────────────────────
export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res  = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/products/${slug}`, { cache: "no-store" });
    const data = await res.json();
    const product = data.product;
    if (!product) return { title: "Product Not Found" };
    return {
      title:       product.name,
      description: product.description,
      openGraph: {
        title:       product.name,
        description: product.description,
        images:      product.image_url ? [{ url: product.image_url }] : [],
      },
    };
  } catch {
    return { title: "Product" };
  }
}

// ── Page ──────────────────────────────────────────────────────
export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  // Server-fetch product for initial render
  let product = null;
  try {
    const res  = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/products/${slug}`, { cache: "no-store" });
    const data = await res.json();
    product    = data.product ?? null;
  } catch {
    // fall through to notFound
  }

  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <ProductDetailClient product={product} />
    </div>
  );
}
