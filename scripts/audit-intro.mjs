import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:4321";
const OUT = "/private/tmp/claude-501/-Users-omerozgorus/0f52a4ac-074e-49c5-a050-e1f3c1dd4254/scratchpad/intro";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const results = [];
const check = (label, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "✓" : "✗"} ${label}${detail ? `  — ${detail}` : ""}`);
};

const openPage = async (opts = {}) => {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    ...opts,
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("  pageerror:", e.message));
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1300);
  return { ctx, page };
};

const state = (page) =>
  page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return {
      overlay: !!document.querySelector('[role="presentation"]'),
      bodyOverflow: getComputedStyle(document.body).overflow,
      scrollY: Math.round(window.scrollY),
      h1Opacity: h1 ? Number(getComputedStyle(h1).opacity).toFixed(2) : null,
      h1Top: h1 ? Math.round(h1.getBoundingClientRect().top) : null,
    };
  });

// ── 1. The intro appears and holds the page ────────────────────────
{
  const { ctx, page } = await openPage();
  const s = await state(page);
  check("intro overlay present on load", s.overlay);
  check("page is held still", s.bodyOverflow === "hidden", `overflow: ${s.bodyOverflow}`);

  // The header must stay reachable — a buyer can leave straight away.
  const navBox = await page
    .getByLabel("Ana menü")
    .getByRole("link", { name: "Kumaşlar", exact: true })
    .boundingBox();
  const topmost = await page.evaluate(
    ([x, y]) => {
      const el = document.elementFromPoint(x, y);
      return el?.closest("a")?.textContent?.trim() ?? el?.tagName;
    },
    [navBox.x + navBox.width / 2, navBox.y + navBox.height / 2],
  );
  check("header nav sits above the overlay", topmost === "Kumaşlar", `hit: ${topmost}`);
  await page.screenshot({ path: `${OUT}/01-start.png` });
  await ctx.close();
}

// ── 2. Wheeling walks the aisle, and finishing hands over cleanly ──
{
  const { ctx, page } = await openPage();
  const shot = () =>
    page.evaluate(() => {
      const v = document.querySelector("video[src*='intro']");
      const sign = document.querySelector("[data-sign]");
      const box = sign?.getBoundingClientRect();
      return {
        time: v ? Number(v.currentTime.toFixed(2)) : null,
        ready: v ? v.readyState : null,
        signOpacity: sign ? Number(getComputedStyle(sign).opacity) : null,
        signLeft: box ? Math.round(box.left) : null,
        signRight: box ? Math.round(box.right) : null,
      };
    });

  const a = await shot();
  check("intro footage is decoded", a.ready >= 2, `readyState ${a.ready}`);

  await page.mouse.move(720, 450);
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(400);
  }
  const b2 = await shot();
  check("wheel scrubs the footage forward", b2.time > a.time + 0.5, `t ${a.time} → ${b2.time}`);

  // Once past the point where the sign lights up, our own logo must be showing,
  // and must stay inside the end wall rather than spilling over the rolls.
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(600);
  const c2 = await shot();
  const vw = 1440;
  check("the real logo is on the wall", c2.signOpacity > 0.5, `opacity ${c2.signOpacity}`);
  check(
    "logo stays within the end wall",
    c2.signLeft > vw * 0.34 && c2.signRight < vw * 0.66,
    `x ${c2.signLeft}–${c2.signRight} of ${vw}`,
  );
  await page.screenshot({ path: `${OUT}/02-mid.png` });

  // Complete the walk, then stop — as a real gesture would.
  for (let i = 0; i < 10; i++) {
    const gone = await page.evaluate(
      () => !document.querySelector('[role="presentation"]'),
    );
    if (gone) break;
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(280);
  }
  await page.waitForTimeout(1200);

  const s = await state(page);
  check("overlay removed once the aisle ends", !s.overlay);
  check("scrolling handed back", s.bodyOverflow !== "hidden", `overflow: ${s.bodyOverflow}`);
  check(
    "page is at the top, not thrown down",
    Math.abs(s.scrollY) <= 40,
    `scrollY ${s.scrollY}`,
  );
  check("hero headline is on screen", s.h1Top !== null && s.h1Top > -50 && s.h1Top < 900, `h1 top ${s.h1Top}`);
  check("hero headline has revealed", Number(s.h1Opacity) > 0.9, `opacity ${s.h1Opacity}`);
  await page.screenshot({ path: `${OUT}/03-opened.png` });
  await ctx.close();
}

// ── 3. Skip button ────────────────────────────────────────────────
{
  const { ctx, page } = await openPage();
  await page.getByRole("button", { name: /Geç/i }).click();
  await page.waitForTimeout(1000);
  const s = await state(page);
  check("skip button opens the site", !s.overlay && s.bodyOverflow !== "hidden");
  check("skip leaves the page at the top", Math.abs(s.scrollY) <= 40, `scrollY ${s.scrollY}`);
  await ctx.close();
}

// ── 4. Escape ─────────────────────────────────────────────────────
{
  const { ctx, page } = await openPage();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  const s = await state(page);
  check("Escape opens the site", !s.overlay && s.bodyOverflow !== "hidden");
  await ctx.close();
}

// ── 5. Reduced motion never sees it ───────────────────────────────
{
  const { ctx, page } = await openPage({ reducedMotion: "reduce" });
  const s = await state(page);
  check("reduced motion skips the intro entirely", !s.overlay);
  check("reduced motion is not page-locked", s.bodyOverflow !== "hidden", `overflow: ${s.bodyOverflow}`);
  check("reduced motion sees the headline at once", Number(s.h1Opacity) > 0.9, `opacity ${s.h1Opacity}`);
  await page.screenshot({ path: `${OUT}/04-reduced.png` });
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r).length;
console.log(failed ? `\n${failed} check(s) failed.` : "\nAll intro checks passed.");
process.exitCode = failed ? 1 : 0;
