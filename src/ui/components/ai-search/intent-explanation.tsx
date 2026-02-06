/**
 * Intent Explanation component.
 * Shows how the AI understood the user's query.
 */

import type { ExtractedIntent } from "@/lib/search/types";

interface IntentExplanationProps {
  /** Extracted intent */
  intent: ExtractedIntent;
  /** Human-readable explanation */
  explanation: string;
}

/**
 * Display the AI's understanding of the search query.
 */
export function IntentExplanation({
  intent,
  explanation,
}: IntentExplanationProps) {
  return (
    <div className="rounded-lg border border-border bg-muted/50 p-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">
            {explanation}
          </p>

          {/* Show extracted details if present */}
          {(intent.occasion || intent.style || intent.category) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {intent.category && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {intent.category}
                </span>
              )}
              {intent.occasion && (
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                  {intent.occasion}
                </span>
              )}
              {intent.style && (
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {intent.style}
                </span>
              )}
            </div>
          )}

          {/* Confidence indicator */}
          {intent.confidence >= 0.8 && (
            <p className="mt-2 text-xs text-muted-foreground">
              ✓ High confidence match
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default IntentExplanation;
