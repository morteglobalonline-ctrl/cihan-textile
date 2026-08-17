"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  children: ReactNode;
  /** Element to render. Defaults to a plain div. */
  as?: ElementType;
  className?: string;
  /** Seconds between each revealed child. */
  stagger?: number;
  /** Vertical travel in px. Keep small so it reads as a fade, not a slide. */
  y?: number;
  /** Delay before the group starts, in seconds. */
  delay?: number;
};

/**
 * Reveals its `[data-reveal]` descendants on scroll — the Standard tier of the
 * scroll-reveal preset: short travel, expo ease, plays once on the way in and
 * reverses on the way out.
 *
 * Children start hidden via `.js [data-reveal] { opacity: 0 }` in globals.css,
 * so nothing flashes before hydration and no-JS visitors still see everything.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className,
  stagger = 0.07,
  y = 18,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Idempotent, and keeps this component independent of whether
    // SmoothScroll happened to mount first.
    gsap.registerPlugin(ScrollTrigger);

    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!targets.length) return;

    const mm = gsap.matchMedia();

    // Reduced motion: no travel, no stagger — the final state, immediately.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(targets, { opacity: 1, y: 0 });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay,
          ease: "expo.out",
          stagger,
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [stagger, y, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
