"use client";

import { ProductMedia } from "@/components/product-media";
import { useGame } from "@/context/game-context";
import { useToast } from "@/context/toast-context";
import { categoryLabels } from "@/data/products";
import { formatSek } from "@/lib/format";
import type { Product } from "@/types";
import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, remaining } = useGame();
  const { showToast } = useToast();
  const affordable = remaining >= product.priceSek;

  const add = () => {
    const result = addItem(product.id, 1);
    if (result.ok) showToast(`${product.name} lades till i samlingen.`, "success");
    else showToast(`Det där spräckte budgeten. Du saknar ${formatSek(result.missing)}.`, "error");
  };

  return (
    <article className="group overflow-hidden rounded-[1.25rem] border border-black/10 bg-[var(--paper)] shadow-[0_16px_50px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(0,0,0,0.2)]">
      <Link href={`/produkt/${product.slug}`} className="block overflow-hidden focus-ring">
        <div className="aspect-[4/3] transition duration-500 group-hover:scale-[1.015]">
          <ProductMedia product={product} compact />
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.14em] text-black/45">
          <span>{categoryLabels[product.category]}</span>
          {product.featured && <span className="text-[var(--gold-dark)]">Utvald</span>}
        </div>
        <Link href={`/produkt/${product.slug}`} className="mt-3 flex items-start justify-between gap-4 focus-ring">
          <div>
            <h2 className="font-display text-2xl leading-tight text-[var(--ink)]">{product.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/60">{product.shortDescription}</p>
          </div>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-black/45 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </Link>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/10 pt-4">
          <p className="font-semibold text-[var(--ink)]">{formatSek(product.priceSek)}</p>
          <button
            type="button"
            onClick={add}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--ink)] px-4 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-45 focus-ring"
            aria-label={`Lägg till ${product.name}`}
            title={affordable ? "Lägg till i samlingen" : "För dyr för återstående budget"}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Lägg till
          </button>
        </div>
      </div>
    </article>
  );
}
