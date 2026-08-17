import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import { FABRICS, FAMILIES } from "@/lib/fabrics";
import Reveal from "@/components/Reveal";

/** Count, weight span and width span for one family, straight from the data. */
function summarise(familyId: string) {
  const items = FABRICS.filter((fabric) => fabric.family === familyId);
  const gsms = items.map((i) => i.gsm).filter((g): g is number => g !== null);
  const widths = items.flatMap((i) => (i.width ? i.width : []));

  return {
    gsm: gsms.length ? ([Math.min(...gsms), Math.max(...gsms)] as const) : null,
    width: widths.length
      ? ([Math.min(...widths), Math.max(...widths)] as const)
      : null,
  };
}

const span = (range: readonly [number, number]) =>
  range[0] === range[1] ? `${range[0]}` : `${range[0]}–${range[1]}`;

export default function Families({ locale }: { locale: Locale }) {
  const d = t(locale);

  return (
    <section className="border-b border-greige py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[110rem] px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p
            data-reveal
            className="font-mono text-[0.68rem] tracking-[0.24em] text-ink-soft uppercase"
          >
            {d.families.eyebrow}
          </p>
          <h2
            data-reveal
            className="mt-6 font-display text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] tracking-[-0.015em]"
          >
            {d.families.heading}
          </h2>
          <p
            data-reveal
            className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            {d.families.lead}
          </p>
        </Reveal>

        <Reveal as="ul" className="mt-14 border-t border-greige" stagger={0.05}>
          {FAMILIES.map((family, i) => {
            const stats = summarise(family.id);
            return (
              <li key={family.id} data-reveal className="border-b border-greige">
                <Link
                  href={`/${locale}/catalog?family=${family.id}`}
                  className="group grid gap-4 py-7 transition-colors duration-400 hover:bg-ecru lg:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1.6fr)_11rem] lg:items-baseline lg:gap-8 lg:px-4"
                >
                  <span className="tabular font-mono text-[0.68rem] text-loom">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="font-display text-3xl leading-none tracking-tight transition-colors duration-300 group-hover:text-brand sm:text-4xl">
                    {locale === "tr" ? family.tr : family.en}
                  </h3>

                  <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
                    {locale === "tr" ? family.blurbTr : family.blurbEn}
                  </p>

                  {/* Fixed three-column grid, not a flex row: the stat widths
                      vary per family, and letting them size to content pushed
                      the description column to a different x on every row. */}
                  {/* No quality count: the range grows week to week, and a
                      printed number would date the page. Spec spans only. */}
                  <dl className="tabular grid grid-cols-2 gap-4 font-mono text-[0.68rem] tracking-wide uppercase">
                    <div className="text-left lg:text-right">
                      <dt className="sr-only">
                        {locale === "tr" ? "Gramaj" : "Weight"}
                      </dt>
                      <dd className="text-ink">
                        {stats.gsm ? span(stats.gsm) : "—"}
                      </dd>
                      <dd className="mt-1 text-loom">g/m²</dd>
                    </div>
                    <div className="text-left lg:text-right">
                      <dt className="sr-only">
                        {locale === "tr" ? "En" : "Width"}
                      </dt>
                      <dd className="text-ink">
                        {stats.width ? span(stats.width) : "—"}
                      </dd>
                      <dd className="mt-1 text-loom">cm</dd>
                    </div>
                  </dl>
                </Link>
              </li>
            );
          })}
        </Reveal>

        <div className="mt-12">
          <Link
            href={`/${locale}/catalog`}
            className="group inline-flex items-center gap-3 border border-ink px-7 py-4 font-mono text-[0.7rem] tracking-widest uppercase transition-colors duration-300 hover:bg-ink hover:text-paper"
          >
            {d.families.cta}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
