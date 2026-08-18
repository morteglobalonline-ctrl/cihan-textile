import type { Locale } from "@/lib/i18n";

/**
 * Every URL on the site, in one place.
 *
 * Turkish sits at the root with Turkish paths, because the company trades in
 * Türkiye and this is its own domain; English is a section under /en with
 * English paths. There is no /tr — the old site had no locale in its URLs
 * either, and a redirect on the front door would only slow the common case.
 *
 * Build links with `route()` rather than by hand. The path a visitor sees and
 * the folder the page is exported to have to agree exactly: Next writes the
 * clean URL into the client router, so a hand-made link that disagrees will
 * click through fine and then 404 on reload.
 */
export const ROUTES = {
  tr: {
    home: "/",
    catalog: "/kumaslar",
    about: "/kurumsal",
    contact: "/iletisim",
  },
  en: {
    home: "/en",
    catalog: "/en/catalog",
    about: "/en/about",
    contact: "/en/contact",
  },
} as const;

export type PageKey = keyof (typeof ROUTES)["tr"];

export function route(locale: Locale, page: PageKey): string {
  return ROUTES[locale][page];
}

/** Which page a pathname is, so the header can mark it and swap languages. */
export function pageOf(pathname: string): PageKey {
  const path = pathname.replace(/\/+$/, "") || "/";
  for (const locale of ["tr", "en"] as const) {
    for (const [key, value] of Object.entries(ROUTES[locale])) {
      if (value === path) return key as PageKey;
    }
  }
  return "home";
}

/** The same page in the other language. */
export function swapLocale(pathname: string, next: Locale): string {
  return route(next, pageOf(pathname));
}
