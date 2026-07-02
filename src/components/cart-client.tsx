"use client";

import { BudgetBar } from "@/components/budget-bar";
import { ProductMedia } from "@/components/product-media";
import { QuantityControl } from "@/components/quantity-control";
import { useGame } from "@/context/game-context";
import { useToast } from "@/context/toast-context";
import { formatMoneyFromSek, formatPercent } from "@/lib/format";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";

export function CartClient() {
  const { hydrated, catalogReady, cart, products, currency, total, remaining, spentRatio, updateQuantity, removeItem } = useGame();
  const { showToast } = useToast();
  const productMap = new Map(products.map((product) => [product.id, product]));
  const entries = cart.flatMap((item) => {
    const product = productMap.get(item.productId);
    return product ? [{ item, product, subtotal: product.priceSek * item.quantity }] : [];
  });

  if (!hydrated || (cart.length > 0 && !catalogReady)) return <div className="shell min-h-[65vh] py-12"><div className="h-72 animate-pulse rounded-xl bg-white/5" /></div>;
  if (entries.length === 0) return <section className="bg-[var(--paper)] py-24 text-center text-[var(--ink)]"><div className="shell max-w-xl"><h1 className="font-display text-5xl">Varukorgen väntar</h1><p className="mt-4 text-black/55">Du har ännu inte lagt till något. Det är ovanligt återhållsamt.</p><Link href="/shop" className="primary-button mt-6"><ArrowLeft className="h-4 w-4" /> Till shoppen</Link></div></section>;

  return (
    <section className="bg-[var(--paper)] py-8 text-[var(--ink)]"><div className="shell">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><p className="eyebrow text-[var(--gold-dark)]">Din fantasivarukorg</p><h1 className="mt-2 font-display text-5xl">Överblick före kassan</h1></div><Link href="/shop" className="secondary-button"><ArrowLeft className="h-4 w-4" /> Fortsätt shoppa</Link></div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_330px] xl:items-start">
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
          <div className="hidden grid-cols-[72px_1fr_130px_130px_42px] gap-4 border-b border-black/10 bg-black/[.025] px-4 py-3 text-[10px] font-bold uppercase tracking-[.13em] text-black/40 md:grid"><span>Produkt</span><span></span><span>Antal</span><span className="text-right">Delsumma</span><span></span></div>
          {entries.map(({ item, product, subtotal }) => <article key={product.id} className="grid gap-3 border-b border-black/8 p-4 last:border-0 md:grid-cols-[72px_1fr_130px_130px_42px] md:items-center">
            <div className="h-16 overflow-hidden rounded-md bg-black"><ProductMedia product={product} compact /></div>
            <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--gold-dark)]">{product.categoryLabel} · {product.subcategoryLabel}</p><Link href={`/produkt/?mode=${product.mode}&id=${product.id}`} className="mt-1 block truncate font-display text-xl">{product.name}</Link><p className="mt-1 text-xs text-black/45">{formatMoneyFromSek(product.priceSek, currency)} / st</p></div>
            <QuantityControl value={item.quantity} onChange={(value) => { const result = updateQuantity(product.id, value); if (!result.ok) showToast(`Budgeten saknar ${formatMoneyFromSek(result.missing, currency)}.`, "error"); }} compact max={100_000} />
            <p className="font-display text-xl md:text-right">{formatMoneyFromSek(subtotal, currency)}</p>
            <button type="button" aria-label={`Ta bort ${product.name}`} onClick={() => removeItem(product.id)} className="focus-ring grid h-9 w-9 place-items-center rounded-md border border-black/10 text-black/45 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
          </article>)}
        </div>
        <aside className="rounded-xl bg-[var(--ink)] p-5 text-white xl:sticky xl:top-24"><h2 className="font-display text-3xl">Summering</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-3 text-white/55"><span>Totalt</span><strong className="text-white">{formatMoneyFromSek(total, currency)}</strong></div><div className="flex justify-between gap-3 text-white/55"><span>Kvar</span><strong className="text-[var(--gold)]">{formatMoneyFromSek(remaining, currency)}</strong></div><div className="flex justify-between gap-3 text-white/55"><span>Andel använd</span><strong className="text-white">{formatPercent(spentRatio)}</strong></div></div><div className="mt-5"><BudgetBar /></div><Link href="/kassa" className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--gold)] px-4 text-sm font-bold text-black">Till fantasikassan <ArrowRight className="h-4 w-4" /></Link></aside>
      </div>
    </div></section>
  );
}
