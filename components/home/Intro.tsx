"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { t, type Locale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

const WARP = 14; // vertical threads
const WEFT = 9; // horizontal threads

/**
 * The statement of what the company actually sells, over a loom that threads
 * itself as you scroll — warp first, then weft, the order cloth is made in.
 *
 * The SVG is decorative and hidden from assistive tech; the section reads
 * exactly the same with it removed.
 */
export default function Intro({ locale }: { locale: Locale }) {
  const d = t(locale);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(el);

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(q("[data-warp]"), { scaleY: 1, transformOrigin: "top" });
      gsap.set(q("[data-weft]"), { scaleX: 1, transformOrigin: "left" });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "bottom 60%",
          scrub: 1.2,
        },
      });

      tl.fromTo(
        q("[data-warp]"),
        { scaleY: 0, transformOrigin: "top" },
        { scaleY: 1, stagger: 0.04, ease: "none" },
      ).fromTo(
        q("[data-weft]"),
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, stagger: 0.05, ease: "none" },
        0.35,
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-b border-greige py-20 sm:py-28 lg:py-36"
    >
      {/* Loom */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {Array.from({ length: WARP }, (_, i) => (
          <line
            key={`warp-${i}`}
            data-warp
            x1={((i + 1) / (WARP + 1)) * 100}
            y1="0"
            x2={((i + 1) / (WARP + 1)) * 100}
            y2="100"
            stroke="var(--color-loom)"
            strokeWidth="0.08"
            opacity="0.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {Array.from({ length: WEFT }, (_, i) => (
          <line
            key={`weft-${i}`}
            data-weft
            x1="0"
            y1={((i + 1) / (WEFT + 1)) * 100}
            x2="100"
            y2={((i + 1) / (WEFT + 1)) * 100}
            stroke="var(--color-loom)"
            strokeWidth="0.08"
            opacity="0.32"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div className="relative mx-auto max-w-[110rem] px-5 sm:px-8">
        <Reveal className="max-w-4xl">
          <h2
            data-reveal
            className="font-display text-[clamp(1.75rem,4.2vw,3.5rem)] leading-[1.08] tracking-[-0.015em]"
          >
            {d.intro.heading}
          </h2>
          {d.intro.body.map((paragraph, i) => (
            <p
              key={i}
              data-reveal
              className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </Reveal>

        <Reveal
          as="dl"
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-greige pt-10 lg:grid-cols-4"
          stagger={0.08}
        >
          {d.stats.map((stat) => (
            <div key={stat.label} data-reveal>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="tabular font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-tight">
                {stat.value}
              </dd>
              <dd className="mt-3 font-mono text-[0.65rem] tracking-[0.18em] text-ink-soft uppercase">
                {stat.label}
              </dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
