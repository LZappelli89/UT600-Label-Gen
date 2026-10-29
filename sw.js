/* UT600 Label Rescan: offline copy. Created by Leigh Zappelli. © 2026 Leigh Zappelli.
   Keeps the app on the phone so it opens and scans with weak or no signal.
   - The app page: fetched fresh when there's signal (so updates still arrive), and the saved
     copy is used if the network is slow (over 4 seconds) or there's no signal.
   - The voice engine (vosk.js from the CDN): saved the first time voice is used.
   - The voice model is saved by the app itself, not here. */
const APP_CACHE = "lr-app-v37";
const CORE = ["./", "./index.html"];
const VOSK = "https://cdn.jsdelivr.net/npm/vosk-browser@0.0.8/dist/vosk.js";
const VOICE_CACHE = "lr-voice-engine-v1";     // kept across app updates

self.addEventListener("install", e => {
  e.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(CORE.map(u => new Request(u, {cache: "reload"})))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("lr-app-") && k !== APP_CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function timeout(ms){ return new Promise((_, rej) => setTimeout(() => rej(new Error("slow")), ms)); }

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // The app page itself: network first (with a time limit), saved copy as the fallback
  if (req.mode === "navigate" || (url.origin === location.origin && /\/(index\.html)?$/.test(url.pathname))){
    e.respondWith((async () => {
      const cache = await caches.open(APP_CACHE);
      const net = fetch(req, {cache: "no-store"}).then(res => {
        if (res && res.ok) cache.put("./index.html", res.clone()).catch(() => {});
        return res;
      });
      try{ return await Promise.race([net, timeout(4000)]); }
      catch(err){
        const saved = await cache.match("./index.html") || await cache.match("./");
        if (saved){ net.catch(() => {}); return saved; }
        return net;      // nothing saved yet: keep waiting for the network
      }
    })());
    return;
  }

  // The voice engine: saved copy first, otherwise download and save it
  if (req.url === VOSK){
    e.respondWith(caches.open(VOICE_CACHE).then(async cache => {
      const saved = await cache.match(VOSK);
      if (saved) return saved;
      const res = await fetch(req);
      if (res && (res.ok || res.type === "opaque")) cache.put(VOSK, res.clone()).catch(() => {});
      return res;
    }));
  }
  // everything else (voice model parts etc.) goes straight to the network
});
