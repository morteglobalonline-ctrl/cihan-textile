/**
 * Turns the site into a folder of static files that any plain host will serve —
 * GitHub Pages, Netlify drop, an S3 bucket, or the company's own hosting.
 *
 * Run it with `npm run build:static`.
 *
 * The one thing `next build` cannot do for a static target is write
 * `.nojekyll`: without it GitHub Pages hides every folder starting with an
 * underscore, which means all of `_next/` — no CSS, no JavaScript.
 *
 * There is no root redirect to write any more. Turkish is the site at `/`, so
 * the front door is a real page rather than a bounce through `/tr/`.
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

console.log(`\n✓ static site in ${OUT_DIR}/  (basePath: ${BASE || "none"}, folder/index.html)`);
console.log("  · .nojekyll written");
