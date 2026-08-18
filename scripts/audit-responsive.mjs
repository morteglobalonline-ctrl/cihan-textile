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

const VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
];

const PAGES = ["/", "/kumaslar", "/kurumsal", "/iletisim", "/en", "/en/catalog"];

/** Elements whose box sticks out past the document's client width. */
const findOverflow = () => {
  const limit = document.documentElement.clientWidth;
  const bad = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const overhang = Math.round(r.right - limit);
    if (overhang > 1) {
      bad.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className?.toString?.() || "").slice(0, 110),
        text: (el.textContent || "").trim().slice(0, 45),
        overhang,
        width: Math.round(r.width),
      });
    }
  }
  // Deepest/worst offenders first, de-noised to the top few.
  return bad.sort((a, b) => b.overhang - a.overhang).slice(0, 6);
};

const browser = await chromium.launch();
let problems = 0;

for (const vp of VIEWPORTS) {
  for (const path of PAGES) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: "networkidle" });
  await dismissIntro(page);
    await page.waitForTimeout(1400); // let intro timelines settle

    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    const overflows = metrics.scrollWidth > metrics.clientWidth + 1;
    const tag = `${path.replace(/\//g, "_") || "_root"}@${vp.name}`;

    if (overflows) {
      problems++;
      const culprits = await page.evaluate(findOverflow);
      console.log(
        `\n✗ ${tag}  scrollWidth ${metrics.scrollWidth} > ${metrics.clientWidth}`,
      );
      for (const c of culprits) {
        console.log(
          `    +${c.overhang}px  <${c.tag}> w=${c.width}  "${c.text}"\n              .${c.cls}`,
        );
      }
    } else {
      console.log(`✓ ${tag}`);
    }

    // Only screenshot the narrow and wide ends to keep this quick.
    if (vp.name === "375" || vp.name === "1440") {
      await page.screenshot({
        path: `${OUT}/full${tag}.png`,
        fullPage: true,
      });
    }
    await ctx.close();
  }
}

console.log(`\n${problems === 0 ? "No horizontal overflow." : `${problems} viewport/page combinations overflow.`}`);
await browser.close();
