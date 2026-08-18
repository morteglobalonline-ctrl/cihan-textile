import { Suspense } from "react";
import { t, type Locale } from "@/lib/i18n";
import FabricTable from "@/components/FabricTable";

export default function Catalog({ locale }: { locale: Locale }) {
  const d = t(locale);

  return (
    <div className="mx-auto max-w-[110rem] px-5 pt-28 pb-24 sm:px-8 sm:pt-36">
      <header className="max-w-3xl">
        <p className="font-mono text-[0.68rem] tracking-[0.24em] text-ink-soft uppercase">
          {d.catalog.eyebrow}
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[1] tracking-[-0.02em]">
          {d.catalog.heading}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg">
          {d.catalog.lead}
        </p>
      </header>

      <div className="mt-14">
        <Suspense
          fallback={
            <p className="py-20 text-center font-mono text-sm text-ink-soft">
              …
            </p>
          }
        >
          <FabricTable locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
