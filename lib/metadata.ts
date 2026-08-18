import type { Metadata } from "next";
import { t, COMPANY, type Locale } from "@/lib/i18n";
import { ROUTES, route, type PageKey } from "@/lib/routes";

const SITE = "https://www.cihantextile.com";

/**
 * Metadata for one page in one language.
 *
 * `alternates.languages` is what tells a search engine the two languages are
 * the same site rather than duplicates — the old site served both from one URL,
 * so only one of them could ever be indexed.
 */
export function pageMetadata(locale: Locale, page: PageKey): Metadata {
  const d = t(locale);
  const titles: Record<PageKey, string | undefined> = {
    home: undefined, // the layout's default title stands
    catalog: d.catalog.heading,
    about: d.about.heading,
    contact: d.contact.heading,
  };
  const descriptions: Record<PageKey, string> = {
    home: d.meta.description,
    catalog: d.catalog.lead,
    about: d.about.lead,
    contact: d.contact.lead,
  };

  return {
    ...(titles[page] ? { title: titles[page] } : {}),
    description: descriptions[page],
    alternates: {
      canonical: route(locale, page),
      languages: {
        tr: ROUTES.tr[page],
        en: ROUTES.en[page],
        "x-default": ROUTES.tr[page],
      },
    },
  };
}

/** The parts that belong on the document, set once per root layout. */
export function rootMetadata(locale: Locale): Metadata {
  const d = t(locale);
  return {
    metadataBase: new URL(SITE),
    title: { default: d.meta.title, template: `%s — ${COMPANY.name}` },
    description: d.meta.description,
    alternates: {
      canonical: route(locale, "home"),
      languages: { tr: ROUTES.tr.home, en: ROUTES.en.home, "x-default": ROUTES.tr.home },
    },
    openGraph: {
      type: "website",
      siteName: COMPANY.name,
      title: d.meta.title,
      description: d.meta.description,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      images: [{ url: "/fabrics/white-satin-swirl.jpg", width: 1600, height: 1066 }],
    },
  };
}
