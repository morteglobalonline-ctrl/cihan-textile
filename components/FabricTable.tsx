"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { COMPANY, t, type Locale } from "@/lib/i18n";
import {
  FABRICS,
  FAMILIES,
  FIBERS,
  formatBlend,
  formatWidth,
  type FamilyId,
  type FiberCode,
} from "@/lib/fabrics";

type SortKey = "name" | "gsm" | "width";
type SortDir = "asc" | "desc";

/** Fibres that actually occur in the catalogue, in catalogue order. */
const USED_FIBERS = Array.from(
  new Set(FABRICS.flatMap((f) => f.blend.map((b) => b.fiber))),
) as FiberCode[];

export default function FabricTable({ locale }: { locale: Locale }) {
  const d = t(locale);
  const params = useSearchParams();
  const initialFamily = params.get("family") as FamilyId | null;

  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<FamilyId | "all">(
    initialFamily && FAMILIES.some((f) => f.id === initialFamily)
      ? initialFamily
      : "all",
  );
  const [fiber, setFiber] = useState<FiberCode | "all">("all");
  const [pfdOnly, setPfdOnly] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "name",
    dir: "asc",
  });

  const rows = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(locale === "tr" ? "tr" : "en");

    const filtered = FABRICS.filter((fabric) => {
      if (family !== "all" && fabric.family !== family) return false;
      if (fiber !== "all" && !fabric.blend.some((b) => b.fiber === fiber))
        return false;
      if (pfdOnly && !fabric.pfd) return false;
      if (!q) return true;
      return (
        fabric.name.toLocaleLowerCase(locale === "tr" ? "tr" : "en").includes(q) ||
        formatBlend(fabric.blend, locale).toLocaleLowerCase().includes(q)
      );
    });

    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sort.key === "name") return a.name.localeCompare(b.name, locale) * dir;
      // Rows with no published figure always sink to the bottom.
      const av = sort.key === "gsm" ? a.gsm : a.width?.[0];
      const bv = sort.key === "gsm" ? b.gsm : b.width?.[0];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return (av - bv) * dir;
    });
  }, [query, family, fiber, pfdOnly, sort, locale]);

  const toggleSort = (key: SortKey) =>
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );

  const reset = () => {
    setQuery("");
    setFamily("all");
    setFiber("all");
    setPfdOnly(false);
  };

  const quoteHref = (name: string) =>
    `https://wa.me/${COMPANY.whatsappHref}?text=${encodeURIComponent(
      locale === "tr"
        ? `Merhaba, "${name}" kalitesi için fiyat ve termin bilgisi almak istiyorum.`
        : `Hello, I would like a price and lead time for "${name}".`,
    )}`;

  const sortLabel = (key: SortKey) =>
    sort.key === key ? (sort.dir === "asc" ? "▲" : "▼") : "";

  const ariaSort = (key: SortKey): "ascending" | "descending" | "none" =>
    sort.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : "none";

  return (
    <>
      {/* ── Controls ─────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 -mx-5 border-y border-greige bg-paper/95 px-5 py-4 backdrop-blur-md sm:top-20 sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
          <div className="min-w-[14rem] flex-1">
            <label
              htmlFor="fabric-search"
              className="block font-mono text-[0.6rem] tracking-[0.18em] text-ink-soft uppercase"
            >
              {d.catalog.search}
            </label>
            <input
              id="fabric-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={d.catalog.searchPlaceholder}
              className="mt-2 w-full border-b border-ink bg-transparent py-2 text-base placeholder:text-loom focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="fabric-family"
              className="block font-mono text-[0.6rem] tracking-[0.18em] text-ink-soft uppercase"
            >
              {d.catalog.family}
            </label>
            <select
              id="fabric-family"
              value={family}
              onChange={(e) => setFamily(e.target.value as FamilyId | "all")}
              className="mt-2 border-b border-ink bg-transparent py-2 text-sm focus:outline-none"
            >
              <option value="all">{d.catalog.all}</option>
              {FAMILIES.map((f) => (
                <option key={f.id} value={f.id}>
                  {locale === "tr" ? f.tr : f.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="fabric-fiber"
              className="block font-mono text-[0.6rem] tracking-[0.18em] text-ink-soft uppercase"
            >
              {d.catalog.fiber}
            </label>
            <select
              id="fabric-fiber"
              value={fiber}
              onChange={(e) => setFiber(e.target.value as FiberCode | "all")}
              className="mt-2 border-b border-ink bg-transparent py-2 text-sm focus:outline-none"
            >
              <option value="all">{d.catalog.all}</option>
              {USED_FIBERS.map((code) => (
                <option key={code} value={code}>
                  {FIBERS[code][locale]}
                </option>
              ))}
            </select>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 pb-2 text-sm">
            <input
              type="checkbox"
              checked={pfdOnly}
              onChange={(e) => setPfdOnly(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-brand)]"
            />
            {d.catalog.pfdOnly}
          </label>

          <p
            className="tabular pb-2 font-mono text-[0.68rem] tracking-widest text-ink-soft uppercase"
            aria-live="polite"
          >
            {rows.length} {d.catalog.results}
          </p>
        </div>
      </div>

      {/* ── Rows ─────────────────────────────────────────────── */}
      {rows.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl">{d.catalog.empty}</p>
          <p className="mt-3 text-sm text-ink-soft">{d.catalog.emptyHint}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-7 border border-ink px-6 py-3 font-mono text-[0.68rem] tracking-widest uppercase transition-colors hover:bg-ink hover:text-paper"
          >
            {d.catalog.reset}
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <table className="mt-10 hidden w-full border-collapse text-left lg:table">
            <thead>
              <tr className="border-b border-ink">
                <th scope="col" aria-sort={ariaSort("name")} className="py-3 pr-4">
                  <button
                    type="button"
                    onClick={() => toggleSort("name")}
                    className="font-mono text-[0.62rem] tracking-[0.18em] text-ink-soft uppercase transition-colors hover:text-ink"
                  >
                    {d.catalog.colName} {sortLabel("name")}
                  </button>
                </th>
                <th scope="col" className="py-3 pr-4">
                  <span className="font-mono text-[0.62rem] tracking-[0.18em] text-ink-soft uppercase">
                    {d.catalog.colBlend}
                  </span>
                </th>
                <th
                  scope="col"
                  aria-sort={ariaSort("gsm")}
                  className="py-3 pr-4 text-right"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort("gsm")}
                    className="font-mono text-[0.62rem] tracking-[0.18em] text-ink-soft uppercase transition-colors hover:text-ink"
                  >
                    {d.catalog.colGsm} {sortLabel("gsm")}
                  </button>
                </th>
                <th
                  scope="col"
                  aria-sort={ariaSort("width")}
                  className="py-3 pr-10 text-right"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort("width")}
                    className="font-mono text-[0.62rem] tracking-[0.18em] text-ink-soft uppercase transition-colors hover:text-ink"
                  >
                    {d.catalog.colWidth} {sortLabel("width")}
                  </button>
                </th>
                <th scope="col" className="py-3 pr-4">
                  <span className="font-mono text-[0.62rem] tracking-[0.18em] text-ink-soft uppercase">
                    {d.catalog.colFinish}
                  </span>
                </th>
                <th scope="col" className="py-3">
                  <span className="sr-only">{d.catalog.askAbout}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((fabric) => (
                <tr
                  key={fabric.id}
                  className="border-b border-greige transition-colors duration-200 hover:bg-ecru"
                >
                  <th scope="row" className="py-4 pr-4 text-base font-normal">
                    {fabric.name}
                  </th>
                  <td className="py-4 pr-4 text-sm text-ink-soft">
                    {formatBlend(fabric.blend, locale)}
                  </td>
                  <td className="tabular py-4 pr-4 text-right font-mono text-sm">
                    {fabric.gsm ? `${fabric.gsm} g/m²` : "—"}
                  </td>
                  <td className="tabular py-4 pr-10 text-right font-mono text-sm">
                    {formatWidth(fabric.width)}
                  </td>
                  <td className="py-4 pr-4">
                    {fabric.pfd ? (
                      <span
                        title={d.catalog.pfdFull}
                        className="border border-brand px-2 py-0.5 font-mono text-[0.6rem] tracking-widest text-brand uppercase"
                      >
                        {d.catalog.pfd}
                      </span>
                    ) : (
                      <span className="font-mono text-[0.6rem] tracking-widest text-loom uppercase">
                        {d.catalog.greige}
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <a
                      href={quoteHref(fabric.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[0.62rem] tracking-widest text-ink-soft uppercase underline-offset-4 transition-colors hover:text-brand hover:underline"
                    >
                      {locale === "tr" ? "Teklif" : "Quote"}
                      <span className="sr-only"> — {fabric.name}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="mt-8 lg:hidden">
            {rows.map((fabric) => (
              <li key={fabric.id} className="border-b border-greige py-5">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-base leading-snug">{fabric.name}</h2>
                  {fabric.pfd && (
                    <span className="shrink-0 border border-brand px-2 py-0.5 font-mono text-[0.55rem] tracking-widest text-brand uppercase">
                      {d.catalog.pfd}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-ink-soft">
                  {formatBlend(fabric.blend, locale)}
                </p>
                <div className="tabular mt-3 flex items-center gap-5 font-mono text-xs text-ink-soft">
                  <span>{fabric.gsm ? `${fabric.gsm} g/m²` : "—"}</span>
                  <span>{formatWidth(fabric.width)}</span>
                  <a
                    href={quoteHref(fabric.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto tracking-widest text-brand uppercase underline underline-offset-4"
                  >
                    {locale === "tr" ? "Teklif" : "Quote"}
                    <span className="sr-only"> — {fabric.name}</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-10 max-w-2xl text-sm leading-relaxed text-ink-soft">
        {d.catalog.note}
      </p>
    </>
  );
}
