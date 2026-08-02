import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

/** Props accepted by the ProductCard component. */
export interface ProductCardProps {
  /** URL or path to the product image. */
  image: string;
  /** Display name of the product. */
  name: string;
  /** Price of the product (numeric). */
  price: number;
  /** URL‑safe slug used for the product detail route. */
  slug: string;
}

/**
 * ProductCard — displays a product thumbnail, name, price,
 * and a primary‑themed "View Product" CTA linking to `/products/[slug]`.
 */
export default function ProductCard({ image, name, price, slug }: ProductCardProps) {
  return (
    <article
      className="group flex flex-col bg-surface rounded-2xl border border-border overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
    >
      {/* ── Product image ── */}
      <div className="relative aspect-square overflow-hidden bg-background">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <h2 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
          {name}
        </h2>

        <div className="flex items-center justify-between mt-auto">
          <p className="text-lg font-bold text-primary">
            ₹{price.toLocaleString("en-IN")}
          </p>
        </div>

        <Link
          href={`/products/${slug}`}
          id={`product-card-${slug}`}
          className="group/btn flex items-center justify-center gap-2 w-full px-4 py-2.5 min-h-[44px] rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-150"
          aria-label={`View product: ${name}`}
        >
          View Product
          <ArrowRight
            className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
