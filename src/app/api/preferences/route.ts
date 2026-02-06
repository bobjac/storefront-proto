/**
 * User Preferences API route.
 * GET /api/preferences - Get current preferences
 * POST /api/preferences - Update preferences
 * DELETE /api/preferences - Clear preferences
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  parsePreferences,
  serializePreferences,
  applyPreferenceUpdate,
  createDefaultPreferences,
  getCookieConfig,
} from "@/lib/user";
import type { PreferenceUpdate } from "@/lib/user";

/**
 * Get current user preferences.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const preferencesCookie = cookieStore.get("user_preferences");
    const preferences = parsePreferences(preferencesCookie?.value);
    
    return NextResponse.json({
      ok: true,
      data: preferences,
    });
  } catch (error) {
    console.error("Get preferences error:", error);
    
    return NextResponse.json(
      {
        ok: false,
        error: {
          type: "storage",
          message: "Failed to get preferences",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Update user preferences.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PreferenceUpdate;
    
    // Get current preferences
    const cookieStore = await cookies();
    const preferencesCookie = cookieStore.get("user_preferences");
    const currentPreferences = parsePreferences(preferencesCookie?.value);
    
    // Apply update
    const result = applyPreferenceUpdate(currentPreferences, body);
    
    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error,
        },
        { status: 400 }
      );
    }
    
    // Save updated preferences
    const config = getCookieConfig();
    const serialized = serializePreferences(result.data);
    
    cookieStore.set(config.name, serialized, {
      maxAge: config.maxAge,
      path: config.path,
      secure: config.secure,
      sameSite: config.sameSite,
      httpOnly: config.httpOnly,
    });
    
    return NextResponse.json({
      ok: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    
    return NextResponse.json(
      {
        ok: false,
        error: {
          type: "storage",
          message: "Failed to update preferences",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Clear user preferences.
 */
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const config = getCookieConfig();
    
    // Create fresh preferences (keeps session ID)
    const preferencesCookie = cookieStore.get("user_preferences");
    const currentPreferences = parsePreferences(preferencesCookie?.value);
    const freshPreferences = createDefaultPreferences(currentPreferences.sessionId);
    
    // Save fresh preferences
    const serialized = serializePreferences(freshPreferences);
    
    cookieStore.set(config.name, serialized, {
      maxAge: config.maxAge,
      path: config.path,
      secure: config.secure,
      sameSite: config.sameSite,
      httpOnly: config.httpOnly,
    });
    
    return NextResponse.json({
      ok: true,
      data: freshPreferences,
    });
  } catch (error) {
    console.error("Clear preferences error:", error);
    
    return NextResponse.json(
      {
        ok: false,
        error: {
          type: "storage",
          message: "Failed to clear preferences",
        },
      },
      { status: 500 }
    );
  }
}
