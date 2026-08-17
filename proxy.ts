import { NextResponse, type NextRequest } from "next/server";
import { LOCALES } from "@/lib/i18n";

const DEFAULT_LOCALE = "tr";

/**
 * Picks a locale from Accept-Language. Turkish visitors land on Turkish,
 * everyone else on English — the site's two audiences are the domestic
 * wholesale market and export customers abroad.
 */
function pickLocale(header: string | null): string {
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .filter((entry) => entry.tag && !Number.isNaN(entry.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if ((LOCALES as readonly string[]).includes(base)) return base;
  }
  return "en";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = pickLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals and anything with a file extension (images, video,
  // favicon, robots.txt) so static assets are never rewritten.
  matcher: ["/((?!_next|.*\\..*).*)"],
};
