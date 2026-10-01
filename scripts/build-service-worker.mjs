import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Precache the actual exported shell and its hashed chunks, including assets
// needed before the first service worker controls the page. No runtime server.
async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  }));
  return groups.flat();
}

const files = (await filesIn("out")).filter((path) => !path.endsWith("/sw.js")).sort();
const hash = createHash("sha256");
for (const path of files) { hash.update(path); hash.update(await readFile(path)); }
const version = hash.digest("hex").slice(0, 16);
const urls = ["/", ...files.map((path) => "/" + path.slice(4).split("/").map(encodeURIComponent).join("/"))];
const worker = `// Generated from the static export. Never touches localStorage or game saves.
const CACHE = "buried-sun-shell-${version}";
const SHELL = ${JSON.stringify(urls)};
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  // Wait for old clients to close before activating a new shell.
});
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith("buried-sun-shell-") && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(event.request);
    if (cached) return cached;
    try { return await fetch(event.request); }
    catch (error) {
      if (event.request.mode === "navigate") return await cache.match("/");
      throw error;
    }
  })());
});
`;
await writeFile("out/sw.js", worker);
console.log(`Offline shell generated: ${urls.length} URLs (${version}).`);
