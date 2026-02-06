/**
 * Recommendation Card component.
 * Individual product card for recommendations.
 */

import Link from "next/link";
import type { AISearchProduct } from "@/lib/search/types";

interface RecommendationCardProps {
  /** Product data */
  product: AISearchProduct;
  /** Channel for product link */
  channel: string;
  /** Show match reason */
  showReason?: boolean;
}

/**
 * Display a single recommended product.
 */
export function RecommendationCard({
  product,
  channel,
  showReason = false,
}: RecommendationCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency,
  }).format(product.price);

  return (
    <Link
      href={`/${channel}/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/20"
    >
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.thumbnailUrl ? (
          <img
            src={product.thumbnailUrl}
            alt={product.thumbnailAlt || product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-3">
        <h3 className="text-sm font-medium leading-tight text-foreground line-clamp-2 group-hover:underline">
          {product.name}
        </h3>
        <p className="mt-1 font-semibold text-foreground">{formattedPrice}</p>
        
        {/* Optional match reason */}
        {showReason && product.matchReason && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            {product.matchReason}
          </p>
        )}
      </div>
    </Link>
  );
}

export default RecommendationCard;
