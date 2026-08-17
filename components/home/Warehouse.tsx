"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { t, type Locale } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import Reveal from "@/components/Reveal";

/**
 * Their strongest claim is ex-stock supply, so the section shows the stock
 * rather than asserting it.
 *
 * The video is decorative: muted, looping, no controls. Under reduced motion
 * it is never mounted and the poster frame stands in — an autoplaying loop is
 * exactly the kind of motion that setting exists to stop. It also only starts
 * once it is actually on screen, so the 2.4 MB is not spent by someone who
 * bounces at the hero.
 */
export default function Warehouse({ locale }: { locale: Locale }) {
  const d = t(locale);
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlay(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative border-b border-greige bg-ink text-paper">
      <div ref={ref} className="relative h-[70vh] min-h-[26rem] overflow-hidden">
        {play ? (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-70"
            src={asset("/video/warehouse.mp4")}
            poster={asset("/video/warehouse-poster.jpg")}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            tabIndex={-1}
          />
        ) : (
          <Image
            src={asset("/video/warehouse-poster.jpg")}
            alt={d.warehouse.caption}
            fill
            sizes="100vw"
            className="object-cover opacity-70"
          />
        )}

        {/* Keeps the copy legible over a busy, bright frame. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20"
        />

        <div className="relative mx-auto flex h-full max-w-[110rem] items-end px-5 pb-14 sm:px-8 sm:pb-20">
          <Reveal className="max-w-2xl">
            <p
              data-reveal
              className="font-mono text-[0.68rem] tracking-[0.24em] text-paper/60 uppercase"
            >
              {d.warehouse.eyebrow}
            </p>
            <h2
              data-reveal
              className="mt-6 font-display text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] tracking-[-0.015em]"
            >
              {d.warehouse.heading}
            </h2>
            <p
              data-reveal
              className="mt-6 text-base leading-relaxed text-paper/80 sm:text-lg"
            >
              {d.warehouse.lead}
            </p>
          </Reveal>
        </div>

        <p className="absolute right-5 bottom-5 font-mono text-[0.6rem] tracking-[0.18em] text-paper/50 uppercase sm:right-8">
          {d.warehouse.caption}
        </p>
      </div>
    </section>
  );
}
