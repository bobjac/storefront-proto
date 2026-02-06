/**
 * Similar Products API route.
 * GET /api/recommendations/similar?productId=...&channel=...
 */

import { NextRequest, NextResponse } from "next/server";
import { getRecommendationEngine } from "@/lib/recommendations";
import { recommendationConfig } from "@/config/ai";

/**
 * Get similar products for a given product.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Required parameters
    const productId = searchParams.get("productId");
    const channel = searchParams.get("channel");
    
    // Validate required parameters
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
    
    // Optional parameters
    const limit = Math.min(
      parseInt(searchParams.get("limit") ?? "6", 10),
      recommendationConfig.similarProductsLimit * 2
    );
    const priceVariant = searchParams.get("priceVariant") as "lower" | "similar" | "any" | null;
    
    const engine = getRecommendationEngine();
    const result = await engine.getSimilarProducts({
      productId,
      channel,
      limit,
      priceVariant: priceVariant ?? undefined,
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
    console.error("Similar products error:", error);
    
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
