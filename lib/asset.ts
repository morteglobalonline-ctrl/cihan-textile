/**
 * Prefixes a path in `public/` with the base path the site is mounted at.
 *
 * Needed because root-relative URLs are NOT rewritten for us. Under a base path
 * (a GitHub Pages project repo serves from `/<repo-name>/`) a bare
 * `/video/intro.mp4` resolves against the domain root and 404s — and that is
 * true of `next/image` too once `images.unoptimized` is on, as it is for the
 * static export. Every reference to a file in `public/` must go through here.
 *
 * `NEXT_PUBLIC_BASE_PATH` is injected by next.config.ts from the same value it
 * gives `basePath`, so the two can never drift apart.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
