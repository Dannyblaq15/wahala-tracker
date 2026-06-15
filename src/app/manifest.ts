import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    // ── Required ──────────────────────────────────────────────
    name: "Wahala Tracker",
    short_name: "Wahala",
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
    start_url: "/?source=pwa",

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

    // ── Optional ──────────────────────────────────────────────
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

    prefer_related_applications: false,

    share_target: {
      action: "/dashboard",
      method: "GET",
      params: {
        title: "title",
        text: "text",
        url: "url",
      },
    },
  };
}
