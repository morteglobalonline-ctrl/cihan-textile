"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { t, type Locale } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import Reveal from "@/components/Reveal";

/**
 * What we sell, and what our customers make from it.
 *
 * Both photographs are the same swirl composition, so the wipe reads as one
 * cloth changing state rather than two unrelated pictures.
 *
 * The handle is a real <input type="range">: pointer, touch and keyboard all
 * work, and screen readers announce it correctly, with no custom drag code.
 */
export default function Compare({ locale }: { locale: Locale }) {
  const d = t(locale);
  const [pos, setPos] = useState(50);
  const id = useId();

  return (
    <section className="border-b border-greige py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[110rem] px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p
            data-reveal
            className="font-mono text-[0.68rem] tracking-[0.24em] text-ink-soft uppercase"
          >
            {d.compare.eyebrow}
          </p>
          <h2
            data-reveal
            className="mt-6 font-display text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] tracking-[-0.015em]"
          >
            {d.compare.heading}
          </h2>
          <p
            data-reveal
            className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            {d.compare.lead}
          </p>
        </Reveal>

        <div className="relative mt-14 select-none">
          <div className="relative aspect-4/3 overflow-hidden bg-ecru sm:aspect-16/9">
            {/* Printed — the result, underneath */}
            <Image
              src={asset("/fabrics/print-tropical-swirl.jpg")}
              alt={
                locale === "tr"
                  ? "Aynı krep kumaşın dijital baskı sonrası hâli"
                  : "The same crepe after digital printing"
              }
              fill
              sizes="(min-width: 1024px) 90vw, 100vw"
              className="object-cover"
            />

            {/* Greige — what we ship, clipped by the handle */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <Image
                src={asset("/fabrics/white-crepe-swirl.jpg")}
                alt={
                  locale === "tr"
                    ? "Boyanmamış, basılmamış ham krep kumaş"
                    : "Undyed, unprinted greige crepe"
                }
                fill
                sizes="(min-width: 1024px) 90vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Seam */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-px bg-paper mix-blend-difference"
              style={{ left: `${pos}%` }}
            />

            {/* Labels */}
            <p className="absolute top-4 left-4 bg-paper/92 px-3 py-1.5 font-mono text-[0.62rem] tracking-[0.18em] text-ink uppercase sm:top-6 sm:left-6">
              {d.compare.greigeLabel}
            </p>
            <p className="absolute top-4 right-4 bg-ink/85 px-3 py-1.5 font-mono text-[0.62rem] tracking-[0.18em] text-paper uppercase sm:top-6 sm:right-6">
              {d.compare.printedLabel}
            </p>

            {/* Handle. Opacity-0 range sits over the whole frame so the image
                itself is draggable; the visible knob is drawn beneath it. */}
            <label htmlFor={id} className="sr-only">
              {d.compare.slider}
            </label>
            <input
              id={id}
              type="range"
              min={0}
              max={100}
              // step=1, not a fraction: a keyboard user crosses the frame in
              // 100 presses instead of 1000, and 1% is imperceptible on drag.
              step={1}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-valuetext={`${Math.round(pos)}%`}
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper shadow-[0_2px_16px_rgba(26,24,20,0.28)]"
              style={{ left: `${pos}%` }}
            >
              <span className="font-mono text-xs text-ink">↔</span>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {d.compare.note}
          </p>
        </div>
      </div>
    </section>
  );
}
