import type { MetadataRoute } from "next";

// Extend the Next.js manifest type with fields not yet in the official typings
type FullManifest = MetadataRoute.Manifest & {
  /** IARC content rating certificate ID (obtain from https://www.globalratings.com/) */
  iarc_rating_id?: string;
  /** Windows 11 / Edge widget definitions */
  widgets?: Array<{
    name: string;
    tag: string;
    url: string;
    icons?: Array<{ src: string; sizes: string; type: string }>;
    screenshots?: Array<{ src: string; sizes: string; label: string }>;
    description?: string;
    short_name?: string;
    ms_ac_template?: string;
  }>;
  /** Microsoft Edge side-panel preferred width */
  edge_side_panel?: { preferred_width?: number };
  /** Chrome note-taking integration */
  note_taking?: { new_note_url: string };
  /** Extend PWA scope to additional origins (experimental) */
  scope_extensions?: Array<{ origin: string }>;
};

export default function manifest(): FullManifest {
  return {
    // ── Required ──────────────────────────────────────────────
    name: "Wahala Tracker",
    short_name: "Wahala",
    start_url: "/?source=pwa",
    icons: [
      {
        src: "/favicon.ico",
        type: "image/x-icon",
        sizes: "16x16 32x32",
      },
      {
        src: "/icon-192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: "/icon-192-maskable.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "maskable",
      },
      {
        src: "/icon-512-maskable.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],

    // ── Recommended ───────────────────────────────────────────
    id: "/",
    orientation: "any",
    display: "standalone",
    theme_color: "#008751",
    background_color: "#0D0D0D",
    description:
      "A premium Nigerian-style issue tracking system to log your daily challenges and monitor your mood.",
    screenshots: [
      {
        src: "/screenshot-mobile.png",
        type: "image/png",
        sizes: "1024x1024",
        form_factor: "narrow",
        label: "Wahala Tracker — Log your daily stress on mobile",
        platform: "android",
      },
      {
        src: "/screenshot-desktop.png",
        type: "image/png",
        sizes: "1024x1024",
        form_factor: "wide",
        label: "Wahala Tracker — Dashboard overview on desktop",
        platform: "windows",
      },
    ],

    // ── Optional (typed by Next.js) ────────────────────────────
    lang: "en",
    scope: "/",
    dir: "ltr",
    categories: ["lifestyle", "productivity", "health"],

    shortcuts: [
      {
        name: "Log Wahala",
        short_name: "Log",
        description: "Quickly log a new stress entry",
        url: "/dashboard",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Analytics",
        short_name: "Stats",
        description: "View your stress analytics and trends",
        url: "/analytics",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "My Profile",
        short_name: "Profile",
        description: "Manage your account and settings",
        url: "/profile",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],

    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],

    launch_handler: {
      client_mode: ["navigate-existing", "auto"],
    },

    // Open exported JSON stress reports directly in the app
    file_handlers: [
      {
        action: "/dashboard",
        accept: {
          "application/json": [".json"],
          "text/plain": [".txt"],
        },
      },
    ],

    // Custom protocol: web+wahala://log → opens the dashboard log form
    protocol_handlers: [
      {
        protocol: "web+wahala",
        url: "/dashboard?source=%s",
      },
    ],

    // Web app has no native counterpart; prefer_related_applications: false
    prefer_related_applications: false,
    related_applications: [],

    // Share-target: accept shared links/text into the dashboard
    share_target: {
      action: "/dashboard",
      method: "GET",
      params: {
        title: "title",
        text: "text",
        url: "url",
      },
    },

    // ── Optional (extended type — browser-experimental) ────────

    // IARC content rating (general audiences — obtain certificate at globalratings.com)
    iarc_rating_id: "e84b072d-71b3-4d3e-86ae-31a8ce4e53b7",

    // Windows 11 / Microsoft Edge widget
    widgets: [
      {
        name: "Wahala Stress Widget",
        short_name: "Wahala",
        description: "Quick-glance at your current stress index",
        tag: "wahala-stress-widget",
        url: "/dashboard",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        ],
        screenshots: [
          {
            src: "/screenshot-mobile.png",
            sizes: "1024x1024",
            label: "Wahala Stress Widget preview",
          },
        ],
      },
    ],

    // Microsoft Edge: open app in side panel at 400 px wide
    edge_side_panel: {
      preferred_width: 400,
    },

    // Chrome note-taking: new notes open on the dashboard
    note_taking: {
      new_note_url: "/dashboard",
    },

    // Scope extensions (experimental — extend PWA trust to subdomain if deployed)
    scope_extensions: [],
  };
}
