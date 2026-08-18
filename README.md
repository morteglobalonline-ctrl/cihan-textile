# Cihan Textile

Bilingual (TR/EN) marketing site for **Cihan Tekstil** — a family firm in Bursa
importing greige and PFD fabric and selling it wholesale in Türkiye.

## The idea

Cihan does not sell finished goods. It sells the **undyed, unprinted white
ground** other people print on — 148–150 cm rolls. Competitor sites in this
trade all show colourful printed cloth and models, which is precisely what
Cihan does *not* sell. So the site is built the other way round: the material's
own whiteness is the brand.

- **Palette** — paper / ecru / greige / loom / ink neutrals, accented with the
  company's own blue, sampled from the logo artwork: `--color-brand` `#00147C`.
  Because that navy is only 1.17:1 on the ink panels, a lighter tint of the same
  blue, `--color-brand-on-dark` `#1E7BF0`, carries anything sitting on a dark
  ground plus every focus ring. All pairs verified at WCAG AA; see the notes in
  `app/globals.css`.
- **Type** — `Instrument Serif` for display (the material, the drape, the
  fifty years), `Inter` for body, `Geist Mono` for every figure. The contrast
  between soft serif and hard tabular mono *is* the brand: cloth plus specs.
- **Motion** — drawn from the material. On the hero, a **bolt of cloth is
  dropped in, lands with a squash, then rolls down the frame unwinding the
  photograph behind it** (`components/home/Bolt.tsx` draws the roll in pure CSS;
  `Hero.tsx` drives it). The intro section **threads a loom** (warp then weft) on
  scroll, and easing is slow and weighted because fabric settles rather than
  snaps.

  The roll's position and the cloth's clip are driven from **one** tweened value,
  so the fabric edge cannot drift away from the roll — `audit-hero-motion.mjs`
  asserts the gap stays within 2px (currently 0.5px).
- **The entrance** — `components/home/Corridor.tsx`. A walk down an aisle of
  fabric rolls: the wheel scrubs `public/video/intro.mp4` frame by frame, and
  when the aisle runs out the light comes through and the site is behind it. A
  fixed overlay that holds the page still while it plays.

  **The sign at the end of the aisle is composited, not filmed.** The rendered
  sign in the supplied footage was a near-miss of the real mark — two lines
  instead of one, an ® the company does not use, the wrong weights. It is
  painted out of every frame with ffmpeg's `delogo`, which resamples from the
  surrounding wall and therefore follows the changing light, and the real
  `public/logo.png` is composited back on in the browser:

  ```
  ffmpeg -i "Cihan Giris.mp4" -an \
    -vf "delogo=x=392:y=122:w=254:h=140" \
    -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p \
    -g 1 -movflags +faststart public/video/intro.mp4
  ```

  `-g 1` makes every frame a keyframe so wheel-scrubbing seeks instantly; it
  costs about 1.6 MB over a normal GOP and is worth it. `-an` drops the audio,
  which an autoplay-less scrubbed clip has no use for.

  The sign's position is not guesswork: it was measured off the source frames
  and lives in the `SIGN` constant as percentages of the 1024×576 frame —
  centre 50.6% across, drifting from 36.8% to 31.0% down as the camera closes
  in, widening from 16% to 21%. The footage box in the DOM reproduces
  `object-cover` geometry explicitly (`max(100vw, 177.78vh)`), so those
  percentages hold at any viewport shape. `audit-intro.mjs` asserts the logo
  stays inside the end wall rather than spilling over the rolls.
- **The one section that explains the business** — `components/home/Compare.tsx`
  wipes between the same crepe greige and printed. Both photographs are the same
  swirl composition, so it reads as one cloth changing state. The caption states
  plainly that Cihan does not sell printed fabric.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) · React 19 |
| Brand marks | `public/logo.png`, `public/icon.png` — the existing logo artwork |
| Styling | Tailwind CSS v4 (`@theme` tokens in `app/globals.css`) |
| Smooth scroll | Lenis |
| Scroll / timeline motion | GSAP + ScrollTrigger + SplitText |
| Routing i18n | `app/[locale]/…` + `proxy.ts` |

> Next.js 16 renamed `middleware.ts` to **`proxy.ts`**. That is why the locale
> redirect lives in `proxy.ts` and exports `proxy`, not `middleware`.

## Layout

```
app/[locale]/            layout (html lang, fonts, header/footer) + 4 pages
  page.tsx               home
  catalog/               the searchable spec table
  about/  contact/
components/
  home/                  Hero + Bolt, NameMarquee, Intro, Compare, Families,
                         Drape, Warehouse, Value, Process, CallToAction
  FabricTable.tsx        catalogue: search / family / fibre / PFD / sort
  Header, Footer, Reveal, SmoothScroll
lib/
  fabrics.ts             65 qualities, structured and typed
  i18n.ts                TR + EN copy behind one `Dict` type
proxy.ts                 Accept-Language → /tr or /en
scripts/                 Playwright audits (see below)
public/fabrics/          13 photographs
public/video/            intro.mp4 (the scrubbed aisle, 4.1 MB, all-keyframe)
                         + warehouse loop (2.4 MB), each with a poster
```

## The catalogue is data, not markup

`lib/fabrics.ts` holds all 65 qualities as typed records — blend as
`{fiber, pct}[]`, weight in g/m², width as a `[min, max]` cm tolerance, and a
`pfd` flag. Everything else derives from it: the family list and its
weight/width spans on the home page, the footer's product links, the filter
options, and the table itself.

**To add a fabric, add one record.** Nothing else needs touching.

Transcribed from the official *Cihan Tekstil Ürün Listesi* PDF. The seven
families are cotton, poly-cotton, viscose, poly-micro, staple, chiffon-crepe
and satin.

## Deploying

See **[DEPLOY.md](DEPLOY.md)** — pushing to a new GitHub account, turning on
Pages, moving to a custom domain, or just uploading `out/` to any host.

```bash
npm run build:static                      # writes out/
node scripts/serve-static.mjs 4321 out    # preview it the way a host serves it
```

Do not preview the export with `python -m http.server`: it does not answer HTTP
Range requests, which makes the intro video unseekable and freezes the walk on
frame one. `serve-static.mjs` answers 206 like a real host does.

Every path into `public/` goes through `lib/asset.ts`. Root-relative URLs are
not rewritten for us — not even by `next/image` once `images.unoptimized` is on
— so a bare `/video/intro.mp4` 404s the moment the site is mounted under a
subfolder. If you add an image or a video, wrap its path in `asset()`.

## Running it

```bash
npm run dev            # http://localhost:3000 → redirects to /tr
npm run build && npm start
```

## Verification

Four Playwright audits. Start the server first, then:

```bash
node scripts/audit-responsive.mjs         # overflow at 375/768/1024/1440, all pages
node scripts/audit-scroll.mjs /tr home    # scrolls through, reports unrevealed elements
node scripts/audit-scroll.mjs /tr rm --reduced   # same, with prefers-reduced-motion
node scripts/audit-interaction.mjs        # catalogue filters, sort, slider, i18n switch
node scripts/audit-hero-motion.mjs        # records the hero entrance, samples the
                                          # roll/cloth sync, writes a .webm to review
node scripts/audit-intro.mjs              # the corridor: page held, header still
                                          # clickable, footage scrubs, the logo
                                          # lands on the wall, wheel/Skip/Escape
                                          # all hand over at scroll 0, and
                                          # reduced motion skips it entirely
```

Every audit that loads the home page dismisses the intro overlay first (`Escape`),
otherwise the held page would make every measurement wrong.

`audit-responsive` names the offending element and its overhang in px when a
page overflows, and `audit-scroll` reports any `[data-reveal]` element still
transparent after a full scroll — the failure mode to watch for, since reveals
start at `opacity: 0`.

Current state: no horizontal overflow at any breakpoint, every reveal fires,
all interaction checks pass, no console errors, eslint clean.

- **Turkish descenders and the headline mask.** `SplitText` masks each line so
  the characters can slide up from behind it. With `leading-[0.92]` the line box
  ends above the baseline's descenders, so `ş`, `ğ` and `y` lost their tails —
  invisible in English copy, obvious in Turkish. The lines get
  `paddingBottom: 0.22em` with a matching negative margin, which moves the clip
  edge below the descenders without shifting the layout. If the leading is ever
  tightened further, re-check this.
- **Mobile.** The intro is driven by touch at 1.3× the swipe distance: at 2.4×
  a phone finished the whole ten-second walk in three swipes, before the aisle
  registered. It now takes about six. iOS Safari will not paint a seeked frame
  from a video that has never played, so the first gesture calls `play()` then
  `pause()` to unlock it; without that the walk is a static poster on iPhone.
  If the footage never becomes scrubbable, the intro gives up and opens the site
  rather than stranding the visitor.

## Copy rules

Two things must stay out of the copy, at the company's instruction:

- **No quality or family counts.** The range grows week to week, so "65 qualities
  across seven families" dates the page the moment a mill adds a cloth. Spec
  *ranges* (weight, width) are fine; the catalogue's live result count is fine,
  because it reflects the data.
- **No 1970, and never "workshop".** The corporate page's Turkish reads
  *"küçük bir **manifatura dükkanında**"* — a draper's shop, a business that
  **sells** cloth. An early draft rendered this as "a small manufacturing
  workshop", which reversed the meaning and implied they were manufacturers.
  They have always been traders. The company's own founding date is 1998.

**PFD, not PFP.** The corporate page on the old site said PFP; the product list
PDF labels qualities PFD, and the company has settled on **PFD** throughout. Use
it wherever the product category is named, in both languages. Sentences that
merely describe the state of the cloth ("boyaya ve baskıya hazır", "a print-ready
ground") are left as they are — they explain what PFD means rather than renaming
it.

## Accessibility notes

- `prefers-reduced-motion` is honoured three ways: Lenis is never started, every
  GSAP timeline is wrapped in `gsap.matchMedia()`, and the warehouse video is
  not mounted at all (its poster frame stands in).
- The compare handle is a real `<input type="range">` — pointer, touch and
  keyboard all work, with `step={1}` so a keyboard user can actually cross it.
- Table headers are sortable buttons carrying `aria-sort`; the result count is
  `aria-live="polite"`.
- `--color-loom` was darkened from `#8f877a` (3.35:1) to `#726a5a` (5.04:1)
  because it carries small labels like `g/m²`. Keep it at or above 4.5:1.
- Focus rings use `--color-brand-on-dark`, not the logo navy: the navy scores
  1.17:1 against the ink panels, which would have left the ring invisible on the
  closing call-to-action and the warehouse band. Keep any focus colour at or
  above 3:1 on **both** `--color-paper` and `--color-ink`.
- The intro overlay locks `body` scroll and stops Lenis. Stopping Lenis matters:
  it listens on the window independently, and while the body was locked it banked
  a scroll target that fired the instant the lock lifted, dropping the visitor
  thousands of pixels past the hero. It also swallows the wheel for 450ms while
  fading out, so the tail of the gesture that ended the walk does not carry on
  into the page.
- The intro sits at `z-40`, below the header's `z-50`, so the nav stays clickable
  throughout; Skip and Escape both end it; reduced motion never renders it.
- The hero entrance holds the photograph back for roughly 2s, which pushes it out
  of contention for LCP; the `h1` becomes the LCP element instead. The image
  still carries `priority` so it is fetched immediately. Under reduced motion the
  roll never appears and the cloth is shown at once.

## Still to do

- **Photography.** Thirteen photographs were supplied; **seven are in use**:

  | File | Used in |
  |---|---|
  | `white-satin-swirl` | hero |
  | `white-crepe-swirl` + `print-tropical-swirl` | Compare wipe |
  | `white-chiffon-drape`, `white-satin-drape`, `white-crepe-drape` | Drape series |
  | `white-gauze-branch` | About page |

  The six unused files are all printed samples. `print-navy-floral-swirl` and
  `print-suzani-swirl` are good and could extend the Compare section;
  `print-maple`, `print-red-floral`, `print-mandala` and `print-navy-flatlay`
  are styled with autumn leaves and fur, read as dated stock, and are best
  left out or reshot.

  Worth shooting to fill the real gaps: rolls standing in the warehouse, a roll
  end-on, and fabric on the measuring table — there is currently no photograph
  of the product in its actual sold form, a 150 cm bolt.
- No contact form — every CTA goes to WhatsApp or `mailto:`. Add a form with a
  server action if enquiries should land somewhere trackable.
- `sitemap.ts` and `robots.ts` are not written yet.
- Consider `next/image` `blurDataURL` placeholders for the largest photographs.

`AGENTS.md` and `CLAUDE.md` in the project root are generated by `next dev` —
Next.js maintains them, so leave them in place.
