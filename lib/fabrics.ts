// Cihan Textile — product catalogue
// Source: "Cihan Tekstil Ürün Listesi" (official PDF price/spec list), transcribed 2026-08-17.
// gsm = ağırlık gr/m². width = en (cm). A range means the mill tolerance, not two products.

export type FiberCode =
  | "cotton"
  | "polyester"
  | "viscose"
  | "linen"
  | "elastane"
  | "nylon";

export type Blend = { fiber: FiberCode; pct: number };

export type FamilyId =
  | "cotton"
  | "poly-cotton"
  | "viscose"
  | "poly-micro"
  | "staple"
  | "chiffon-crepe"
  | "satin";

export type Fabric = {
  id: string;
  name: string;
  family: FamilyId;
  blend: Blend[];
  /** grams per square metre; null where the mill has not published a figure */
  gsm: number | null;
  /** width in cm as [min, max]; equal values mean a single nominal width */
  width: [number, number] | null;
  /** Prepared For Dyeing — greige finished ready to take dye/print */
  pfd: boolean;
};

export const FIBERS: Record<FiberCode, { tr: string; en: string }> = {
  cotton: { tr: "Pamuk", en: "Cotton" },
  polyester: { tr: "Polyester", en: "Polyester" },
  viscose: { tr: "Viskon", en: "Viscose" },
  linen: { tr: "Keten", en: "Linen" },
  elastane: { tr: "Elastan", en: "Elastane" },
  nylon: { tr: "Naylon", en: "Nylon" },
};

export const FAMILIES: {
  id: FamilyId;
  tr: string;
  en: string;
  blurbTr: string;
  blurbEn: string;
}[] = [
  {
    id: "cotton",
    tr: "Pamuk",
    en: "Cotton",
    blurbTr:
      "Poplin, vual ve saten konstrüksiyonlarında %100 pamuk. Gömlek, elbise ve ev tekstili için baskıya hazır zemin.",
    blurbEn:
      "100% cotton in poplin, voile and sateen constructions. A print-ready ground for shirting, dresses and home textiles.",
  },
  {
    id: "poly-cotton",
    tr: "Polyester / Pamuk",
    en: "Polyester / Cotton",
    blurbTr:
      "65/35 ve 80/20 karışımlar. Pamuğun tutumu, polyesterin boyutsal kararlılığı ve maliyeti.",
    blurbEn:
      "65/35 and 80/20 blends. The hand of cotton with the dimensional stability and cost of polyester.",
  },
  {
    id: "viscose",
    tr: "Viskon",
    en: "Viscose",
    blurbTr:
      "Akıcı drape, mat yüzey. Challie, krinkıl ve keten karışımlı konstrüksiyonlar.",
    blurbEn:
      "Fluid drape, matte surface. Challis, crinkle and linen-blended constructions.",
  },
  {
    id: "poly-micro",
    tr: "Polyester Micro",
    en: "Polyester Micro",
    blurbTr:
      "Mikrofilament iplikten sık dokunmuş, yoğun ve pürüzsüz yüzeyler. Memory ve teknik kullanımlar.",
    blurbEn:
      "Densely woven from microfilament yarn for a smooth, compact surface. Memory and technical uses.",
  },
  {
    id: "staple",
    tr: "Kesik Elyaf",
    en: "Staple Fibre",
    blurbTr:
      "Kesik elyaf ipliğin doğal, hafif düzensiz yüzeyi. Flam ve likralı poplin varyantları.",
    blurbEn:
      "The natural, slightly irregular surface of staple-spun yarn. Slub and stretch poplin variants.",
  },
  {
    id: "chiffon-crepe",
    tr: "Şifon & Krep",
    en: "Chiffon & Crepe",
    blurbTr:
      "Evimizin en geniş ailesi. 35 g/m²'den 180 g/m²'ye kadar şifon ve krep zeminler, tamamı PFD.",
    blurbEn:
      "Our widest family. Chiffon and crepe grounds from 35 g/m² to 180 g/m², all PFD.",
  },
  {
    id: "satin",
    tr: "Saten",
    en: "Satin",
    blurbTr:
      "Parlak ve mat saten zeminler, likralı ve likrasız. Dijital baskı için en çok tercih edilen grup.",
    blurbEn:
      "Lustrous and matte satin grounds, with and without elastane. The group most chosen for digital print.",
  },
];

const C = (pct: number): Blend => ({ fiber: "cotton", pct });
const P = (pct: number): Blend => ({ fiber: "polyester", pct });
const V = (pct: number): Blend => ({ fiber: "viscose", pct });
const L = (pct: number): Blend => ({ fiber: "linen", pct });
const E = (pct: number): Blend => ({ fiber: "elastane", pct });

export const FABRICS: Fabric[] = [
  // ─── PAMUK / COTTON ──────────────────────────────────────────────
  { id: "poplin-40-1-80", name: "40/1 Poplin 80 Tel", family: "cotton", blend: [C(100)], gsm: 120, width: [160, 160], pfd: false },
  { id: "poplin-50-1-88", name: "50/1 Poplin 88 Tel", family: "cotton", blend: [C(100)], gsm: 115, width: [160, 160], pfd: false },
  { id: "poplin-60-1-92", name: "60/1 Poplin 92 Tel", family: "cotton", blend: [C(100)], gsm: 110, width: null, pfd: false },
  { id: "poplin-40-1-likra", name: "40/1 Poplin Likra", family: "cotton", blend: [C(100)], gsm: 115, width: [182, 182], pfd: false },
  { id: "poplin-50-1-likra", name: "50/1 Poplin Likra", family: "cotton", blend: [C(100)], gsm: 110, width: [170, 170], pfd: false },
  { id: "pamuk-saten-60-1", name: "60/1 Pamuk Saten", family: "cotton", blend: [C(100)], gsm: 140, width: [165, 165], pfd: false },
  { id: "pamuk-flam", name: "Pamuk Flam", family: "cotton", blend: [C(100)], gsm: 115, width: [150, 150], pfd: false },
  { id: "pamuk-keten", name: "Pamuk Keten", family: "cotton", blend: [C(58), L(42)], gsm: 105, width: [150, 150], pfd: false },
  { id: "vual-80-1", name: "80/1 Pamuk Vual", family: "cotton", blend: [C(100)], gsm: 60, width: [160, 160], pfd: false },
  { id: "vual-100-1", name: "100/1 Pamuk Vual", family: "cotton", blend: [C(100)], gsm: 50, width: [160, 160], pfd: false },
  { id: "vual-60-1", name: "60/1 Pamuk Vual", family: "cotton", blend: [C(100)], gsm: 72, width: [163, 163], pfd: false },

  // ─── POLİESTER / COTTON ──────────────────────────────────────────
  { id: "tc-terrycotton", name: "T/C Terrycotton 65/35", family: "poly-cotton", blend: [P(65), C(35)], gsm: 105, width: [160, 160], pfd: false },
  { id: "dacron-80-20", name: "Dacron 80/20", family: "poly-cotton", blend: [P(80), C(20)], gsm: 100, width: [160, 160], pfd: false },
  { id: "tc-vual", name: "T/C Vual", family: "poly-cotton", blend: [P(65), C(35)], gsm: 80, width: [160, 160], pfd: false },

  // ─── VİSCOSE ─────────────────────────────────────────────────────
  { id: "viskon-challie", name: "Viskon (Challie)", family: "viscose", blend: [V(100)], gsm: 106, width: [170, 170], pfd: false },
  { id: "viscose-crincle", name: "Viscose Crincle", family: "viscose", blend: [V(100)], gsm: 110, width: [165, 165], pfd: false },
  { id: "belmando-2-1", name: "2/1 Belmando", family: "viscose", blend: [V(100)], gsm: 138, width: [160, 160], pfd: false },
  { id: "viskon-vual-60-1", name: "60/1 Viskon Vual", family: "viscose", blend: [V(100)], gsm: 75, width: [165, 165], pfd: false },
  { id: "viskon-keten", name: "Viskon Keten", family: "viscose", blend: [V(90), L(10)], gsm: null, width: null, pfd: false },

  // ─── POLİESTER MICRO ─────────────────────────────────────────────
  { id: "twil-memory", name: "Twil Memory", family: "poly-micro", blend: [P(100)], gsm: 120, width: [149, 149], pfd: false },
  { id: "ince-memory", name: "İnce Memory", family: "poly-micro", blend: [P(100)], gsm: 100, width: [149, 149], pfd: false },
  { id: "memory", name: "Memory", family: "poly-micro", blend: [P(100)], gsm: 139, width: [149, 149], pfd: false },
  { id: "jessica-mikro", name: "Jessica Mikro", family: "poly-micro", blend: [P(100)], gsm: 75, width: [149, 149], pfd: false },
  { id: "soft-mikro", name: "Soft Mikro", family: "poly-micro", blend: [P(100)], gsm: 140, width: [149, 149], pfd: false },
  { id: "micro-30-denye", name: "30 Denye Micro", family: "poly-micro", blend: [P(100)], gsm: 48, width: [162, 162], pfd: false },
  { id: "micro-70-70", name: "70/70 Micro", family: "poly-micro", blend: [P(100)], gsm: 90, width: [160, 160], pfd: false },
  { id: "palermo", name: "Palermo", family: "poly-micro", blend: [P(100)], gsm: 110, width: [160, 160], pfd: false },

  // ─── KESİK ELYAF ─────────────────────────────────────────────────
  { id: "polyester-flam", name: "Polyester Flam", family: "staple", blend: [P(100)], gsm: 115, width: [150, 150], pfd: false },
  { id: "luna", name: "Luna", family: "staple", blend: [P(100)], gsm: 60, width: [150, 150], pfd: false },
  { id: "polyester-poplin-likra", name: "Polyester Poplin Likra", family: "staple", blend: [P(97), E(3)], gsm: 115, width: [150, 150], pfd: false },

  // ─── CHIFFON & CREPE ─────────────────────────────────────────────
  { id: "high-multi-sifon", name: "High Multi Şifon", family: "chiffon-crepe", blend: [P(100)], gsm: 70, width: [148, 150], pfd: true },
  { id: "yoryu-sifon", name: "Yoryu Şifon", family: "chiffon-crepe", blend: [P(100)], gsm: 75, width: [148, 150], pfd: true },
  { id: "sifon-30-denier", name: "30 Denier Şifon", family: "chiffon-crepe", blend: [P(100)], gsm: 35, width: [148, 150], pfd: true },
  { id: "yoram-100-denye", name: "Yoram (100 Denye Yoryu)", family: "chiffon-crepe", blend: [P(100)], gsm: 115, width: [148, 150], pfd: true },
  { id: "penang", name: "Penang", family: "chiffon-crepe", blend: [P(100)], gsm: 55, width: [148, 150], pfd: true },
  { id: "silky-krep", name: "Silky Krep", family: "chiffon-crepe", blend: [P(100)], gsm: 75, width: [148, 150], pfd: true },
  { id: "pasific-ege-krep", name: "Pasific (Ege) Krep", family: "chiffon-crepe", blend: [P(100)], gsm: 85, width: [148, 150], pfd: true },
  { id: "queen-krep", name: "Queen Krep", family: "chiffon-crepe", blend: [P(100)], gsm: 112, width: [148, 150], pfd: true },
  { id: "mose-fuji-krep", name: "Mose (Fuji) Krep – Dull Funtie", family: "chiffon-crepe", blend: [P(100)], gsm: 85, width: [148, 150], pfd: true },
  { id: "casandra", name: "Casandra", family: "chiffon-crepe", blend: [P(100)], gsm: 120, width: [148, 150], pfd: true },
  { id: "clara-affa-savanna", name: "Clara (Affa Savanna) Krep", family: "chiffon-crepe", blend: [P(97), E(3)], gsm: 90, width: [148, 150], pfd: true },
  { id: "bubbly-girl-kobe-krep", name: "Bubbly Girl (Eva Crep) Kobe Krep", family: "chiffon-crepe", blend: [P(100)], gsm: 115, width: [148, 150], pfd: true },
  { id: "fine-soft-koshiba", name: "Fine Soft Koshiba", family: "chiffon-crepe", blend: [P(100)], gsm: 130, width: [148, 150], pfd: true },
  { id: "pes-marocain", name: "Pes Marocain – Maroken", family: "chiffon-crepe", blend: [P(100)], gsm: 120, width: [148, 150], pfd: true },
  { id: "cupra-clara-krep", name: "Cupra Clara Krep", family: "chiffon-crepe", blend: [P(100)], gsm: 115, width: [148, 150], pfd: false },
  { id: "double", name: "Double", family: "chiffon-crepe", blend: [P(88), E(12)], gsm: 180, width: [146, 152], pfd: false },

  // ─── SATIN ───────────────────────────────────────────────────────
  { id: "jessica-saten", name: "Jessica Saten", family: "satin", blend: [P(97), E(3)], gsm: 110, width: [148, 150], pfd: true },
  { id: "amelia-sifon-saten", name: "Amelia (Şifon Saten)", family: "satin", blend: [P(100)], gsm: 85, width: [148, 150], pfd: true },
  { id: "soft-skin", name: "Soft Skin", family: "satin", blend: [P(100)], gsm: 138, width: [148, 150], pfd: true },
  { id: "channel-italian-velvet", name: "Channel Saten – Italian Velvet", family: "satin", blend: [P(100)], gsm: 120, width: [148, 150], pfd: true },
  { id: "bubbly-kobe-saten", name: "Bubbly Saten (Eva Satin) Kobe Saten", family: "satin", blend: [P(100)], gsm: 105, width: [148, 150], pfd: true },
  { id: "mat-likra-saten", name: "Mat Likra Saten", family: "satin", blend: [P(97), E(3)], gsm: 97, width: [148, 150], pfd: true },
  { id: "parlak-likra-saten", name: "Parlak Likra Saten", family: "satin", blend: [P(97), E(3)], gsm: 95, width: [148, 150], pfd: true },
  { id: "helena-saten", name: "Helena Saten", family: "satin", blend: [P(100)], gsm: 105, width: [148, 150], pfd: true },
  { id: "charms-saten", name: "Charms (Çamaşırlık) Saten", family: "satin", blend: [P(100)], gsm: 100, width: [148, 150], pfd: true },
  { id: "cupra-saten", name: "Cupra Saten", family: "satin", blend: [P(100)], gsm: 85, width: [148, 150], pfd: true },
  { id: "show-mango-saten", name: "Show (Mango) Saten", family: "satin", blend: [P(97), E(3)], gsm: 170, width: [148, 150], pfd: true },
  { id: "twill-saten", name: "Twill Saten", family: "satin", blend: [P(100)], gsm: 90, width: [148, 150], pfd: false },
  { id: "krep-saten-likra", name: "Krep Saten Likra", family: "satin", blend: [P(97), E(3)], gsm: 97, width: [148, 150], pfd: false },
  { id: "yoryu-saten", name: "Yoryu Saten", family: "satin", blend: [P(100)], gsm: 95, width: [148, 150], pfd: false },
  { id: "saten-sifon-cdc-likra", name: "Saten Şifon (CDC) Likra", family: "satin", blend: [P(97), E(3)], gsm: 83, width: [148, 150], pfd: false },
  { id: "miracle", name: "Miracle", family: "satin", blend: [P(100)], gsm: 72, width: [148, 150], pfd: false },
  { id: "orme-saten", name: "Örme Saten", family: "satin", blend: [P(100)], gsm: 200, width: [150, 150], pfd: false },
  { id: "saten-30-denye", name: "30 Denye Saten", family: "satin", blend: [P(100)], gsm: 50, width: [150, 150], pfd: false },
  { id: "full-mat-likra-saten", name: "Full Mat Likra Saten", family: "satin", blend: [P(97), E(3)], gsm: 95, width: [150, 150], pfd: false },
];

/** Formats a blend as "%97 Polyester · %3 Elastan" in the requested locale. */
export function formatBlend(blend: Blend[], locale: "tr" | "en"): string {
  return blend
    .map((b) => `%${b.pct} ${FIBERS[b.fiber][locale]}`)
    .join(" · ");
}

/** Formats width as "148–150 cm", "160 cm", or "—". */
export function formatWidth(width: Fabric["width"]): string {
  if (!width) return "—";
  const [min, max] = width;
  return min === max ? `${min} cm` : `${min}–${max} cm`;
}

export const GSM_RANGE: [number, number] = [35, 200];
export const WIDTH_RANGE: [number, number] = [146, 182];
