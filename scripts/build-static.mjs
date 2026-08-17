/**
 * Turns the site into a folder of static files that any plain host will serve —
 * GitHub Pages, Netlify drop, an S3 bucket, or the company's own hosting.
 *
 * Run it with `npm run build:static`.
 *
 * It does the two things `next build` cannot do for a static target:
 *
 *  1. `.nojekyll` — without it GitHub Pages hides every folder starting with an
 *     underscore, which means all of `_next/`: no CSS, no JavaScript.
 *  2. `index.html` at the root — the locale redirect normally lives in
 *     `proxy.ts`, and Proxy does not exist without a server. This writes a
 *     standalone page that does the same Accept-Language pick in the browser,
 *     with a meta refresh and a plain link behind it so it still works with
 *     JavaScript off.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, existsSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "out");
const BASE = process.env.PAGES_BASE_PATH ?? "";
const PROXY = join(ROOT, "proxy.ts");
const PROXY_PARKED = join(ROOT, "proxy.ts.server-only");

const run = (cmd, args, env) =>
  execFileSync(cmd, args, { stdio: "inherit", env: { ...process.env, ...env } });

// Next refuses to export while a Proxy file is present, so it is moved aside
// for the duration of the build and put straight back afterwards.
let parked = false;
if (existsSync(PROXY)) {
  renameSync(PROXY, PROXY_PARKED);
  parked = true;
  console.log("· proxy.ts parked (not supported by static export)");
}

try {
  rmSync(OUT, { recursive: true, force: true });
  run("npx", ["next", "build"], { NEXT_EXPORT: "1" });
} finally {
  if (parked) {
    renameSync(PROXY_PARKED, PROXY);
    console.log("· proxy.ts restored");
  }
}

writeFileSync(join(OUT, ".nojekyll"), "");

const redirect = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<title>Cihan Tekstil</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${BASE}/tr/">
<link rel="alternate" hreflang="tr" href="${BASE}/tr/">
<link rel="alternate" hreflang="en" href="${BASE}/en/">
<link rel="alternate" hreflang="x-default" href="${BASE}/tr/">
<meta http-equiv="refresh" content="0; url=${BASE}/tr/">
<script>
  // Same choice proxy.ts made on the server: Turkish for Turkish browsers,
  // English for everyone else. Falls through to the meta refresh above.
  try {
    var langs = navigator.languages || [navigator.language || "tr"];
    var tr = langs.some(function (l) { return String(l).toLowerCase().indexOf("tr") === 0; });
    location.replace("${BASE}/" + (tr ? "tr" : "en") + "/");
  } catch (e) {}
</script>
</head>
<body style="font-family:system-ui;padding:2rem">
  <p><a href="${BASE}/tr/">Türkçe</a> · <a href="${BASE}/en/">English</a></p>
</body>
</html>
`;
writeFileSync(join(OUT, "index.html"), redirect);

console.log(`\n✓ static site in out/  (basePath: ${BASE || "none"})`);
console.log("  · .nojekyll written");
console.log("  · index.html written — client-side locale redirect");
