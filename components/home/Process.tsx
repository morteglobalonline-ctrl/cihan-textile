import { t, type Locale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export default function Process({ locale }: { locale: Locale }) {
  const d = t(locale);

  return (
    <section className="border-b border-greige py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[110rem] px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p
            data-reveal
            className="font-mono text-[0.68rem] tracking-[0.24em] text-ink-soft uppercase"
          >
            {d.process.eyebrow}
          </p>
          <h2
            data-reveal
            className="mt-6 font-display text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] tracking-[-0.015em]"
          >
            {d.process.heading}
          </h2>
        </Reveal>

        <Reveal
          as="ol"
          className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          stagger={0.09}
        >
          {d.process.steps.map((step, i) => (
            <li key={step.title} data-reveal className="border-t border-ink pt-6">
              <span className="tabular font-mono text-[0.68rem] tracking-widest text-brand">
                {locale === "tr" ? "ADIM" : "STEP"} {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-display text-2xl leading-tight tracking-tight">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {step.body}
              </p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
