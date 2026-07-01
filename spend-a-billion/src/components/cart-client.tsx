"use client";

import { LegalNotice } from "@/components/legal-notice";
import { ProductMedia } from "@/components/product-media";
import { QuantityControl } from "@/components/quantity-control";
import { useGame } from "@/context/game-context";
import { useToast } from "@/context/toast-context";
import { productById } from "@/data/products";
import { formatPercent, formatSek } from "@/lib/format";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";

export function CartClient() {
  const { cart, total, remaining, spentRatio, totalQuantity, updateQuantity, removeItem, hydrated } = useGame();
  const { showToast } = useToast();

  if (!hydrated) {
    return <div className="shell min-h-[60vh] py-16"><div className="h-64 animate-pulse rounded-2xl bg-white/5 motion-reduce:animate-none" /></div>;
  }

  if (cart.length === 0) {
    return (
      <section className="bg-[var(--paper)] py-20 text-[var(--ink)]">
        <div className="shell grid min-h-[58vh] place-items-center">
          <div className="max-w-xl text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-black/5"><ShoppingBag className="h-8 w-8 text-black/45" /></div>
            <h1 className="mt-7 font-display text-6xl">Din miljard är orörd</h1>
            <p className="mt-4 text-lg leading-8 text-black/55">Varukorgen är tom. Det är imponerande disciplin, men inte riktigt poängen med spelet.</p>
            <Link href="/shop" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--ink)] px-6 font-semibold text-white focus-ring">Börja shoppa <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--paper)] py-12 text-[var(--ink)]">
      <div className="shell">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold-dark)]">Din fantasivarukorg</p>
        <h1 className="mt-3 font-display text-6xl md:text-8xl">Bra val. Ekonomiskt tveksamt.</h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-start">
          <div className="space-y-4">
            {cart.map((item) => {
              const product = productById.get(item.productId);
              if (!product) return null;
              return (
                <article key={item.productId} className="grid overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm sm:grid-cols-[180px_1fr]">
                  <div className="min-h-44"><ProductMedia product={product} compact /></div>
                  <div className="flex flex-col justify-between gap-5 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link href={`/produkt/${product.slug}`} className="font-display text-3xl leading-none hover:underline focus-ring">{product.name}</Link>
                        <p className="mt-2 text-sm text-black/50">{formatSek(product.priceSek)} per styck</p>
                      </div>
                      <button type="button" onClick={() => { removeItem(product.id); showToast(`${product.name} togs bort.`, "info"); }} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/10 text-black/45 hover:bg-red-50 hover:text-red-700 focus-ring" aria-label={`Ta bort ${product.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <QuantityControl
                        quantity={item.quantity}
                        onDecrease={() => updateQuantity(product.id, item.quantity - 1)}
                        onIncrease={() => {
                          const result = updateQuantity(product.id, item.quantity + 1);
                          if (!result.ok) showToast(`Du saknar ${formatSek(result.missing)} för ett exemplar till.`, "error");
                        }}
                        label={`Antal ${product.name}`}
                      />
                      <div className="text-right">
                        <p className="text-xs text-black/45">Delsumma</p>
                        <p className="font-display text-3xl">{formatSek(product.priceSek * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="sticky top-24 space-y-5">
            <div className="rounded-2xl bg-[var(--ink)] p-6 text-white shadow-xl">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Sammanställning</p>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-white/50">Antal saker</dt><dd className="font-semibold">{totalQuantity}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-white/50">Totalt</dt><dd className="font-semibold">{formatSek(total)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-white/50">Kvar</dt><dd className="font-semibold text-[var(--gold)]">{formatSek(remaining)}</dd></div>
              </dl>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-[var(--gold)]" style={{ width: `${Math.min(100, spentRatio * 100)}%` }} /></div>
              <p className="mt-2 text-right text-xs text-white/45">{formatPercent(spentRatio)} spenderat</p>
              <Link href="/kassa" className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-5 font-bold text-black hover:bg-[#e2c887] focus-ring">Gå till fantasikassan <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/shop" className="mt-3 flex min-h-11 w-full items-center justify-center rounded-full border border-white/15 px-5 text-sm font-semibold hover:bg-white/5 focus-ring">Fortsätt shoppa</Link>
            </div>
            <LegalNotice compact />
          </aside>
        </div>
      </div>
    </section>
  );
}
