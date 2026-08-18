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
const BASE = process.env.PAGES_BASE_PATH ?? "";
const OUT_DIR = process.env.OUT_DIR || "out";
const OUT = join(ROOT, OUT_DIR);
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
  if (OUT_DIR !== "out") {
    rmSync(OUT, { recursive: true, force: true });
    renameSync(join(ROOT, "out"), OUT);
  }
} finally {
  if (parked) {
    renameSync(PROXY_PARKED, PROXY);
    console.log("· proxy.ts restored");
  }
}

writeFileSync(join(OUT, ".nojekyll"), "");

const TR = `${BASE}/tr/`;
const EN = `${BASE}/en/`;

const redirect = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<title>Cihan Tekstil</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${TR}">
<link rel="alternate" hreflang="tr" href="${TR}">
<link rel="alternate" hreflang="en" href="${EN}">
<link rel="alternate" hreflang="x-default" href="${TR}">
<meta http-equiv="refresh" content="0; url=${TR}">
<script>
  // Same choice proxy.ts made on the server: Turkish for Turkish browsers,
  // English for everyone else. Falls through to the meta refresh above.
  try {
    var langs = navigator.languages || [navigator.language || "tr"];
    var tr = langs.some(function (l) { return String(l).toLowerCase().indexOf("tr") === 0; });
    location.replace(tr ? "${TR}" : "${EN}");
  } catch (e) {}
</script>
</head>
<body style="font-family:system-ui;padding:2rem">
  <p><a href="${TR}">Türkçe</a> · <a href="${EN}">English</a></p>
</body>
</html>
`;
writeFileSync(join(OUT, "index.html"), redirect);

console.log(`\n✓ static site in ${OUT_DIR}/  (basePath: ${BASE || "none"}, folder/index.html)`);
console.log("  · .nojekyll written");
console.log("  · index.html written — client-side locale redirect");
