"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/lenis";

/**
 * Momentum scroll (Lenis) wired into GSAP's ticker so ScrollTrigger stays in
 * step with it. Mounted once in the locale layout.
 *
 * Smooth scrolling is itself motion, so anyone who asked for reduced motion
 * gets plain native scroll — Lenis is never started for them.
 */
export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      // ScrollTrigger still drives the (instant) reveal states.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      // Matches --ease-drape: cloth settles, it does not snap.
      easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      touchMultiplier: 1.6,
    });

    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Late-loading fonts and images change section heights; without this the
    // pinned and scrubbed triggers fire at the wrong scroll positions.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
