/**
 * AI Search API route.
 * GET /api/search?q=...&channel=...
 */

import { NextRequest, NextResponse } from "next/server";
import { aiSearchProducts } from "@/lib/search";
import { aiSearchConfig } from "@/config/ai";

/**
 * AI-powered search endpoint.
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Required parameters
    const query = searchParams.get("q");
    const channel = searchParams.get("channel");
    
    // Validate required parameters
    if (!query) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            type: "validation",
            message: "Search query is required",
            code: "MISSING_QUERY",
            isRetryable: false,
          },
        },
        { status: 400 }
      );
    }
    
    if (!channel) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            type: "validation",
            message: "Channel is required",
            code: "MISSING_CHANNEL",
            isRetryable: false,
          },
        },
        { status: 400 }
      );
    }
    
    // Optional parameters
    const limit = Math.min(
      parseInt(searchParams.get("limit") ?? "20", 10),
      aiSearchConfig.maxLimit
    );
    const cursor = searchParams.get("cursor") ?? undefined;
    const direction = searchParams.get("direction") === "backward" 
      ? "backward" as const 
      : "forward" as const;
    
    // Perform AI search
    const result = await aiSearchProducts({
      query,
      channel,
      limit,
      cursor,
      direction,
    });
    
    return NextResponse.json({
      ok: true,
      data: {
        intent: result.intent,
        intentExplanation: result.intentExplanation,
        suggestedRefinements: result.suggestedRefinements,
        products: result.products,
        pagination: result.pagination,
        queryTimeMs: Date.now() - startTime,
      },
    });
  } catch (error) {
    console.error("AI search error:", error);
    
    return NextResponse.json(
      {
        ok: false,
        error: {
          type: "ai_service",
          message: error instanceof Error ? error.message : "Search failed",
          code: "SEARCH_ERROR",
          isRetryable: true,
        },
      },
      { status: 500 }
    );
  }
}
