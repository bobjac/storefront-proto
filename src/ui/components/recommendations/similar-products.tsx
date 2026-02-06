/**
 * Similar Products component.
 * Client component with "Find Similar" functionality.
 */

"use client";

import { useState } from "react";
import type { Recommendation } from "@/lib/recommendations/types";
import { RecommendationCard } from "./recommendation-card";

interface SimilarProductsProps {
  /** Product ID to find similar for */
  productId: string;
  /** Channel for API calls and links */
  channel: string;
  /** Initial recommendation data (optional) */
  initialData?: Recommendation | null;
}

/**
 * Display similar products with lazy loading option.
 */
export function SimilarProducts({
  productId,
  channel,
  initialData,
}: SimilarProductsProps) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    initialData ?? null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSimilarProducts = async () => {
    if (loading || recommendation) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/recommendations/similar?productId=${productId}&channel=${channel}`
      );
      const data = await response.json();

      if (data.ok) {
        setRecommendation(data.data);
      } else {
        setError(data.error?.message ?? "Failed to load similar products");
      }
    } catch (err) {
      setError("Failed to load similar products");
    } finally {
      setLoading(false);
    }
  };

  // If no data and not loading, show the "Find Similar" button
  if (!recommendation && !loading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Similar Items</h2>
          <button
            onClick={loadSimilarProducts}
            className="text-sm font-medium text-primary hover:underline"
          >
            Find Similar →
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </section>
    );
  }

  // Loading state
  if (loading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Similar Items</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square rounded-lg bg-muted" />
              <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
              <div className="mt-1 h-4 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Show recommendations
  if (recommendation && recommendation.products.length > 0) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {recommendation.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {recommendation.reason}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {recommendation.products.map((product) => (
            <RecommendationCard
              key={product.id}
              product={product}
              channel={channel}
              showReason={true}
            />
          ))}
        </div>
      </section>
    );
  }

  return null;
}

export default SimilarProducts;
