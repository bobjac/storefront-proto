/**
 * AI Search Demo Page.
 * This page allows testing the AI search functionality without Saleor.
 */

import { Suspense } from "react";
import { aiSearchProducts } from "@/lib/search";
import { AISearchResults } from "@/ui/components/ai-search/ai-search-results";
import { getNewArrivals, getTrendingProducts } from "@/lib/mock-data";
import { RecommendationSection } from "@/ui/components/recommendations/recommendation-section";

export const metadata = {
  title: "AI Search Demo | Storefront PoC",
  description: "Test the AI-powered product search and recommendations",
};

type SearchParams = {
  q?: string | string[];
};

export default function DemoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            AI Search Demo
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Test natural language search and personalized recommendations
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Section */}
        <section className="mb-12">
          <Suspense fallback={<SearchFormSkeleton />}>
            <SearchSection searchParams={searchParams} />
          </Suspense>
        </section>

        {/* Recommendations Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Personalized Recommendations
          </h2>
          <Suspense fallback={<RecommendationsSkeleton />}>
            <DemoRecommendations />
          </Suspense>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            Saleor Storefront PoC - AI Search Feature Demo
          </p>
        </div>
      </footer>
    </div>
  );
}

async function SearchSection({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await searchParamsPromise;
  const queryParam = searchParams.q;
  const query = Array.isArray(queryParam) ? queryParam[0] : queryParam;

  return (
    <div>
      {/* Search Form */}
      <SearchForm initialQuery={query} />

      {/* Search Results */}
      {query && (
        <div className="mt-8">
          <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResults query={query} />
          </Suspense>
        </div>
      )}

      {/* Example Queries */}
      {!query && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Try these example queries:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ExampleQuery query="blue dress for a summer wedding" />
            <ExampleQuery query="elegant outfit for a cocktail party" />
            <ExampleQuery query="casual tops under $50" />
            <ExampleQuery query="black dress for a formal event" />
            <ExampleQuery query="floral maxi dress for garden party" />
            <ExampleQuery query="professional blouse for office" />
            <ExampleQuery query="romantic date night outfit" />
            <ExampleQuery query="bohemian style accessories" />
          </div>
        </div>
      )}
    </div>
  );
}

async function SearchResults({ query }: { query: string }) {
  const result = await aiSearchProducts({
    query,
    channel: "default-channel",
    limit: 20,
  });

  return (
    <AISearchResults
      products={result.products}
      intent={result.intent}
      intentExplanation={result.intentExplanation}
      suggestedRefinements={result.suggestedRefinements}
      channel="default-channel"
    />
  );
}

async function DemoRecommendations() {
  const trending = getTrendingProducts(8);
  const newArrivals = getNewArrivals(8);

  return (
    <div className="space-y-12">
      <RecommendationSection
        recommendation={{
          type: "based_on_history",
          title: "Trending Now",
          reason: "Popular with our customers",
          products: trending,
          confidence: 0.9,
        }}
        channel="default-channel"
      />
      <RecommendationSection
        recommendation={{
          type: "similar",
          title: "New Arrivals",
          reason: "Just added to our collection",
          products: newArrivals,
          confidence: 0.85,
        }}
        channel="default-channel"
      />
    </div>
  );
}

function SearchForm({ initialQuery }: { initialQuery?: string }) {
  return (
    <form action="/demo" method="GET" className="max-w-2xl">
      <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
        Search with natural language
      </label>
      <div className="flex gap-3">
        <input
          type="text"
          name="q"
          id="search"
          defaultValue={initialQuery}
          placeholder="e.g., 'blue dress for a summer wedding'"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}

function ExampleQuery({ query }: { query: string }) {
  return (
    <a
      href={`/demo?q=${encodeURIComponent(query)}`}
      className="block p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
    >
      "{query}"
    </a>
  );
}

function SearchFormSkeleton() {
  return (
    <div className="max-w-2xl animate-pulse">
      <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
      <div className="flex gap-3">
        <div className="flex-1 h-12 bg-gray-200 rounded-lg" />
        <div className="w-24 h-12 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-64 bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-[3/4] bg-gray-200" />
            <div className="p-4">
              <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {Array.from({ length: 2 }).map((_, sectionIdx) => (
        <div key={sectionIdx}>
          <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3">
                  <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
