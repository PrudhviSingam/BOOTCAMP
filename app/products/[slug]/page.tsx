import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import ProductDetailClient from "./_components/ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProductBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

// ── Dynamic SEO metadata ───────────────────────────────────────
export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
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
}

// ── Page ──────────────────────────────────────────────────────
export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <ProductDetailClient product={product} />
    </div>
  );
}
