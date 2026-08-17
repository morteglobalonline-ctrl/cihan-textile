import Image from "next/image";
import Link from "next/link";
import { COMPANY, t, type Locale } from "@/lib/i18n";
import { FAMILIES } from "@/lib/fabrics";
import { asset } from "@/lib/asset";

export default function Footer({ locale }: { locale: Locale }) {
  const d = t(locale);
  const year = 2026;

  return (
    <footer className="border-t border-greige bg-ecru">
      <div className="mx-auto max-w-[110rem] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src={asset("/logo.png")}
              alt={COMPANY.legalTr}
              width={377}
              height={80}
              className="h-8 w-auto"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-soft">
              {d.footer.tagline}
            </p>
          </div>

          <div>
            <h2 className="font-mono text-[0.65rem] tracking-[0.2em] text-ink-soft uppercase">
              {d.footer.products}
            </h2>
            <ul className="mt-5 space-y-2.5">
              {FAMILIES.map((family) => (
                <li key={family.id}>
                  <Link
                    href={`/${locale}/catalog?family=${family.id}`}
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {locale === "tr" ? family.tr : family.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-[0.65rem] tracking-[0.2em] text-ink-soft uppercase">
              {d.footer.company}
            </h2>
            <ul className="mt-5 space-y-2.5">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {d.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/catalog`}
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {d.nav.catalog}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {d.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-[0.65rem] tracking-[0.2em] text-ink-soft uppercase">
              {d.nav.contact}
            </h2>
            <address className="mt-5 space-y-1 text-sm leading-relaxed text-ink-soft not-italic">
              <p>{COMPANY.address.line1}</p>
              <p>{COMPANY.address.line2}</p>
              <p>{COMPANY.address.city}</p>
            </address>
            <div className="mt-5 space-y-1.5 text-sm">
              <p>
                <a
                  href={`tel:${COMPANY.phoneHref}`}
                  className="tabular font-mono text-ink-soft transition-colors hover:text-ink"
                >
                  {COMPANY.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-ink-soft transition-colors hover:text-ink"
                >
                  {COMPANY.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-greige pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.65rem] tracking-widest text-ink-soft uppercase">
            © {year} {COMPANY.legalFull} {d.footer.rights}
          </p>
          <p className="tabular font-mono text-[0.65rem] tracking-widest text-ink-soft uppercase">
            {COMPANY.incorporated} — {COMPANY.address.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
