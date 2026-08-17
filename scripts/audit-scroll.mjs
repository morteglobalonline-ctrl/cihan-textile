import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

/** The home page opens with a held intro overlay; clear it before measuring. */
async function dismissIntro(page) {
  const overlay = await page.evaluate(
    () => !!document.querySelector('[role="presentation"]'),
  );
  if (!overlay) return;
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => !document.querySelector('[role="presentation"]'),
    null,
    { timeout: 5000 },
  );
  await page.waitForTimeout(500);
}

const BASE = "http://localhost:4321";
const OUT = "/private/tmp/claude-501/-Users-omerozgorus/0f52a4ac-074e-49c5-a050-e1f3c1dd4254/scratchpad/shots";
mkdirSync(OUT, { recursive: true });

const path = process.argv[2] || "/tr";
const label = process.argv[3] || "scroll";
const reduced = process.argv.includes("--reduced");

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: reduced ? "reduce" : "no-preference",
});
const page = await ctx.newPage();
await page.goto(BASE + path, { waitUntil: "networkidle" });
  await dismissIntro(page);
await page.waitForTimeout(1800);

const height = await page.evaluate(() => document.documentElement.scrollHeight);
const steps = Math.ceil(height / 900);
console.log(`${path} — ${height}px tall, ${steps} screens, reducedMotion=${reduced}`);

for (let i = 0; i < steps; i++) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "auto" }), i * 900);
  // Lenis animates toward the target, and reveals need their tween to finish.
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `${OUT}/${label}-${String(i).padStart(2, "0")}.png` });
}

// Report anything still transparent after the whole page has been scrolled.
const stillHidden = await page.evaluate(() =>
  [...document.querySelectorAll("[data-reveal]")]
    .filter((el) => Number(getComputedStyle(el).opacity) < 0.9)
    .map((el) => (el.textContent || "").trim().slice(0, 60)),
);
console.log(
  stillHidden.length
    ? `\n${stillHidden.length} element(s) still hidden after a full scroll:\n  - ` +
        stillHidden.join("\n  - ")
    : "\nEvery [data-reveal] element ended visible.",
);

await browser.close();
