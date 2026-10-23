const SHELL_CACHE = "zkb-shell-v22";
const MEDIA_CACHE = "zkb-media-v43";

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/parasha-order.js",
  "./js/share-sheet.js",
  "./js/progress.js",
  "./js/push.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./en/index.html",
  "./en/js/app.js",
  "./en/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== SHELL_CACHE && key !== MEDIA_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;

  const isMedia = url.pathname.includes("/assets/images/") || url.pathname.includes("/assets/audio/");

  if (isMedia) {
    // Cache-first for images/audio, so once an episode is played/viewed it works offline.
    event.respondWith(
      caches.open(MEDIA_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
          const response = await fetch(event.request);
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        } catch (err) {
          return cached || Response.error();
        }
      })
    );
    return;
  }

  // Network-first for the app shell, falling back to cache when offline.
  // {cache:"reload"} forces the browser's own HTTP cache to be bypassed too
  // (not just the SW's Cache Storage) - otherwise "network-first" can still
  // silently resolve from a stale disk-cached response on some deploys.
  event.respondWith(
    fetch(event.request, { cache: "reload" })
      .then((response) => {
        const copy = response.clone();
        caches.open(SHELL_CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((res) => res || caches.match("./index.html")))
  );
});

/* ---------------------------------------------------------------
   "סיפור חדש עלה" (אברהם, 2026-10-23): the notification sent by רוני המתכנת/Tools/push/send_push.py.
   payload: { title, body, url, image, lang, tag } - a tap opens the site at that episode (#ep-<slug>).
--------------------------------------------------------------- */
self.addEventListener("push", (event) => {
  let d = {};
  try {
    d = event.data ? event.data.json() : {};
  } catch (e) {
    d = { body: event.data ? event.data.text() : "" };
  }
  const en = d.lang === "en";
  const title = d.title || (en ? "It Really Happened" : "זה קרה באמת");
  const options = {
    body: d.body || "",
    icon: new URL("icons/icon-192.png", self.registration.scope).href,
    badge: new URL("icons/favicon-32.png", self.registration.scope).href,
    data: { url: new URL(d.url || (en ? "en/index.html" : "index.html"), self.registration.scope).href },
    dir: en ? "ltr" : "rtl",
    lang: en ? "en" : "he",
    tag: d.tag || "zkb-new",
    renotify: true,
  };
  if (d.image) options.image = new URL(d.image, self.registration.scope).href;
  event.waitUntil(Promise.all([
    self.registration.showNotification(title, options),
    // open pages hear about it too (used by the automatic check of this feature)
    self.clients.matchAll({ includeUncontrolled: true }).then((list) => list.forEach((c) => c.postMessage({ type: "zkb-push", title, body: options.body }))),
  ]));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || self.registration.scope;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.split("#")[0] === url.split("#")[0] && "focus" in c) {
          if ("navigate" in c) c.navigate(url);
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
