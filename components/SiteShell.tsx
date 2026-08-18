import { Instrument_Serif, Inter, Geist_Mono } from "next/font/google";
import { type Locale } from "@/lib/i18n";
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

/**
 * The document itself — everything from <html> down.
 *
 * Turkish and English are separate root layouts (app/(tr) and app/(en)), so
 * each can carry its own `lang`. Both render this, which keeps the fonts,
 * the skip link and the chrome in one place instead of two.
 */
export default function SiteShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={locale}
      className={`${instrumentSerif.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-paper text-ink">
        {/* Marks that JS is available, so [data-reveal] elements may start
            hidden. Without JS they stay visible and the page still reads.
            First thing in the body, so it runs before any revealed element is
            parsed — the App Router owns <head>, and putting it there trips the
            no-head-element rule. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
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
