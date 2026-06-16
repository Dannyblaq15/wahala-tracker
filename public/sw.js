const CACHE_NAME = 'wahala-tracker-cache-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-192-maskable.png',
  '/icon-512-maskable.png',
];

// Install Event: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: cache strategies
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Exclude third-party origins, Next.js HMR/API, and bypass chrome extensions/devtools
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/webpack-hmr') ||
    event.request.url.startsWith('chrome-extension:')
  ) {
    return;
  }

  // Network-First for HTML/Navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Cache the fresh page
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If offline, serve from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // Stale-While-Revalidate for other resources (static assets, JS, CSS, images)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          console.log('[Service Worker] Fetch failed for resource:', url.pathname, err);
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// PWA Widget Support (Microsoft Edge / Windows 11 Widgets Board)
//
// The widget manifest entry declares the widget to the OS; the service worker
// is responsible for feeding it template + data when the host asks for it.
// @see https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/widgets
// ─────────────────────────────────────────────────────────────────────────────

const WIDGET_TEMPLATE_URL = '/widgets/stress-widget.json';
const WIDGET_DATA_URL = '/api/widgets/stress-data';

/** Fetch the Adaptive Card template + live data and push it to the widget. */
async function updateWidget(widget) {
  try {
    const [templateRes, dataRes] = await Promise.all([
      fetch(WIDGET_TEMPLATE_URL),
      fetch(WIDGET_DATA_URL),
    ]);

    if (!templateRes.ok || !dataRes.ok) {
      console.warn('[SW] Widget update: one or more fetches failed');
      return;
    }

    const template = await templateRes.text();
    const data = await dataRes.text();

    // self.widgets is the Edge Widget API — only available in Edge on Windows 11+
    if (self.widgets) {
      await self.widgets.updateByTag(widget.tag, { template, data });
      console.log('[SW] Widget updated:', widget.tag);
    }
  } catch (err) {
    console.error('[SW] Widget update error:', err);
  }
}

// Called when the user pins the widget to the Windows Widgets Board
self.addEventListener('widgetinstall', (event) => {
  console.log('[SW] widgetinstall:', event.widget.tag);
  event.waitUntil(updateWidget(event.widget));
});

// Called when the widget host resumes rendering (e.g. after being suspended)
self.addEventListener('widgetresume', (event) => {
  console.log('[SW] widgetresume:', event.widget.tag);
  event.waitUntil(updateWidget(event.widget));
});

// Called when the user removes the widget from the board
self.addEventListener('widgetuninstall', (event) => {
  console.log('[SW] widgetuninstall:', event.widget.tag);
  // Nothing to tear down for this widget, but we must acknowledge the event
  event.waitUntil(Promise.resolve());
});

// Called when the user clicks a custom action inside the widget card
self.addEventListener('widgetclick', (event) => {
  console.log('[SW] widgetclick:', event.widget.tag, event.action);
  // Action.OpenUrl buttons are handled by the OS natively; this handles
  // any custom Action.Execute buttons added to the Adaptive Card later
  event.waitUntil(Promise.resolve());
});
