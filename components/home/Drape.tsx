"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { t, type Locale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import { asset } from "@/lib/asset";

/**
 * Three grounds shot the same way, so the only variable is the cloth.
 *
 * Buyers judge weight from a number but drape only by eye, and these are the
 * one set of supplied photographs shot as a consistent series — same prop, same
 * light, same framing — so they belong together rather than scattered.
 *
 * Each frame parallaxes at a slightly different rate, which reads as depth
 * without moving anything the eye is trying to read.
 */
const PLATES = [
  { src: asset("/fabrics/white-chiffon-drape.jpg"), depth: -34 },
  { src: asset("/fabrics/white-satin-drape.jpg"), depth: -18 },
  { src: asset("/fabrics/white-crepe-drape.jpg"), depth: -46 },
] as const;

export default function Drape({ locale }: { locale: Locale }) {
  const d = t(locale);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // Parallax is decorative depth, and it costs layout thrash on small
    // screens, so it is desktop-only and never runs under reduced motion.
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const tweens = gsap.utils
          .toArray<HTMLElement>(el.querySelectorAll("[data-plate]"))
          .map((plate, i) =>
            gsap.to(plate, {
              yPercent: PLATES[i].depth / 4,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.1,
              },
            }),
          );

        return () => {
          tweens.forEach((tw) => {
            tw.scrollTrigger?.kill();
            tw.kill();
          });
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      className="border-b border-greige bg-ecru py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[110rem] px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <p
            data-reveal
            className="font-mono text-[0.68rem] tracking-[0.24em] text-ink-soft uppercase"
          >
            {d.drape.eyebrow}
          </p>
          <h2
            data-reveal
            className="mt-6 font-display text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] tracking-[-0.015em]"
          >
            {d.drape.heading}
          </h2>
          <p
            data-reveal
            className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            {d.drape.lead}
          </p>
        </Reveal>

        <Reveal
          as="ul"
          className="mt-16 grid gap-8 sm:grid-cols-3 lg:gap-10"
          stagger={0.1}
          y={28}
        >
          {d.drape.items.map((item, i) => (
            <li key={item.name} data-reveal>
              <figure>
                <div
                  data-plate
                  className="relative aspect-2/3 overflow-hidden bg-greige"
                >
                  <Image
                    src={PLATES[i].src}
                    alt={
                      locale === "tr"
                        ? `Boyanmamış ${item.name.toLocaleLowerCase("tr")} kumaşın döküm hâli`
                        : `Undyed ${item.name.toLowerCase()} shown draped`
                    }
                    fill
                    sizes="(min-width: 640px) 30vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-5">
                  <h3 className="font-display text-2xl leading-none tracking-tight">
                    {item.name}
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
                    {item.note}
                  </p>
                </figcaption>
              </figure>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
