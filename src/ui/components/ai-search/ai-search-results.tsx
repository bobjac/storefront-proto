/**
 * AI Search Results component.
 * Displays search results with AI-powered relevance information.
 */

import Link from "next/link";
import type { AISearchProduct, ExtractedIntent } from "@/lib/search/types";
import { IntentExplanation } from "./intent-explanation";
import { RefinementChips } from "./refinement-chips";
import { RelevanceBadge } from "./relevance-badge";

interface AISearchResultsProps {
  /** Search results */
  products: AISearchProduct[];
  /** Extracted intent */
  intent: ExtractedIntent;
  /** Explanation of how query was understood */
  intentExplanation?: string;
  /** Suggested refinements */
  suggestedRefinements?: string[];
  /** Channel for product links */
  channel: string;
  /** Callback when refinement is selected */
  onRefinementSelect?: (refinement: string) => void;
}

/**
 * AI-enhanced search results display.
 */
export function AISearchResults({
  products,
  intent,
  intentExplanation,
  suggestedRefinements,
  channel,
  onRefinementSelect,
}: AISearchResultsProps) {
  if (products.length === 0) {
    return <SearchEmptyState query={intent.rawQuery} channel={channel} />;
  }

  return (
    <div className="space-y-6">
      {/* Intent explanation */}
      {intentExplanation && (
        <IntentExplanation
          intent={intent}
          explanation={intentExplanation}
        />
      )}

      {/* Refinement suggestions */}
      {suggestedRefinements && suggestedRefinements.length > 0 && (
        <RefinementChips
          suggestions={suggestedRefinements}
          onSelect={onRefinementSelect}
        />
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? "product" : "products"} found
        </p>
      </div>

      {/* Product grid */}
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {products.map((product, index) => (
          <li key={product.id}>
            <AISearchResultCard
              product={product}
              channel={channel}
              priority={index < 4}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Individual search result card with AI relevance info.
 */
function AISearchResultCard({
  product,
  channel,
  priority,
}: {
  product: AISearchProduct;
  channel: string;
  priority?: boolean;
}) {
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
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}

        {/* Relevance badge */}
        {product.relevanceScore !== undefined && product.relevanceScore >= 0.7 && (
          <div className="absolute right-2 top-2">
            <RelevanceBadge
              score={product.relevanceScore}
              reason={product.matchReason}
            />
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-4">
        {product.categoryName && (
          <p className="mb-1 text-xs text-muted-foreground">
            {product.categoryName}
          </p>
        )}
        <h3 className="font-medium leading-tight text-foreground group-hover:underline">
          {product.name}
        </h3>
        <p className="mt-2 font-semibold text-foreground">{formattedPrice}</p>

        {/* Match reason */}
        {product.matchReason && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
            {product.matchReason}
          </p>
        )}
      </div>
    </Link>
  );
}

/**
 * Empty state when no results found.
 */
function SearchEmptyState({
  query,
  channel,
}: {
  query: string;
  channel: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <svg
          className="h-8 w-8 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-foreground">
        No results for "{query}"
      </h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        Try a different search or browse our categories.
      </p>
      <Link
        href={`/${channel}`}
        className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Browse Products
      </Link>
    </div>
  );
}

export default AISearchResults;
