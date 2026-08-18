"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { t, type Locale } from "@/lib/i18n";
import { route } from "@/lib/routes";
import { asset } from "@/lib/asset";
import Bolt from "@/components/home/Bolt";

const BOLT_H = 46; // px — kept in sync with the wrapper's height class

export default function Hero({ locale }: { locale: Locale }) {
  const d = t(locale);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);
    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(el);

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(q("[data-hero]"), { opacity: 1, y: 0 });
      gsap.set(q("[data-sheet]"), { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(q("[data-bolt]"), { opacity: 0 }); // no roll, so no roll to show
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const frame = q("[data-frame]")[0] as HTMLElement | undefined;
      const bolt = q("[data-bolt]")[0] as HTMLElement | undefined;
      const sheet = q("[data-sheet]")[0] as HTMLElement | undefined;
      const layers = q("[data-bolt-layers]")[0] as HTMLElement | undefined;
      if (!frame || !bolt || !sheet) return;

      // Travel is measured once, when the timeline is built. The whole thing
      // runs in under two seconds, so a mid-flight resize is not worth guarding.
      const travel = frame.offsetHeight;

      // Split only the headline — short display copy, never body text.
      const split = new SplitText(q("[data-headline]"), { type: "lines,chars" });

      // Each line is masked so the characters can slide up from behind it. The
      // mask has to sit below the descenders, or Turkish loses the tail of ş, ğ
      // and y — with leading this tight the line box ends above them. Padding
      // moves the clip edge down; the negative margin gives the space back so
      // the lines stay where they were.
      gsap.set(split.lines, {
        overflow: "hidden",
        paddingBottom: "0.22em",
        marginBottom: "-0.22em",
      });

      // One driver for both the roll's position and the cloth it leaves behind,
      // so the fabric edge can never drift away from the roll.
      const roll = { p: 0 };
      const applyRoll = () => {
        const y = roll.p * travel;
        gsap.set(bolt, { y });
        gsap.set(sheet, {
          clipPath: `inset(0% 0% ${(1 - roll.p) * 100}% 0%)`,
        });
        // Wound layers scroll at the travel rate — this is what reads as spin.
        if (layers) layers.style.backgroundPositionY = `${-y}px`;
      };

      gsap.set(sheet, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(bolt, { y: -BOLT_H * 3.2, opacity: 0 });
      gsap.set(q("[data-bolt-shadow]"), { opacity: 0, scaleY: 0.4 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 62%",
          once: true,
        },
      });

      tl
        // 1 — the bolt is dropped in, accelerating under gravity.
        .to(bolt, { opacity: 1, duration: 0.12 })
        .to(
          bolt,
          { y: 0, duration: 0.42, ease: "power3.in" },
          "<",
        )
        // 2 — it lands: the roll squashes and the contact shadow snaps in.
        .to(bolt, {
          scaleY: 0.7,
          duration: 0.09,
          transformOrigin: "bottom",
        })
        .to(bolt, {
          scaleY: 1,
          duration: 0.42,
          ease: "elastic.out(1, 0.5)",
          transformOrigin: "bottom",
        })
        .to(
          q("[data-bolt-shadow]"),
          { opacity: 1, scaleY: 1, duration: 0.35, ease: "power2.out" },
          "<",
        )
        // 3 — it rolls away, unwinding the cloth behind it.
        .to(
          roll,
          {
            p: 1,
            duration: 1.25,
            ease: "power2.inOut",
            onUpdate: applyRoll,
          },
          "-=0.26",
        )
        // 4 — the roll leaves the frame; only the cloth remains.
        .to(bolt, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.34")
        // Copy arrives while the cloth is still unwinding.
        .from(
          split.chars,
          { yPercent: 115, duration: 1, ease: "expo.out", stagger: 0.015 },
          0.55,
        )
        .from(
          q("[data-hero]"),
          { opacity: 0, y: 20, duration: 0.85, ease: "expo.out", stagger: 0.09 },
          1.05,
        )
        // The dimension line draws down like a tape measure.
        .from(
          q("[data-rule]"),
          { scaleY: 0, transformOrigin: "top", duration: 0.7, ease: "expo.out" },
          1.5,
        );

      // Slow parallax drift as the section leaves.
      const drift = gsap.to(q("[data-sheet] img"), {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      return () => {
        tl.kill();
        drift.scrollTrigger?.kill();
        drift.kill();
        split.revert(); // restore real text nodes for screen readers
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-b border-greige"
    >
      <div className="mx-auto grid max-w-[110rem] gap-10 px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pt-44 lg:pb-28">
        {/* ── Copy ───────────────────────────────────────────── */}
        <div>
          <p
            data-hero
            className="font-mono text-[0.68rem] tracking-[0.24em] text-ink-soft uppercase"
          >
            {d.hero.eyebrow}
          </p>

          <h1
            data-headline
            className="mt-7 font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.92] tracking-[-0.02em]"
          >
            {d.hero.line1}
            <br />
            <em className="text-brand not-italic">{d.hero.line2}</em>
          </h1>

          <p
            data-hero
            className="mt-8 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            {d.hero.lead}
          </p>

          <div data-hero className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={route(locale, "catalog")}
              className="group inline-flex items-center gap-3 bg-ink px-7 py-4 font-mono text-[0.7rem] tracking-widest text-paper uppercase transition-colors duration-300 hover:bg-brand"
            >
              {d.hero.ctaCatalog}
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <Link
              href={route(locale, "contact")}
              className="inline-flex items-center gap-3 border border-ink px-7 py-4 font-mono text-[0.7rem] tracking-widest uppercase transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
              {d.hero.ctaSample}
            </Link>
          </div>
        </div>

        {/* ── Material ───────────────────────────────────────── */}
        <div className="relative">
          <div
            data-frame
            className="relative aspect-4/5 overflow-hidden bg-ecru sm:aspect-3/2 lg:aspect-4/5"
          >
            <div data-sheet className="absolute inset-0">
              <Image
                src={asset("/fabrics/white-satin-swirl.jpg")}
                alt={
                  locale === "tr"
                    ? "Boyanmamış beyaz saten kumaş, girdap hâlinde kıvrılmış"
                    : "Undyed white satin fabric, swirled to show its drape"
                }
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* The roll. It sits outside the clipped frame so the drop is visible
              against the page before it lands on the frame's top edge. */}
          <div
            data-bolt
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[46px] will-change-transform"
          >
            <Bolt />
          </div>

          {/* Dimension annotation — reads like a technical drawing and puts the
              single most-asked spec on screen before anyone scrolls. */}
          <div className="absolute -top-1 -right-1 hidden items-start gap-3 lg:flex">
            <div data-rule aria-hidden className="h-24 w-px bg-loom" />
            <p className="tabular font-mono text-[0.65rem] leading-relaxed tracking-[0.18em] text-ink-soft uppercase">
              148–185
              <br />
              cm
            </p>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center lg:flex">
        <p
          data-hero
          className="font-mono text-[0.6rem] tracking-[0.3em] text-ink-soft uppercase"
        >
          {d.hero.scroll}
        </p>
      </div>
    </section>
  );
}
