/**
 * Refinement Chips component.
 * Shows suggested refinements for the search query.
 */

"use client";

import { useState } from "react";

interface RefinementChipsProps {
  /** Suggested refinements */
  suggestions: string[];
  /** Callback when a refinement is selected */
  onSelect?: (refinement: string) => void;
}

/**
 * Display clickable refinement suggestions.
 */
export function RefinementChips({
  suggestions,
  onSelect,
}: RefinementChipsProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (suggestion: string, index: number) => {
    setSelectedIndex(index);
    onSelect?.(suggestion);
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Refine:</span>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => handleSelect(suggestion, index)}
          className={`
            inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium
            transition-colors
            ${
              selectedIndex === index
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }
          `}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

export default RefinementChips;
