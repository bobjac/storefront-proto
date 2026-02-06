/**
 * AI configuration for Azure OpenAI and related services.
 */

import type { AzureOpenAIConfig } from "@/lib/ai/types";

/**
 * Get Azure OpenAI configuration from environment variables.
 */
export function getAzureOpenAIConfig(): AzureOpenAIConfig {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const useEntraAuth = process.env.AZURE_OPENAI_USE_ENTRA_AUTH === "true" || !apiKey;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT ?? "gpt-4o";
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION ?? "2024-02-15-preview";

  if (!endpoint) {
    throw new Error("AZURE_OPENAI_ENDPOINT environment variable is required");
  }

  if (!useEntraAuth && !apiKey) {
    throw new Error(
      "Either AZURE_OPENAI_API_KEY or AZURE_OPENAI_USE_ENTRA_AUTH=true is required"
    );
  }

  return {
    endpoint,
    apiKey,
    useEntraAuth,
    deployment,
    apiVersion,
    timeout: 30000, // 30 seconds
    maxRetries: 2,
  };
}

/**
 * AI search configuration.
 */
export const aiSearchConfig = {
  /** Minimum confidence threshold to use AI results */
  minConfidenceThreshold: 0.3,

  /** Maximum products to fetch from Saleor before AI ranking */
  maxCandidateProducts: 100,

  /** Default number of results to return */
  defaultLimit: 20,

  /** Maximum number of results to return */
  maxLimit: 50,

  /** Cache TTL for AI results in seconds */
  cacheTtlSeconds: 300,

  /** Enable/disable AI search (feature flag) */
  enabled: process.env.AI_SEARCH_ENABLED !== "false",

  /** Fallback to standard search on AI error */
  fallbackOnError: true,
};

/**
 * Recommendation configuration.
 */
export const recommendationConfig = {
  /** Number of similar products to show */
  similarProductsLimit: 6,

  /** Number of "frequently bought together" products */
  frequentlyBoughtLimit: 3,

  /** Number of "complete the look" products */
  completeTheLookLimit: 4,

  /** Number of homepage recommendation sections */
  homepageSectionsLimit: 3,

  /** Products per homepage section */
  productsPerSection: 8,

  /** Minimum confidence to show recommendations */
  minConfidenceThreshold: 0.5,

  /** Cache TTL for recommendations in seconds */
  cacheTtlSeconds: 600,

  /** Enable/disable recommendations (feature flag) */
  enabled: process.env.RECOMMENDATIONS_ENABLED !== "false",
};

/**
 * Rate limiting configuration.
 */
export const rateLimitConfig = {
  /** Maximum AI searches per user per minute */
  searchesPerMinute: 60,

  /** Maximum complex searches per user per minute */
  complexSearchesPerMinute: 10,

  /** Maximum recommendation requests per user per minute */
  recommendationsPerMinute: 120,
};

/**
 * Check if AI features are properly configured.
 */
export function isAIConfigured(): boolean {
  const hasEndpoint = !!process.env.AZURE_OPENAI_ENDPOINT;
  const hasApiKey = !!process.env.AZURE_OPENAI_API_KEY;
  const useEntraAuth = process.env.AZURE_OPENAI_USE_ENTRA_AUTH === "true";
  
  return hasEndpoint && (hasApiKey || useEntraAuth);
}
