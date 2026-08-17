"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { COMPANY, type Locale } from "@/lib/i18n";
import { getLenis } from "@/lib/lenis";
import { asset } from "@/lib/asset";

/** Wheel delta the whole walk costs — roughly twenty notches of a mouse wheel. */
const TRAVEL_COST = 2200;

/* Where the sign sits on the end wall, measured off the source footage as a
   share of the 1024×576 frame. The camera dollies in, so the sign drifts upward
   while its horizontal centre stays put. */
const SIGN = {
  appearsAt: 0.52, // progress at which the wall sign fades up in the footage
  left: 50.6, // % of frame width — the dolly is dead straight, so this is fixed
  topFrom: 36.8, // % of frame height when it appears
  topTo: 31.0, // % at the end of the walk: the camera rises as it closes in
  widthFrom: 16, // % of frame width when it appears
  widthTo: 21, // % at the end. The real mark is one line where the footage's
  //             was two, so it is set a little wider than the 19.7% measured
  //             off the source, to carry the same weight on the wall.
};

const MQ = "(prefers-reduced-motion: reduce)";

/** Motion preference as external state — no setState inside an effect, and it
    stays live if the OS setting changes. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(MQ);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(MQ).matches,
    () => false, // server: assume motion is fine, the client corrects it
  );
}

/**
 * The entrance: a walk down an aisle of fabric rolls. The wheel scrubs the
 * footage frame by frame, and when the aisle runs out the light comes through
 * and the site is behind it.
 *
 * A fixed overlay that holds the page still, rather than a pinned or sticky
 * section. Both of those made the walk and the hero share one stretch of
 * scroll, so the hero's headline had already gone past before the scene
 * cleared. Holding the page is also what the effect is saying: the site really
 * is behind the aisle.
 *
 * The sign on the end wall is ours, not the footage's. The rendered sign in the
 * source was a near-miss of the real mark — two lines instead of one, an ® that
 * does not exist, the wrong weights — so it is painted out of every frame with
 * ffmpeg's `delogo` (which resamples from the surrounding wall, and so follows
 * the changing light) and the real logo is composited back on top here, where
 * it stays sharp and correct.
 *
 * Escape hatches, because a buyer after a spec must never be stuck here: the
 * header sits above this overlay and stays clickable, there is a Skip button,
 * Escape ends it, and anyone who asked for reduced motion never sees it.
 */
export default function Corridor({ locale }: { locale: Locale }) {
  const reduced = usePrefersReducedMotion();
  const [done, setDone] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const closing = useRef(false);

  const active = !reduced && !done;
  const finish = useCallback(() => setDone(true), []);

  useEffect(() => {
    if (!active) return;
    const el = scene.current;
    if (!el) return;

    const video = el.querySelector("video");
    const sign = el.querySelector<HTMLElement>("[data-sign]");
    const flash = el.querySelector<HTMLElement>("[data-flash]");
    const label = el.querySelector<HTMLElement>("[data-label]");
    if (!video) return;

    // Hold the page: the walk consumes the wheel, the document does not move.
    // Lenis has to be stopped as well as the body locked — it listens on the
    // window too, and would bank a scroll target that fires the instant the
    // lock lifts, dropping the visitor a few thousand pixels into the page.
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0, behavior: "auto" });

    const setFlash = flash
      ? gsap.quickTo(flash, "opacity", { duration: 0.35 })
      : null;
    const setLabel = label
      ? gsap.quickTo(label, "opacity", { duration: 0.3 })
      : null;

    const render = () => {
      const p = progress.current;

      // Every frame is a keyframe in this encode, so seeking is cheap enough to
      // drive straight off the wheel.
      const duration = Number.isFinite(video.duration) ? video.duration : 10;
      video.currentTime = Math.min(duration - 0.02, p * duration);

      if (sign) {
        const t = Math.min(
          1,
          Math.max(0, (p - SIGN.appearsAt) / (1 - SIGN.appearsAt)),
        );
        sign.style.top = `${SIGN.topFrom + (SIGN.topTo - SIGN.topFrom) * t}%`;
        sign.style.width = `${SIGN.widthFrom + (SIGN.widthTo - SIGN.widthFrom) * t}%`;
        // Matches how the sign fades up in the footage.
        sign.style.opacity = String(Math.min(1, t * 3));
      }

      setFlash?.(p < 0.88 ? 0 : (p - 0.88) / 0.12);
      setLabel?.(p < 0.12 ? 1 : Math.max(0, 1 - (p - 0.12) / 0.22));

      if (p >= 1 && !closing.current) {
        closing.current = true;
        // A short fade before unmounting, during which the wheel is still
        // swallowed. Without it the tail of the gesture that finished the walk
        // carried straight on into the page and shot past the hero.
        gsap.to(el, {
          opacity: 0,
          duration: 0.45,
          ease: "power2.out",
          onComplete: finish,
        });
      }
    };

    // Seeking a video needs the host to answer HTTP Range requests. Most do
    // (GitHub Pages, S3, nginx all return 206), but a plain file server that
    // only ever returns 200 leaves the clip unseekable — `seekable.end(0)` is
    // 0 even once it is fully buffered — and scrubbing would freeze on frame
    // one. Rather than show a stuck picture, play the aisle straight through
    // and finish when it ends.
    let linear = false;
    const goLinear = () => {
      if (linear) return;
      linear = true;
      video.addEventListener("ended", finish, { once: true });
      video.play().catch(() => finish());
    };
    const isSeekable = () =>
      video.seekable.length > 0 &&
      video.seekable.end(video.seekable.length - 1) > 0.5;

    // iOS Safari will not paint a seeked frame from a video that has never
    // played, so the first gesture nudges it into playing and pauses again.
    // Without this the whole walk is a static poster on iPhone.
    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      const played = video.play();
      const settle = () => {
        if (isSeekable()) video.pause();
        else goLinear();
      };
      if (played && typeof played.then === "function") {
        played.then(settle).catch(() => {});
      } else {
        settle();
      }
    };

    // If the footage never becomes scrubbable — an unsupported codec, a stalled
    // download — do not strand the visitor in a scene that will not move.
    let attempts = 0;
    const bailOutIfStuck = () => {
      attempts += 1;
      if (attempts > 6 && video.readyState < 2) finish();
    };

    const advance = (delta: number) => {
      if (closing.current) return; // the walk is over; ignore trailing momentum
      unlock();
      bailOutIfStuck();
      if (linear) return; // the clip is driving itself; the wheel is just eaten
      progress.current = Math.min(
        1,
        Math.max(0, progress.current + delta / TRAVEL_COST),
      );
      render();
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      advance(e.deltaY);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const y = e.touches[0].clientY;
      // 1.3, not 2.4: at the higher rate a phone finished the whole ten-second
      // walk in three short swipes, so the aisle was gone before it registered.
      advance((touchY - y) * 1.3);
      touchY = y;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        finish();
        return;
      }
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        advance(340);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        advance(-340);
      }
    };

    // Nothing can be scrubbed until at least one frame has decoded.
    const start = () => render();
    if (video.readyState >= 2) start();
    else video.addEventListener("loadeddata", start, { once: true });

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      video.removeEventListener("loadeddata", start);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      // Back to the top before handing control back, then let Lenis resume.
      window.scrollTo({ top: 0, behavior: "auto" });
      lenis?.scrollTo(0, { immediate: true });
      lenis?.start();
    };
  }, [active, finish]);

  if (!active) return null;

  return (
    <div
      ref={scene}
      // z-40 keeps it under the header (z-50), so the nav stays usable.
      className="fixed inset-0 z-40 overflow-hidden bg-[#dfe1e3]"
      role="presentation"
    >
      {/* The footage box replicates object-cover geometry explicitly, so the
          sign can be placed in frame percentages and stay glued to the wall
          whatever shape the viewport is. */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "max(100vw, 177.78vh)",
          height: "max(56.25vw, 100vh)",
        }}
      >
        <video
          className="h-full w-full object-cover"
          src={asset("/video/intro.mp4")}
          poster={asset("/video/intro-poster.jpg")}
          muted
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
        />

        {/* The real mark, back on the wall where the footage's version was. */}
        <div
          data-sign
          className="absolute -translate-x-1/2 -translate-y-1/2 opacity-0"
          style={{
            left: `${SIGN.left}%`,
            top: `${SIGN.topFrom}%`,
            width: `${SIGN.widthFrom}%`,
          }}
        >
          {/* Backlit halo, as the sign in the footage had. */}
          <div
            aria-hidden
            className="absolute -inset-x-[16%] -inset-y-[60%] rounded-[50%] blur-2xl"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.45) 45%, rgba(255,255,255,0) 72%)",
            }}
          />
          <Image
            src={asset("/logo.png")}
            alt={COMPANY.legalTr}
            width={377}
            height={80}
            priority
            // A little contact shadow so the mark sits on the wall rather than
            // floating in front of it.
            className="relative h-auto w-full drop-shadow-[0_2px_6px_rgba(30,40,70,0.28)]"
          />
        </div>
      </div>

      {/* ── Copy over the scene ──────────────────────────────── */}
      <div
        data-label
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 pb-14 text-center"
      >
        <p className="max-w-md px-6 font-display text-[clamp(1.5rem,3.4vw,2.5rem)] leading-tight text-ink drop-shadow-[0_1px_10px_rgba(255,255,255,0.75)]">
          {locale === "tr"
            ? "Deponun içindesiniz. Kaydırın."
            : "You are inside the warehouse. Scroll."}
        </p>
        <span aria-hidden className="block h-10 w-px animate-pulse bg-ink/40" />
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute right-5 bottom-6 z-10 border border-ink/30 bg-paper/80 px-4 py-2 font-mono text-[0.62rem] tracking-[0.18em] text-ink uppercase backdrop-blur-sm transition-colors hover:bg-ink hover:text-paper sm:right-8"
      >
        {locale === "tr" ? "Geç" : "Skip"}
        <span className="sr-only">
          {locale === "tr" ? " — giriş animasyonunu atla" : " — skip the intro"}
        </span>
      </button>

      {/* The blow-out that hands over to the site */}
      <div
        data-flash
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-paper opacity-0"
      />
    </div>
  );
}
