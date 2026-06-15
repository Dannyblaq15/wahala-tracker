import { NextResponse } from "next/server";

/**
 * GET /api/widgets/stress-data
 *
 * Returns the JSON data used to populate the Wahala Stress Widget
 * Adaptive Card template for the Windows 11 Widgets Board.
 *
 * In a real implementation this would query the user's Firestore data;
 * for now it returns sensible placeholder values so the widget renders.
 */
export async function GET() {
  const data = {
    appIcon: "https://wahala-tracker.vercel.app/icon-192.png",
    appUrl: "https://wahala-tracker.vercel.app",
    stressLevel: "--",
    levelLabel: "No logs today",
    levelColor: "Light",
    entryCount: 0,
    lastUpdated: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  return NextResponse.json(data, {
    headers: {
      // Allow the widget host (Edge) to read this resource cross-origin
      "Access-Control-Allow-Origin": "*",
      // Cache for 30 minutes (matches widget `update` interval)
      "Cache-Control": "public, max-age=1800, stale-while-revalidate=60",
    },
  });
}
