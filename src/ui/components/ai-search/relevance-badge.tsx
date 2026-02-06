/**
 * Relevance Badge component.
 * Shows the AI relevance score for a product.
 */

interface RelevanceBadgeProps {
  /** Relevance score (0-1) */
  score: number;
  /** Reason for the match */
  reason?: string;
}

/**
 * Display a relevance score badge.
 */
export function RelevanceBadge({ score, reason }: RelevanceBadgeProps) {
  const percentage = Math.round(score * 100);
  
  // Determine badge color based on score
  const getBadgeStyles = () => {
    if (score >= 0.9) {
      return "bg-green-500 text-white";
    } else if (score >= 0.75) {
      return "bg-blue-500 text-white";
    } else {
      return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div
      className={`
        group relative inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
        ${getBadgeStyles()}
      `}
      title={reason}
    >
      <svg
        className="mr-1 h-3 w-3"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      {percentage}% match

      {/* Tooltip with reason */}
      {reason && (
        <div
          className="
            absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform
            whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background
            opacity-0 transition-opacity group-hover:opacity-100
          "
        >
          {reason}
          <div
            className="
              absolute left-1/2 top-full -translate-x-1/2 transform
              border-4 border-transparent border-t-foreground
            "
          />
        </div>
      )}
    </div>
  );
}

export default RelevanceBadge;
