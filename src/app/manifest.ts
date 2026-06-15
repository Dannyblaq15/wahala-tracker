import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wahala Tracker",
    short_name: "Wahala",
    description:
      "A premium Nigerian-style issue tracking system to log your daily challenges and monitor your mood.",
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "en",
    background_color: "#0D0D0D",
    theme_color: "#008751",
    categories: ["lifestyle", "productivity", "health"],
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
  };
}
