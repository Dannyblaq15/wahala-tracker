import { NextResponse } from "next/server";

/**
 * GET /.well-known/web-app-origin-association
 *
 * Required by the WICG scope_extensions proposal so that browsers
 * (Chrome 138+ / Edge) can verify that the origin listed in
 * `scope_extensions` of the manifest actually consents to being
 * part of this PWA's scope.
 *
 * @see https://wicg.github.io/manifest-incubations/#web-app-origin-association-format
 *
 * Format:
 * {
 *   "<manifest-id>": { "scope": "<allowed-scope>" }
 * }
 *
 * The `id` in this file must match the `id` field of the web app manifest.
 */
export async function GET() {
  const association = {
    // The manifest `id` field must match exactly.
    // Our manifest has: id: "/"  which resolves relative to the origin:
    // https://wahala-tracker.vercel.app/
    "https://wahala-tracker.vercel.app/": {
      scope: "/",
    },
  };

  return NextResponse.json(association, {
    headers: {
      // Served as JSON — browsers expect this content-type
      "Content-Type": "application/json",
      // No caching so revocation takes effect immediately
      "Cache-Control": "no-cache",
    },
  });
}
