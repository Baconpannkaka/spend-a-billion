"use client";

import { ProductMedia } from "@/components/product-media";
import { QuantityControl } from "@/components/quantity-control";
import { useGame } from "@/context/game-context";
import { useToast } from "@/context/toast-context";
import { formatMoneyFromSek } from "@/lib/format";
import type { Product } from "@/types";
import { ExternalLink, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, currency, remaining } = useGame();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const affordable = Math.floor(remaining / product.priceSek);

  function add() {
    const result = addItem(product.id, quantity);
    if (result.ok) showToast(`${quantity} × ${product.name} lades i varukorgen.`, "success");
    else showToast(`Budgeten saknar ${formatMoneyFromSek(result.missing, currency)}.`, "error");
  }

  return (
    <article className="product-card">
      <Link href={`/produkt/?mode=${product.mode}&id=${product.id}`} className="focus-ring block aspect-[4/3] overflow-hidden bg-[#1a1a17]" aria-label={`Visa ${product.name}`}><ProductMedia product={product} compact /></Link>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3"><p className="truncate text-[10px] font-bold uppercase tracking-[.13em] text-[var(--gold-dark)]">{product.categoryLabel} · {product.subcategoryLabel}</p>{product.collectible && <span className="rounded bg-black px-1.5 py-0.5 text-[9px] font-bold text-white">{product.collectible.gradingCompany} {product.collectible.grade}</span>}</div>
        <Link href={`/produkt/?mode=${product.mode}&id=${product.id}`} className="mt-2 block"><h2 className="line-clamp-2 min-h-[2.8rem] font-display text-[1.35rem] leading-[1.05]">{product.name}</h2></Link>
        <p className="mt-2 text-lg font-semibold">{formatMoneyFromSek(product.priceSek, currency)}</p>
        <div className="mt-3 flex items-center gap-2"><QuantityControl value={quantity} onChange={setQuantity} compact max={Math.max(1, affordable)} /><button type="button" disabled={affordable < 1} onClick={add} className="focus-ring inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-[var(--ink)] px-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-35"><ShoppingBag className="h-3.5 w-3.5" /> Lägg till</button><Link href={`/produkt/?mode=${product.mode}&id=${product.id}`} aria-label="Öppna produkt" className="focus-ring grid h-8 w-8 place-items-center rounded-md border border-black/15"><ExternalLink className="h-3.5 w-3.5" /></Link></div>
        <p className="mt-2 text-[11px] text-black/40">{affordable > 0 ? `Du har råd med ${affordable.toLocaleString("sv-SE")} till.` : "Utanför återstående budget."}</p>
      </div>
    </article>
  );
}
