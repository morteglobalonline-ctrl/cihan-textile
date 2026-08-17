import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Instrument_Serif, Inter, Geist_Mono } from "next/font/google";
import "../globals.css";
import { LOCALES, isLocale, t, COMPANY } from "@/lib/i18n";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* Display — editorial, high contrast. Carries the material and the drape. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

/* Body — neutral connective tissue. latin-ext covers Turkish diacritics. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

/* Specs — tabular figures, the precision counterpoint to the serif. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = t(locale);

  return {
    metadataBase: new URL("https://www.cihantextile.com"),
    title: { default: d.meta.title, template: `%s — ${COMPANY.name}` },
    description: d.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { tr: "/tr", en: "/en", "x-default": "/tr" },
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

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${instrumentSerif.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks that JS is available, so [data-reveal] elements may start
            hidden. Without JS they stay visible and the page still reads. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="min-h-full bg-paper text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          {locale === "tr" ? "İçeriğe geç" : "Skip to content"}
        </a>
        <SmoothScroll />
        <Header locale={locale} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
