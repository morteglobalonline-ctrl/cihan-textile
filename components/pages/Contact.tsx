import { t, COMPANY, type Locale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export default function Contact({ locale }: { locale: Locale }) {
  const d = t(locale);

  const wa = `https://wa.me/${COMPANY.whatsappHref}?text=${encodeURIComponent(
    d.contact.whatsappMessage,
  )}`;

  const mapQuery = encodeURIComponent(
    `${COMPANY.address.line1} ${COMPANY.address.line2} ${COMPANY.address.city}`,
  );

  return (
    <div className="mx-auto max-w-[110rem] px-5 pt-28 pb-24 sm:px-8 sm:pt-36">
      <header className="max-w-3xl">
        <p className="font-mono text-[0.68rem] tracking-[0.24em] text-ink-soft uppercase">
          {d.contact.eyebrow}
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[1] tracking-[-0.02em]">
          {d.contact.heading}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg">
          {d.contact.lead}
        </p>
      </header>

      <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal stagger={0.06}>
          <dl className="divide-y divide-greige border-y border-greige">
            <div data-reveal className="grid gap-1 py-6 sm:grid-cols-[11rem_1fr]">
              <dt className="font-mono text-[0.65rem] tracking-[0.18em] text-ink-soft uppercase">
                {d.contact.addressLabel}
              </dt>
              <dd className="text-base leading-relaxed">
                {COMPANY.address.line1}
                <br />
                {COMPANY.address.line2}
                <br />
                {COMPANY.address.city}
              </dd>
            </div>

            <div data-reveal className="grid gap-1 py-6 sm:grid-cols-[11rem_1fr]">
              <dt className="font-mono text-[0.65rem] tracking-[0.18em] text-ink-soft uppercase">
                {d.contact.phoneLabel}
              </dt>
              <dd className="tabular font-mono text-base">
                <a
                  href={`tel:${COMPANY.phoneHref}`}
                  className="transition-colors hover:text-brand"
                >
                  {COMPANY.phone}
                </a>
              </dd>
            </div>

            <div data-reveal className="grid gap-1 py-6 sm:grid-cols-[11rem_1fr]">
              <dt className="font-mono text-[0.65rem] tracking-[0.18em] text-ink-soft uppercase">
                {d.contact.faxLabel}
              </dt>
              <dd className="tabular font-mono text-base text-ink-soft">
                {COMPANY.fax}
              </dd>
            </div>

            <div data-reveal className="grid gap-1 py-6 sm:grid-cols-[11rem_1fr]">
              <dt className="font-mono text-[0.65rem] tracking-[0.18em] text-ink-soft uppercase">
                {d.contact.emailLabel}
              </dt>
              <dd className="text-base">
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="transition-colors hover:text-brand"
                >
                  {COMPANY.email}
                </a>
              </dd>
            </div>

            <div data-reveal className="grid gap-1 py-6 sm:grid-cols-[11rem_1fr]">
              <dt className="font-mono text-[0.65rem] tracking-[0.18em] text-ink-soft uppercase">
                {d.contact.hours}
              </dt>
              <dd className="text-base text-ink-soft">{d.contact.hoursValue}</dd>
            </div>
          </dl>

          <a
            data-reveal
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-3 bg-ink px-7 py-4 font-mono text-[0.7rem] tracking-widest text-paper uppercase transition-colors duration-300 hover:bg-brand"
          >
            {d.contact.whatsappCta}
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </Reveal>

        <div>
          <div className="relative aspect-4/3 overflow-hidden border border-greige bg-ecru">
            <iframe
              title={
                locale === "tr"
                  ? "Cihan Textile konumu — Buttim, Bursa"
                  : "Cihan Textile location — Buttim, Bursa"
              }
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full grayscale"
            />
          </div>
          <p className="mt-4 font-mono text-[0.62rem] tracking-[0.18em] text-ink-soft uppercase">
            Buttim İş Merkezi — {COMPANY.address.city}
          </p>
        </div>
      </div>
    </div>
  );
}
