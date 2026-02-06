/**
 * Homepage Recommendations component.
 * Displays personalized recommendations on the homepage.
 */

import type { HomepageRecommendations } from "@/lib/recommendations/types";
import { RecommendationSection } from "./recommendation-section";

interface HomepageRecommendationsProps {
  /** Homepage recommendations data */
  recommendations: HomepageRecommendations;
  /** Channel for product links */
  channel: string;
}

/**
 * Display homepage recommendation sections.
 */
export function HomepageRecommendationsComponent({
  recommendations,
  channel,
}: HomepageRecommendationsProps) {
  const { sections } = recommendations;

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {sections.map((section, index) => (
        <RecommendationSection
          key={`${section.type}-${index}`}
          recommendation={section}
          channel={channel}
          showViewAll={true}
          viewAllUrl={`/${channel}/search?category=${section.type}`}
        />
      ))}
    </div>
  );
}

export default HomepageRecommendationsComponent;
