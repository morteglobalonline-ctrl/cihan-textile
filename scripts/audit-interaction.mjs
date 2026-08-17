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

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const errors = [];
// Only our own code counts. The contact page embeds a Google Maps iframe that
// logs CORS failures from its own internals, which would otherwise show up here
// as flaky "console errors" and mask a real one.
const ours = (url) => !url || url.includes("localhost");
page.on("console", (m) => {
  if (m.type() !== "error") return;
  if (!ours(m.location()?.url)) return;
  errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

const check = (label, pass, detail = "") =>
  console.log(`${pass ? "✓" : "✗"} ${label}${detail ? `  — ${detail}` : ""}`);

// ── Catalogue deep link ────────────────────────────────────────────
await page.goto(`${BASE}/tr/catalog?family=satin`, { waitUntil: "networkidle" });
await page.waitForTimeout(700);

const familyValue = await page.locator("#fabric-family").inputValue();
check("deep link preselects family", familyValue === "satin", `select="${familyValue}"`);

const satinRows = await page.locator("table tbody tr").count();
check("satin family filters rows", satinRows === 19, `${satinRows} rows (expect 19)`);

// ── Search ─────────────────────────────────────────────────────────
await page.goto(`${BASE}/tr/catalog`, { waitUntil: "networkidle" });
const allRows = await page.locator("table tbody tr").count();
check("full catalogue renders", allRows === 65, `${allRows} rows (expect 65)`);

await page.fill("#fabric-search", "poplin");
await page.waitForTimeout(400);
const poplinRows = await page.locator("table tbody tr").count();
check("search narrows results", poplinRows > 0 && poplinRows < allRows, `${poplinRows} rows`);

// Turkish dotless-i: searching "şifon" must match "Şifon"
await page.fill("#fabric-search", "şifon");
await page.waitForTimeout(400);
const sifonRows = await page.locator("table tbody tr").count();
check("Turkish case-insensitive search", sifonRows > 0, `${sifonRows} rows for "şifon"`);

// ── PFD toggle ─────────────────────────────────────────────────────
await page.fill("#fabric-search", "");
await page.locator('input[type="checkbox"]').check();
await page.waitForTimeout(400);
const pfdRows = await page.locator("table tbody tr").count();
check("PFD filter works", pfdRows > 0 && pfdRows < allRows, `${pfdRows} PFD rows`);

// ── Sorting ────────────────────────────────────────────────────────
await page.locator('input[type="checkbox"]').uncheck();
await page.getByRole("button", { name: /ağırlık/i }).click();
await page.waitForTimeout(400);
const firstWeight = await page
  .locator("table tbody tr")
  .first()
  .locator("td")
  .nth(1)
  .innerText();
check("sort by weight ascending", firstWeight.trim().startsWith("35"), `first = "${firstWeight.trim()}"`);

// ── Empty state ────────────────────────────────────────────────────
await page.fill("#fabric-search", "zzzznothing");
await page.waitForTimeout(400);
const emptyVisible = await page.getByText(/eşleşen kalite yok/i).isVisible();
check("empty state shows", emptyVisible);

// ── Compare slider, keyboard ───────────────────────────────────────
await page.goto(`${BASE}/tr`, { waitUntil: "networkidle" });
  await dismissIntro(page);
const slider = page.locator('input[type="range"]');
await slider.focus();
const before = await slider.inputValue();
await page.keyboard.press("ArrowRight");
await page.keyboard.press("ArrowRight");
const after = await slider.inputValue();
check("compare slider is keyboard operable", Number(after) > Number(before), `${before} → ${after}`);

// ── Language switch keeps the page ─────────────────────────────────
await page.goto(`${BASE}/tr/catalog`, { waitUntil: "networkidle" });
await page.getByRole("link", { name: "en", exact: true }).click();
await page.waitForURL(/\/en\/catalog/);
// The static build has trailingSlash on, so accept either spelling.
check(
  "language switch preserves route",
  /\/en\/catalog\/?$/.test(new URL(page.url()).pathname),
  page.url(),
);

// ── Screenshots of remaining pages ─────────────────────────────────
for (const [path, name] of [
  ["/tr/about", "about-tr"],
  ["/tr/contact", "contact-tr"],
]) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${name}.png` });
}

console.log(
  errors.length ? `\n✗ console errors:\n  ${errors.join("\n  ")}` : "\n✓ no console errors",
);
await browser.close();
