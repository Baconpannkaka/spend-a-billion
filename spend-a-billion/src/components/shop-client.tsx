"use client";

import { BudgetBar } from "@/components/budget-bar";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ProductCard } from "@/components/product-card";
import { useGame } from "@/context/game-context";
import { useToast } from "@/context/toast-context";
import { categoryLabels, products } from "@/data/products";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { ProductCategory } from "@/types";

type SortOption = "recommended" | "cheap" | "expensive" | "name";

export function ShopClient() {
  const { remaining, resetGame, introShown, setIntroShown, hydrated } = useGame();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "alla">("alla");
  const [sort, setSort] = useState<SortOption>("recommended");
  const [affordableOnly, setAffordableOnly] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("sv");
    const result = products.filter((product) => {
      const matchesSearch = !query || `${product.name} ${product.brand ?? ""} ${product.shortDescription}`.toLocaleLowerCase("sv").includes(query);
      const matchesCategory = category === "alla" || product.category === category;
      const matchesBudget = !affordableOnly || product.priceSek <= remaining;
      return matchesSearch && matchesCategory && matchesBudget;
    });

    return [...result].sort((a, b) => {
      if (sort === "cheap") return a.priceSek - b.priceSek;
      if (sort === "expensive") return b.priceSek - a.priceSek;
      if (sort === "name") return a.name.localeCompare(b.name, "sv");
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [search, category, sort, affordableOnly, remaining]);

  return (
    <>
      <section className="border-b border-white/10 py-12">
        <div className="shell">
          {hydrated && !introShown && (
            <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-5 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-3xl text-white">Din miljard är redo.</p>
                <p className="mt-1 text-sm text-white/60">Lägg till vad du vill. Vi ser till att du aldrig kan spendera mer än du har.</p>
              </div>
              <button type="button" onClick={() => setIntroShown(true)} className="min-h-11 shrink-0 rounded-full bg-[var(--gold)] px-5 font-bold text-black focus-ring">Jag är redo</button>
            </div>
          )}
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">40 saker du absolut behöver</p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="font-display text-6xl leading-none text-white md:text-8xl">Shoppa miljardärslivet</h1>
              <p className="mt-4 max-w-2xl text-white/55">Priserna är ungefärliga underhållningsvärden. Smaken däremot är helt och hållet din.</p>
            </div>
            <button type="button" onClick={() => setConfirmOpen(true)} className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-white/15 px-4 text-sm text-white/70 hover:bg-white/5 hover:text-white focus-ring">
              <RotateCcw className="h-4 w-4" /> Återställ spelet
            </button>
          </div>
        </div>
      </section>

      <div className="sticky top-18 z-40 border-b border-white/10 bg-[rgba(12,12,11,.94)] py-3 backdrop-blur-xl">
        <div className="shell"><BudgetBar compact /></div>
      </div>

      <section className="bg-[var(--paper)] py-10 text-[var(--ink)]">
        <div className="shell">
          <div className="rounded-2xl border border-black/10 bg-white/55 p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1.4fr_.8fr_.8fr_auto]">
              <label className="relative block">
                <span className="sr-only">Sök produkter</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/40" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Sök Bugatti, yacht, klocka…" className="h-12 w-full rounded-xl border border-black/10 bg-white pl-12 pr-4 outline-none focus:border-[var(--gold-dark)] focus:ring-2 focus:ring-[var(--gold)]/25" />
              </label>
              <label>
                <span className="sr-only">Kategori</span>
                <select value={category} onChange={(event) => setCategory(event.target.value as ProductCategory | "alla")} className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none focus:border-[var(--gold-dark)] focus:ring-2 focus:ring-[var(--gold)]/25">
                  <option value="alla">Alla kategorier</option>
                  {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label>
                <span className="sr-only">Sortering</span>
                <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none focus:border-[var(--gold-dark)] focus:ring-2 focus:ring-[var(--gold)]/25">
                  <option value="recommended">Rekommenderat</option>
                  <option value="cheap">Billigast först</option>
                  <option value="expensive">Dyrast först</option>
                  <option value="name">Namn</option>
                </select>
              </label>
              <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold">
                <input type="checkbox" checked={affordableOnly} onChange={(event) => setAffordableOnly(event.target.checked)} className="h-4 w-4 accent-[var(--gold-dark)]" />
                Jag har råd
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-black/50">{filtered.length} produkter</p>
            <div className="flex items-center gap-2 text-sm text-black/45"><SlidersHorizontal className="h-4 w-4" /> Filtrera utan att tappa miljardärskänslan</div>
          </div>

          {filtered.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-black/20 bg-white/50 px-6 py-16 text-center">
              <h2 className="font-display text-4xl">Inget lyxigt hittades</h2>
              <p className="mt-2 text-black/55">Prova en annan sökning eller visa även sådant du inte längre har råd med.</p>
              <button type="button" onClick={() => { setSearch(""); setCategory("alla"); setAffordableOnly(false); }} className="mt-5 rounded-full bg-[var(--ink)] px-5 py-3 font-semibold text-white focus-ring">Rensa filter</button>
            </div>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Börja om från en hel miljard?"
        description="Din varukorg, ditt namn och ditt färdiga resultat raderas från den här webbläsaren."
        confirmLabel="Ja, återställ allt"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => { resetGame(); showToast("Spelet är återställt. Din miljard är hel igen.", "success"); }}
      />
    </>
  );
}
