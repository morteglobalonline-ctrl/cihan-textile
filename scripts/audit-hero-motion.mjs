import { chromium } from "playwright";
import { mkdirSync, readdirSync } from "node:fs";


const BASE = "http://localhost:4321";
const OUT = "/private/tmp/claude-501/-Users-omerozgorus/0f52a4ac-074e-49c5-a050-e1f3c1dd4254/scratchpad/hero";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();

// Sample the roll's transform and the cloth's clip while the intro plays, so we
// can prove the two stay locked together rather than eyeballing it.
await page.goto(`${BASE}/`);
// Fast dismiss: no settle wait, because the roll's drop is only 0.42s long and
// the shared helper's pause swallowed it before sampling began.
await page.keyboard.press("Escape");
await page.waitForFunction(
  () => !document.querySelector('[role="presentation"]'),
  null,
  { timeout: 5000 },
);
const samples = [];
for (let i = 0; i < 60; i++) {
  samples.push(
    await page.evaluate(() => {
      const bolt = document.querySelector("[data-bolt]");
      const sheet = document.querySelector("[data-sheet]");
      const frame = document.querySelector("[data-frame]");
      if (!bolt || !sheet || !frame) return null;
      const cs = getComputedStyle(bolt);
      const m = new DOMMatrixReadOnly(cs.transform === "none" ? "" : cs.transform);
      return {
        t: Math.round(performance.now()),
        boltY: Math.round(m.f),
        boltOpacity: Number(cs.opacity).toFixed(2),
        clip: getComputedStyle(sheet).clipPath,
        frameH: frame.clientHeight,
      };
    }),
  );
  await page.waitForTimeout(55);
}

const valid = samples.filter(Boolean);
const frameH = valid[0]?.frameH ?? 0;
console.log(`frame height ${frameH}px\n`);
console.log("  t(ms)  boltY  opacity  clip-path");
for (const s of valid) {
  console.log(
    `  ${String(s.t).padStart(5)}  ${String(s.boltY).padStart(5)}  ${s.boltOpacity.padStart(7)}  ${s.clip}`,
  );
}

// Assertions
const dropped = valid.some((s) => s.boltY < -20 && Number(s.boltOpacity) > 0);
const rolled = valid.some((s) => s.boltY > frameH * 0.4);
const finalClip = valid.at(-1)?.clip ?? "";
// A fully open clip normalises to the shorthand "inset(0%)" — treat any
// all-zero inset, in any of its spellings, as revealed.
const revealed =
  finalClip === "none" ||
  /^inset\(\s*(0(px|%)?\s*){1,4}\)$/.test(finalClip.trim());
const boltGone = Number(valid.at(-1)?.boltOpacity) < 0.05;

// The roll's top edge must sit where the cloth ends, within a couple of px.
const mid = valid.filter((s) => s.boltY > 10 && s.boltY < frameH - 10);
const drift = mid.map((s) => {
  const pct = Number((s.clip.match(/([\d.]+)%/g) || [])[2]?.replace("%", "") ?? NaN);
  if (Number.isNaN(pct)) {
    const px = Number((s.clip.match(/([\d.]+)px/g) || [])[2]?.replace("px", "") ?? NaN);
    return Number.isNaN(px) ? null : Math.abs(frameH - px - s.boltY);
  }
  return Math.abs(frameH * (1 - pct / 100) - s.boltY);
}).filter((v) => v !== null);
const worstDrift = drift.length ? Math.max(...drift) : null;

console.log("");
const check = (l, ok, d = "") => console.log(`${ok ? "✓" : "✗"} ${l}${d ? `  — ${d}` : ""}`);
check("roll drops in from above the frame", dropped);
check("roll travels down the frame", rolled);
check("cloth ends fully revealed", revealed, finalClip);
check("roll leaves the frame", boltGone, `final opacity ${valid.at(-1)?.boltOpacity}`);
check(
  "cloth edge stays locked to the roll",
  worstDrift !== null && worstDrift <= 2,
  worstDrift === null ? "no mid-roll samples" : `worst drift ${worstDrift.toFixed(1)}px`,
);

await ctx.close();
await browser.close();

const vids = readdirSync(OUT).filter((f) => f.endsWith(".webm"));
console.log(`\nvideo: ${OUT}/${vids.at(-1)}`);
