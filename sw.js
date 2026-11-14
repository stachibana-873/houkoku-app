/* 電波がない現場でもアプリを開けるようにするための仕組み（Service Worker）。
   アプリ本体と部品を端末に取っておき、つながらないときはそれを使う。
   アプリを更新したら VERSION を変える */
const VERSION = "houkoku-v7";
const CORE = ["./", "index.html", "manual.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png",
  "vendor/exceljs.min.js", "vendor/pdf.min.js", "vendor/pdf.worker.min.js"];
self.addEventListener("install", e=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e=>{
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  /* アプリのページ：つながるときは最新を取り、つながらないときは取っておいたものを出す */
  if (req.mode === "navigate"){
    e.respondWith(fetch(req).then(r=>{ const c = r.clone(); caches.open(VERSION).then(x=>x.put(req, c)); return r; })
      .catch(()=>caches.match(req, {ignoreSearch:true}).then(r=>r || caches.match("index.html"))));
    return;
  }
  /* 部品・アイコン・文字のデザイン（Googleフォント）：取っておいたものをすぐ使い、裏で新しくする */
  if (url.origin === location.origin || url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com")){
    e.respondWith(caches.open(VERSION).then(async c=>{
      const hit = await c.match(req, {ignoreSearch:true});
      const net = fetch(req).then(r=>{ if (r.ok || r.type==="opaque") c.put(req, r.clone()); return r; }).catch(()=>hit);
      return hit || net;
    }));
  }
});
