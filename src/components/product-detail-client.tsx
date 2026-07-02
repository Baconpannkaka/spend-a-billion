"use client";

import { ProductMedia } from "@/components/product-media";
import { QuantityControl } from "@/components/quantity-control";
import { useCatalog } from "@/catalog/use-catalog";
import { useGame } from "@/context/game-context";
import { useToast } from "@/context/toast-context";
import { formatMoneyFromSek } from "@/lib/format";
import type { GameMode } from "@/types";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export function ProductDetailClient() {
  const params = useSearchParams();
  const modeParam = params.get("mode");
  const mode: GameMode = modeParam === "everyday" ? "everyday" : "luxury";
  const productId = params.get("id") ?? "";
  const { catalog, state } = useCatalog(mode);
  const { addItem, currency, remaining, hasStarted, mode: activeMode } = useGame();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const product = useMemo(() => catalog?.products.find((entry) => entry.id === productId), [catalog, productId]);

  if (state === "loading" || !catalog) return <div className="shell min-h-[65vh] py-12"><div className="h-[32rem] animate-pulse rounded-xl bg-white/5" /></div>;
  if (!product) return <section className="bg-[var(--paper)] py-24 text-center text-[var(--ink)]"><div className="shell max-w-xl"><h1 className="font-display text-5xl">Produkten hittades inte</h1><p className="mt-4 text-black/55">Produkt-id:t finns inte i den valda katalogen.</p><Link href="/shop" className="primary-button mt-6">Till shoppen</Link></div></section>;

  const selectedProduct = product;
  const canBuyHere = hasStarted && activeMode === selectedProduct.mode;
  const affordable = canBuyHere ? Math.floor(remaining / selectedProduct.priceSek) : 0;

  function add() {
    if (!canBuyHere) { showToast("Starta ett spel i samma shoppingläge först.", "error"); return; }
    const result = addItem(selectedProduct.id, quantity);
    if (result.ok) showToast(`${quantity} × ${selectedProduct.name} lades i varukorgen.`, "success");
    else showToast(`Budgeten saknar ${formatMoneyFromSek(result.missing, currency)}.`, "error");
  }

  return <section className="bg-[var(--paper)] py-8 text-[var(--ink)]"><div className="shell"><Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-black/55 hover:text-black"><ArrowLeft className="h-4 w-4" /> Tillbaka till shoppen</Link><div className="mt-5 grid gap-7 lg:grid-cols-[1.05fr_.95fr] lg:items-start"><div className="aspect-[4/3] overflow-hidden rounded-xl bg-black"><ProductMedia product={product} /></div><div className="lg:pt-2"><p className="eyebrow text-[var(--gold-dark)]">{product.categoryLabel} · {product.subcategoryLabel}</p><h1 className="mt-2 font-display text-5xl leading-[.95] md:text-6xl">{product.name}</h1>{product.brand && <p className="mt-3 text-sm font-semibold text-black/45">{product.brand}</p>}<p className="mt-5 font-display text-3xl">{formatMoneyFromSek(product.priceSek, currency)}</p><p className="mt-5 text-sm leading-7 text-black/60">{product.description}</p>{product.collectible && <dl className="mt-5 grid grid-cols-2 gap-2 rounded-lg bg-white p-4 text-sm"><div><dt className="text-black/40">Franchise</dt><dd className="font-semibold">{product.collectible.franchise}</dd></div><div><dt className="text-black/40">Set</dt><dd className="font-semibold">{product.collectible.set}</dd></div><div><dt className="text-black/40">Gradering</dt><dd className="font-semibold">{product.collectible.gradingCompany} {product.collectible.grade}</dd></div><div><dt className="text-black/40">Kortnummer</dt><dd className="font-semibold">{product.collectible.cardNumber}</dd></div></dl>}<ul className="mt-5 grid gap-2 text-sm text-black/55">{product.facts.map((fact) => <li key={fact} className="rounded-md border border-black/10 bg-white px-3 py-2">{fact}</li>)}</ul><div className="mt-6 flex flex-wrap items-center gap-3"><QuantityControl value={quantity} onChange={setQuantity} max={Math.max(1, affordable)} /><button type="button" onClick={add} disabled={!canBuyHere || affordable < 1} className="primary-button disabled:opacity-35"><ShoppingBag className="h-4 w-4" /> Lägg till i samlingen</button></div><p className="mt-3 text-xs text-black/40">{canBuyHere ? (affordable > 0 ? `Du har råd med ${affordable.toLocaleString("sv-SE")} till.` : "Produkten ryms inte i återstående budget.") : "Starta rätt shoppingläge för att köpa produkten."}</p></div></div></div></section>;
}
