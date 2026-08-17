import { t, type Locale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export default function Value({ locale }: { locale: Locale }) {
  const d = t(locale);

  return (
    <section className="border-b border-greige bg-ecru py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[110rem] px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p
            data-reveal
            className="font-mono text-[0.68rem] tracking-[0.24em] text-ink-soft uppercase"
          >
            {d.value.eyebrow}
          </p>
          <h2
            data-reveal
            className="mt-6 font-display text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] tracking-[-0.015em]"
          >
            {d.value.heading}
          </h2>
        </Reveal>

        <Reveal
          as="ul"
          className="mt-14 grid gap-px bg-greige md:grid-cols-2"
          stagger={0.08}
        >
          {d.value.items.map((item, i) => (
            <li key={item.title} data-reveal className="bg-ecru p-8 sm:p-11">
              <span className="tabular font-mono text-[0.68rem] text-loom">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display text-2xl leading-tight tracking-tight sm:text-3xl">
                {item.title}
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
                {item.body}
              </p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
