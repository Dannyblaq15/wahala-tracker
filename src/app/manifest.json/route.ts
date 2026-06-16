import { NextResponse } from "next/server";
import manifestFn from "../manifest";

export async function GET() {
  const manifest = manifestFn();
  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
