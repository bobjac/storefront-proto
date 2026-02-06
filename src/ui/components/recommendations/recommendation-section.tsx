/**
 * Recommendation Section component.
 * Generic container for displaying product recommendations.
 */

import Link from "next/link";
import type { Recommendation } from "@/lib/recommendations/types";
import { RecommendationCard } from "./recommendation-card";

interface RecommendationSectionProps {
  /** Recommendation data */
  recommendation: Recommendation;
  /** Channel for product links */
  channel: string;
  /** Show "View All" link */
  showViewAll?: boolean;
  /** Custom view all URL */
  viewAllUrl?: string;
}

/**
 * Display a section of recommendations.
 */
export function RecommendationSection({
  recommendation,
  channel,
  showViewAll = false,
  viewAllUrl,
}: RecommendationSectionProps) {
  const { title, reason, products } = recommendation;

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{reason}</p>
        </div>
        {showViewAll && viewAllUrl && (
          <Link
            href={viewAllUrl}
            className="text-sm font-medium text-primary hover:underline"
          >
            View All →
          </Link>
        )}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {products.map((product) => (
          <RecommendationCard
            key={product.id}
            product={product}
            channel={channel}
          />
        ))}
      </div>
    </section>
  );
}

export default RecommendationSection;
