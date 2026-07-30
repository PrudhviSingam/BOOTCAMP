import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Tag } from "lucide-react";

export interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  slug: string;
  category?: string;
}

export default function ProductCard({ image, name, price, slug, category }: ProductCardProps) {
  return (
    <article className="group flex flex-col bg-surface rounded-2xl border border-border overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">

      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-background">
        <Image
          src={image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {category && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg glass text-xs font-medium text-foreground">
            <Tag className="w-3 h-3" aria-hidden="true" />
            {category}
          </span>
        )}
      </div>

      {/* Content */}
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
          className="group/btn flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-150"
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
