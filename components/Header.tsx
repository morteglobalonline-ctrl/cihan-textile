"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { COMPANY, LOCALES, t, type Locale } from "@/lib/i18n";
import { asset } from "@/lib/asset";

export default function Header({ locale }: { locale: Locale }) {
  const d = t(locale);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trap the page behind the open sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: `/${locale}/catalog`, label: d.nav.catalog },
    { href: `/${locale}/about`, label: d.nav.about },
    { href: `/${locale}/contact`, label: d.nav.contact },
  ];

  /** Same page, other language. */
  const swapLocale = (next: Locale) => {
    const rest = pathname.replace(/^\/(tr|en)/, "");
    return `/${next}${rest}`;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? "border-b border-greige bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[110rem] items-center justify-between gap-6 px-5 sm:h-20 sm:px-8">
        <Link href={`/${locale}`} aria-label={COMPANY.name} className="shrink-0">
          <Image
            src={asset("/logo.png")}
            alt={COMPANY.legalTr}
            width={377}
            height={80}
            priority
            className="h-7 w-auto sm:h-8"
          />
        </Link>

        <nav
          className="hidden items-center gap-9 md:flex"
          aria-label={locale === "tr" ? "Ana menü" : "Main"}
        >
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 text-sm transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-400 after:ease-drape hover:after:scale-x-100 ${
                  active
                    ? "text-ink after:scale-x-100"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <div
            className="flex items-center gap-1 font-mono text-[0.7rem] tracking-widest uppercase"
            role="group"
            aria-label={d.nav.langLabel}
          >
            {LOCALES.map((code, i) => (
              <span key={code} className="flex items-center gap-1">
                {i > 0 && <span className="text-loom">/</span>}
                <Link
                  href={swapLocale(code)}
                  hrefLang={code}
                  aria-current={code === locale ? "true" : undefined}
                  className={
                    code === locale
                      ? "text-ink"
                      : "text-ink-soft transition-colors hover:text-ink"
                  }
                >
                  {code}
                </Link>
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-10 w-10 items-center justify-center md:hidden"
          >
            <span className="sr-only">{open ? d.nav.close : d.nav.menu}</span>
            <span aria-hidden className="relative block h-3 w-6">
              <span
                className={`absolute inset-x-0 top-0 h-px bg-ink transition-transform duration-300 ${
                  open ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-px bg-ink transition-transform duration-300 ${
                  open ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-greige bg-paper md:hidden"
      >
        <nav className="flex flex-col px-5 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-greige py-4 font-display text-2xl last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
