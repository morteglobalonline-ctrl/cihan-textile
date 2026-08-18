import type { NextConfig } from "next";

/**
 * Two build shapes from one config.
 *
 * The normal build runs on a Node server and keeps `proxy.ts` (the
 * Accept-Language redirect) plus Next's image optimizer.
 *
 * `NEXT_EXPORT=1` produces a folder of static files for GitHub Pages, where
 * neither of those exists — see `scripts/build-static.mjs`, which also writes
 * the root redirect that `proxy.ts` would otherwise have handled.
 *
 * `PAGES_BASE_PATH` is for project pages served from a subfolder
 * (`/cihan-textile`). Leave it unset once the site sits on its own domain.
 */
const isExport = process.env.NEXT_EXPORT === "1";
// GitHub's configure-pages action reports "/" for user/org sites and
// "/repo-name" for project sites; "/" must be treated as no prefix.
const raw = process.env.PAGES_BASE_PATH ?? "";
const basePath = raw === "/" ? "" : raw;

const nextConfig: NextConfig = {
  // Handed to the browser so lib/asset.ts can prefix files in public/. Those
  // URLs are not rewritten automatically, so without this every image and
  // video 404s when the site is mounted under a subfolder.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(isExport
    ? {
        output: "export",
        // Directory URLs: /tr/ resolves to /tr/index.html on every web server
        // without configuration. A flat tr.html / tr/about.html layout was
        // tried and abandoned — see DEPLOY.md for why it cannot work here.
        trailingSlash: true,
        // There is no optimizer on Pages; the originals are served as-is.
        images: { unoptimized: true },
      }
    : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
