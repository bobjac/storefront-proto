/**
 * PDP Recommendations component.
 * Displays recommendations on the product detail page.
 */

import type { PDPRecommendations } from "@/lib/recommendations/types";
import { FrequentlyBought } from "./frequently-bought";
import { RecommendationSection } from "./recommendation-section";

interface PDPRecommendationsProps {
  /** PDP recommendations data */
  recommendations: PDPRecommendations;
  /** Current product ID */
  productId: string;
  /** Channel for product links */
  channel: string;
}

/**
 * Display PDP recommendation sections.
 */
export function PDPRecommendationsComponent({
  recommendations,
  productId,
  channel,
}: PDPRecommendationsProps) {
  const {
    frequentlyBoughtTogether,
    completeTheLook,
    similarItems,
    similarTasteBought,
  } = recommendations;

  const hasRecommendations =
    frequentlyBoughtTogether ||
    completeTheLook ||
    similarItems ||
    similarTasteBought;

  if (!hasRecommendations) {
    return null;
  }

  return (
    <div className="space-y-12">
      {/* Frequently Bought Together */}
      {frequentlyBoughtTogether && (
        <FrequentlyBought
          recommendation={frequentlyBoughtTogether}
          channel={channel}
        />
      )}

      {/* Complete the Look */}
      {completeTheLook && (
        <RecommendationSection
          recommendation={completeTheLook}
          channel={channel}
        />
      )}

      {/* Similar Items */}
      {similarItems && (
        <RecommendationSection
          recommendation={similarItems}
          channel={channel}
          showViewAll={true}
          viewAllUrl={`/${channel}/search?similar=${productId}`}
        />
      )}

      {/* Similar Taste */}
      {similarTasteBought && (
        <RecommendationSection
          recommendation={similarTasteBought}
          channel={channel}
        />
      )}
    </div>
  );
}

export default PDPRecommendationsComponent;
