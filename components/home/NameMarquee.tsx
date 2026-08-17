import { FABRICS } from "@/lib/fabrics";

/**
 * A continuous band of quality names. The track holds the list twice and
 * translates by -50%, so the seam never shows.
 *
 * CSS-only: pauses on hover and focus, and is switched off entirely under
 * prefers-reduced-motion (see globals.css).
 */
export default function NameMarquee() {
  const names = FABRICS.map((fabric) => fabric.name);

  return (
    <section
      className="marquee overflow-hidden border-y border-greige bg-ink py-5"
      aria-label="Fabric qualities"
    >
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((pass) => (
          <ul
            key={pass}
            className="flex items-center"
            aria-hidden={pass === 1 || undefined}
          >
            {names.map((name) => (
              <li
                key={`${pass}-${name}`}
                className="flex items-center whitespace-nowrap"
              >
                <span className="font-mono text-[0.7rem] tracking-[0.18em] text-paper/70 uppercase">
                  {name}
                </span>
                <span
                  aria-hidden
                  className="mx-7 inline-block h-1 w-1 rounded-full bg-brand-on-dark"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
