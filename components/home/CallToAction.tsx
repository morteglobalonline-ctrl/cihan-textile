import { COMPANY, t, type Locale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export default function CallToAction({ locale }: { locale: Locale }) {
  const d = t(locale);
  const wa = `https://wa.me/${COMPANY.whatsappHref}?text=${encodeURIComponent(
    d.contact.whatsappMessage,
  )}`;

  return (
    <section className="bg-ink py-20 text-paper sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[110rem] px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <h2
            data-reveal
            className="font-display text-[clamp(2.25rem,6vw,5rem)] leading-[1.02] tracking-[-0.015em]"
          >
            {d.cta.heading}
          </h2>
          <p
            data-reveal
            className="mt-6 max-w-xl text-base leading-relaxed text-paper/70 sm:text-lg"
          >
            {d.cta.body}
          </p>
          <div data-reveal className="mt-10 flex flex-wrap gap-4">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-paper px-7 py-4 font-mono text-[0.7rem] tracking-widest text-ink uppercase transition-colors duration-300 hover:bg-brand hover:text-paper"
            >
              {d.cta.button}
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href={`mailto:${COMPANY.email}`}
              className="inline-flex items-center gap-3 border border-paper/35 px-7 py-4 font-mono text-[0.7rem] tracking-widest uppercase transition-colors duration-300 hover:border-paper"
            >
              {d.cta.secondary}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
