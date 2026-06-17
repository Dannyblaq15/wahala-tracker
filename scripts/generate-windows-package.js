#!/usr/bin/env node
/**
 * PWABuilder Windows Package Generator
 * Calls the PWABuilder API directly to generate a Windows MSIX package
 * and saves the result to Wahala.zip in the project root.
 *
 * Usage: node scripts/generate-windows-package.js [--output <path>]
 */

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

// ── Configuration ─────────────────────────────────────────────────────────────
const SITE_URL = "https://wahala-tracker.vercel.app/";
const MANIFEST_URL = "https://wahala-tracker.vercel.app/manifest.json";
const WINDOWS_PACKAGE_GENERATOR_URL =
  "https://pwabuilder-windows-docker.azurewebsites.net/msix/generatezip";

const outputPath =
  process.argv[process.argv.indexOf("--output") + 1] ||
  path.join(__dirname, "..", "Wahala-windows.zip");

// ── Build the package options payload ─────────────────────────────────────────
// This mirrors exactly what PWABuilder's web client sends.
const packageOptions = {
  name: "Wahala",
  packageId: "app.vercel.wahala-tracker.edge",
  url: SITE_URL,
  version: "1.0.1",
  allowSigning: true,
  publisher: {
    displayName: "Contoso, Inc.",
    commonName: "CN=3a54a224-05dd-42aa-85bd-3f3c1478fdca",
  },
  generateModernPackage: true,
  classicPackage: {
    generate: true,
    version: "1.0.0",
    url: SITE_URL,
  },
  edgeHtmlPackage: {
    generate: false,
  },
  manifestUrl: MANIFEST_URL,
  manifest: {
    name: "Wahala Tracker",
    short_name: "Wahala",
    start_url: "/?source=pwa",
    icons: [
      { src: "/icon-192.png", type: "image/png", sizes: "192x192", purpose: "any" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512", purpose: "any" },
      { src: "/icon-192-maskable.png", type: "image/png", sizes: "192x192", purpose: "maskable" },
      { src: "/icon-512-maskable.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
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
    display_override: ["tabbed", "window-controls-overlay", "standalone", "minimal-ui"],
    launch_handler: { client_mode: ["navigate-existing", "auto"] },
    file_handlers: [
      {
        action: "/dashboard",
        accept: {
          "application/json": [".json"],
          "text/plain": [".txt"],
        },
      },
    ],
    protocol_handlers: [{ protocol: "web+wahala", url: "/dashboard?source=%s" }],
    prefer_related_applications: false,
    related_applications: [
      {
        platform: "play",
        url: "https://play.google.com/store/apps/details?id=com.wahala.tracker",
        id: "com.wahala.tracker",
      },
      {
        platform: "itunes",
        url: "https://apps.apple.com/app/wahala-tracker/id1662495830",
        id: "1662495830",
      },
    ],
    share_target: {
      action: "/dashboard",
      method: "GET",
      params: { title: "title", text: "text", url: "url" },
    },
    iarc_rating_id: "e84b072d-71b3-4d3e-86ae-31a8ce4e53b7",
    widgets: [
      {
        name: "Wahala Stress Widget",
        short_name: "Wahala",
        description: "Quick-glance at your current daily stress index",
        tag: "wahala-stress-widget",
        url: "/dashboard",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
        screenshots: [
          { src: "/screenshot-mobile.png", sizes: "1024x1024", label: "Wahala Stress Widget preview" },
        ],
        template: "/widgets/stress-widget.json",
        ms_ac_template: "/widgets/stress-widget.json",
        data: "/api/widgets/stress-data",
        type: "application/json",
        update: 1800,
      },
    ],
    edge_side_panel: { preferred_width: 400 },
    note_taking: { new_note_url: "/dashboard" },
  },
  images: {
    baseImage: "https://wahala-tracker.vercel.app/icon-512.png",
    backgroundColor: "transparent",
    padding: 0,
  },
  resourceLanguage: "en",
  enableWebAppWidgets: true,
  extensions: "appurihandler",
  targetDeviceFamilies: ["Desktop", "Holographic"],
};

// ── HTTP helper (follow redirects) ────────────────────────────────────────────
function fetch(urlStr, options, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const lib = url.protocol === "https:" ? https : http;

    const reqOptions = {
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: url.pathname + url.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = lib.request(reqOptions, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        return fetch(res.headers.location, options, body).then(resolve).catch(reject);
      }
      resolve(res);
    });

    req.on("error", reject);

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const body = JSON.stringify(packageOptions);

  console.log("📦 Calling PWABuilder Windows Package Generator...");
  console.log(`   URL: ${WINDOWS_PACKAGE_GENERATOR_URL}`);
  console.log(`   Site: ${SITE_URL}`);
  console.log();

  const res = await fetch(
    WINDOWS_PACKAGE_GENERATOR_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "platform-identifier": "PWABuilder",
        "platform-identifier-version": "1.0.0",
      },
    },
    body
  );

  if (res.statusCode !== 200) {
    let errBody = "";
    res.setEncoding("utf8");
    for await (const chunk of res) {
      errBody += chunk;
    }
    console.error(`❌ Request failed with status ${res.statusCode}: ${res.statusMessage}`);
    console.error("Response body:", errBody);
    process.exit(1);
  }

  console.log("✅ Package generated successfully. Downloading...");

  const file = fs.createWriteStream(outputPath);
  await new Promise((resolve, reject) => {
    res.pipe(file);
    file.on("finish", () => {
      file.close(resolve);
    });
    file.on("error", reject);
    res.on("error", reject);
  });

  const stat = fs.statSync(outputPath);
  const sizeMB = (stat.size / (1024 * 1024)).toFixed(2);

  console.log();
  console.log(`🎉 Windows package saved to:`);
  console.log(`   ${outputPath}`);
  console.log(`   Size: ${sizeMB} MB`);
  console.log();
  console.log("Next steps:");
  console.log("  1. Unzip the file to see the .msixbundle and install.ps1 script.");
  console.log("  2. On a Windows machine, run install.ps1 (may need:");
  console.log('     Set-ExecutionPolicy Bypass -Scope Process) to sideload.');
  console.log("  3. For Store submission, get Publisher info from");
  console.log("     https://partner.microsoft.com/ and re-run with your real details.");
}

main().catch((err) => {
  console.error("❌ Unexpected error:", err.message || err);
  process.exit(1);
});
