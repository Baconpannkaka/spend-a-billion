"use client";

import { BudgetBar } from "@/components/budget-bar";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ProductCard } from "@/components/product-card";
import { useGame } from "@/context/game-context";
import { CATALOG_PAGE_SIZE } from "@/lib/constants";
import { filterAndSortProducts, type CatalogSort } from "@/lib/catalog-filter";
import { Search, SlidersHorizontal, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export function ShopClient() {
  const router = useRouter();
  const { hydrated, hasStarted, catalogReady, mode, products, remaining, resetGame, budgetSourceLabel } = useGame();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [subcategory, setSubcategory] = useState("all");
  const [sort, setSort] = useState<CatalogSort>("recommended");
  const [affordableOnly, setAffordableOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const categories = useMemo(() => {
    const map = new Map<string, { id: string; label: string; subcategories: Map<string, string> }>();
    for (const product of products) {
      const current = map.get(product.categoryId) ?? { id: product.categoryId, label: product.categoryLabel, subcategories: new Map<string, string>() };
      current.subcategories.set(product.subcategoryId, product.subcategoryLabel);
      map.set(product.categoryId, current);
    }
    return Array.from(map.values());
  }, [products]);

  const subcategories = useMemo(() => category === "all" ? [] : Array.from(categories.find((item) => item.id === category)?.subcategories.entries() ?? []), [categories, category]);


  const filtered = useMemo(() => filterAndSortProducts(products, {
    search,
    categoryId: category,
    subcategoryId: subcategory,
    affordableOnly,
    remainingBudgetSek: remaining,
    sort,
  }), [products, search, category, subcategory, affordableOnly, remaining, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / CATALOG_PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const visible = filtered.slice((safePage - 1) * CATALOG_PAGE_SIZE, safePage * CATALOG_PAGE_SIZE);

  if (!hydrated || (hasStarted && !catalogReady)) return <div className="shell min-h-[70vh] py-12"><div className="h-28 animate-pulse rounded-xl bg-white/5" /><div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-72 animate-pulse rounded-xl bg-white/5" />)}</div></div>;
  if (!hasStarted) return <section className="bg-[var(--paper)] py-24 text-center text-[var(--ink)]"><div className="shell max-w-xl"><h1 className="font-display text-5xl">Välj ett shoppingläge först</h1><p className="mt-4 text-black/55">Vi behöver veta vilken katalog och budget du vill använda.</p><Link href="/" className="primary-button mt-6">Till startsidan</Link></div></section>;

  return (
    <>
      <section className="border-b border-white/10 py-7"><div className="shell flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="eyebrow">{mode === "luxury" ? "Miljardärsläge" : "Vardagsläge"} · 10 000 produkter</p><h1 className="mt-2 font-display text-4xl text-white md:text-5xl">{mode === "luxury" ? "Shoppa utan rimliga gränser" : "Hur långt räcker din kassa?"}</h1><p className="mt-2 text-sm text-white/45">{budgetSourceLabel}</p></div><button type="button" onClick={() => setConfirmOpen(true)} className="secondary-dark-button"><RotateCcw className="h-4 w-4" /> Nytt spel</button></div></section>
      <div className="sticky top-16 z-40 border-b border-white/10 bg-[rgba(12,12,11,.96)] py-2.5 backdrop-blur-xl"><div className="shell"><BudgetBar /></div></div>
      <section className="bg-[var(--paper)] py-7 text-[var(--ink)]"><div className="shell">
        <div className="filter-panel"><label className="relative block lg:col-span-2"><span className="sr-only">Sök produkter</span><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder={mode === "luxury" ? "Sök Bugatti, PSA 10, yacht…" : "Sök mobil, mat, soffa…"} className="field pl-10" /></label><label><span className="sr-only">Kategori</span><select value={category} onChange={(event) => { setCategory(event.target.value); setSubcategory("all"); setPage(1); }} className="field"><option value="all">Alla kategorier</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><label><span className="sr-only">Underkategori</span><select value={subcategory} onChange={(event) => { setSubcategory(event.target.value); setPage(1); }} disabled={category === "all"} className="field disabled:opacity-45"><option value="all">Alla underkategorier</option>{subcategories.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label><label><span className="sr-only">Sortering</span><select value={sort} onChange={(event) => { setSort(event.target.value as CatalogSort); setPage(1); }} className="field"><option value="recommended">Rekommenderat</option><option value="cheap">Billigast först</option><option value="expensive">Dyrast först</option><option value="name">Namn</option></select></label><label className="flex h-10 items-center gap-2 rounded-md border border-black/10 bg-white px-3 text-xs font-semibold"><input type="checkbox" checked={affordableOnly} onChange={(event) => { setAffordableOnly(event.target.checked); setPage(1); }} className="h-4 w-4 accent-black" /> Visa bara sådant jag har råd med</label></div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-black/50"><strong className="text-black">{filtered.length.toLocaleString("sv-SE")}</strong> träffar · sida {safePage} av {pages}</p><p className="flex items-center gap-2 text-xs text-black/40"><SlidersHorizontal className="h-4 w-4" /> Katalogen laddas 48 produkter åt gången</p></div>
        {visible.length > 0 ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">{visible.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="mt-6 rounded-xl border border-dashed border-black/20 bg-white/60 px-6 py-14 text-center"><h2 className="font-display text-3xl">Inga produkter hittades</h2><p className="mt-2 text-sm text-black/50">Rensa något filter eller prova en bredare sökning.</p></div>}
        {pages > 1 && <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Sidnavigering"><button type="button" disabled={safePage <= 1} onClick={() => { setPage(safePage - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="page-button"><ChevronLeft className="h-4 w-4" /> Föregående</button><span className="px-3 text-sm font-semibold">{safePage} / {pages}</span><button type="button" disabled={safePage >= pages} onClick={() => { setPage(safePage + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="page-button">Nästa <ChevronRight className="h-4 w-4" /></button></nav>}
      </div></section>
      <ConfirmDialog open={confirmOpen} title="Starta ett nytt spel?" description="Varukorgen och det färdiga resultatet rensas. Din valda valuta ligger kvar." confirmLabel="Ja, börja om" onClose={() => setConfirmOpen(false)} onConfirm={() => { resetGame(); router.push("/"); }} />
    </>
  );
}
