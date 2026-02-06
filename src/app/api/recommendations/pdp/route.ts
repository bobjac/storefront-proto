/**
 * PDP Recommendations API route.
 * GET /api/recommendations/pdp?productId=...&channel=...
 */

import { NextRequest, NextResponse } from "next/server";
import { getRecommendationEngine } from "@/lib/recommendations";
import { parsePreferences } from "@/lib/user";
import { cookies } from "next/headers";

/**
 * Get PDP recommendations for a product.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Required parameters
    const productId = searchParams.get("productId");
    const channel = searchParams.get("channel");
    
    if (!productId) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            type: "validation",
            message: "Product ID is required",
            code: "MISSING_PRODUCT_ID",
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
    
    // Get user preferences from cookies
    const cookieStore = await cookies();
    const preferencesCookie = cookieStore.get("user_preferences");
    const preferences = parsePreferences(preferencesCookie?.value);
    
    const engine = getRecommendationEngine();
    const result = await engine.getPDPRecommendations({
      productId,
      channel,
      userId: preferences.userId,
      sessionId: preferences.sessionId,
    });
    
    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            type: "no_data",
            message: result.error.message,
            code: "NO_RECOMMENDATIONS",
            isRetryable: false,
          },
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      ok: true,
      data: result.data,
    });
  } catch (error) {
    console.error("PDP recommendations error:", error);
    
    return NextResponse.json(
      {
        ok: false,
        error: {
          type: "upstream_error",
          message: error instanceof Error ? error.message : "Failed to get recommendations",
          code: "RECOMMENDATION_ERROR",
          isRetryable: true,
        },
      },
      { status: 500 }
    );
  }
}
