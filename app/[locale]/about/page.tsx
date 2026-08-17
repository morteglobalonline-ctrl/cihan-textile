import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, t, COMPANY } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import Reveal from "@/components/Reveal";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = t(locale);
  return { title: d.about.heading, description: d.about.lead };
}

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);

  return (
    <>
      <div className="mx-auto max-w-[110rem] px-5 pt-28 pb-20 sm:px-8 sm:pt-36">
        <header className="max-w-3xl">
          <p className="font-mono text-[0.68rem] tracking-[0.24em] text-ink-soft uppercase">
            {d.about.eyebrow}
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[1] tracking-[-0.02em]">
            {d.about.heading}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg">
            {d.about.lead}
          </p>
        </header>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <Reveal className="max-w-2xl">
            {d.about.body.map((paragraph, i) => (
              <p
                key={i}
                data-reveal
                className="mt-6 text-base leading-relaxed text-ink-soft first:mt-0 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>

          <div className="relative aspect-3/4 overflow-hidden bg-ecru">
            <Image
              src={asset("/fabrics/white-gauze-branch.jpg")}
              alt={
                locale === "tr"
                  ? "Ahşap bir dal üzerine serilmiş ham beyaz krep kumaş"
                  : "Greige white crepe draped over a wooden branch"
              }
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <section className="border-y border-greige bg-ecru py-20 sm:py-28">
        <div className="mx-auto max-w-[110rem] px-5 sm:px-8">
          <Reveal
            as="ol"
            className="grid gap-10 md:grid-cols-3 md:gap-8"
            stagger={0.1}
          >
            {d.about.timeline.map((entry) => (
              <li
                key={entry.year}
                data-reveal
                className="border-t border-ink pt-6"
              >
                <p className="tabular font-display text-4xl leading-none tracking-tight sm:text-5xl">
                  {entry.year}
                </p>
                <h2 className="mt-5 font-mono text-[0.68rem] tracking-[0.2em] text-brand uppercase">
                  {entry.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {entry.body}
                </p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Registry detail — small, factual, the kind of thing an export buyer
          checks before placing a first order. */}
      <div className="mx-auto max-w-[110rem] px-5 py-14 sm:px-8">
        <dl className="tabular flex flex-wrap gap-x-12 gap-y-4 font-mono text-[0.65rem] tracking-[0.18em] text-ink-soft uppercase">
          <div>
            <dt className="text-loom">
              {locale === "tr" ? "Kuruluş" : "Founded"}
            </dt>
            <dd className="mt-1.5 text-ink">{COMPANY.incorporated}</dd>
          </div>
          <div>
            <dt className="text-loom">
              {locale === "tr" ? "Ünvan" : "Registered name"}
            </dt>
            <dd className="mt-1.5 text-ink normal-case">{COMPANY.legalFull}</dd>
          </div>
          <div>
            <dt className="text-loom">
              {locale === "tr" ? "Merkez" : "Head office"}
            </dt>
            <dd className="mt-1.5 text-ink">{COMPANY.address.city}</dd>
          </div>
        </dl>
      </div>
    </>
  );
}
