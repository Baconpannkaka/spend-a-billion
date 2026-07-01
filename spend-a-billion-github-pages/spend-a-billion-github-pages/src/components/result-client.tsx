"use client";

import { useGame } from "@/context/game-context";
import { useToast } from "@/context/toast-context";
import { categoryLabels, productById, products } from "@/data/products";
import { getAchievements, getResultVerdict } from "@/lib/achievements";
import { getBudgetSourceLabel } from "@/lib/budget";
import { getCartTotal, getSpentRatio, getTotalQuantity } from "@/lib/cart";
import { formatMoneyFromSek, formatNumber, formatPercent } from "@/lib/format";
import { decodeShareData, encodeShareData } from "@/lib/share";
import type { CompletedResult, ProductCategory } from "@/types";
import { Award, Copy, Download, ExternalLink, RefreshCcw, Share2, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

function createShareText(result: CompletedResult, total: number) {
  const largest = result.cart
    .flatMap((item) => {
      const product = productById.get(item.productId);
      return product ? [{ ...item, product, subtotal: product.priceSek * item.quantity }] : [];
    })
    .sort((a, b) => b.subtotal - a.subtotal)[0];
  const highlight = largest ? `${largest.quantity} ${largest.product.name}` : "några riktigt dyra saker";
  return `${result.name} spelade “${getBudgetSourceLabel(result.budgetSource)}” och köpte bland annat ${highlight}. Totalt försvann ${formatMoneyFromSek(total, result.currency)}. Kan du spendera bättre?`;
}

export function ResultClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { completedResult, hydrated, replaceWithResult, resetGame } = useGame();
  const { showToast } = useToast();
  const haul = params.get("haul");
  const shared = useMemo(() => (haul ? decodeShareData(haul, products) : null), [haul]);
  const invalidShared = Boolean(haul && !shared);
  const result: CompletedResult | null = shared
    ? {
        name: shared.name,
        cart: shared.cart,
        completedAt: shared.timestamp ? new Date(shared.timestamp).toISOString() : "",
        startingBudgetSek: shared.startingBudgetSek,
        currency: shared.currency,
        budgetSource: shared.budgetSource,
      }
    : completedResult;
  const readOnly = Boolean(shared);

  if (!hydrated && !haul) return <div className="shell min-h-[65vh] py-16"><div className="h-96 animate-pulse rounded-2xl bg-white/5 motion-reduce:animate-none" /></div>;

  if (invalidShared) {
    return (
      <section className="bg-[var(--paper)] py-20 text-center text-[var(--ink)]">
        <div className="shell max-w-xl">
          <h1 className="font-display text-6xl">Den här lyxlänken gick sönder</h1>
          <p className="mt-4 leading-7 text-black/55">Länken är trasig, ofullständig eller innehåller data som inte går att använda säkert.</p>
          <Link href="/" className="mt-7 inline-flex rounded-full bg-[var(--ink)] px-6 py-3 font-semibold text-white focus-ring">Skapa din egen förmögenhet</Link>
        </div>
      </section>
    );
  }

  if (!result || result.cart.length === 0) {
    return (
      <section className="bg-[var(--paper)] py-20 text-center text-[var(--ink)]">
        <div className="shell max-w-xl">
          <h1 className="font-display text-6xl">Inget färdigt fantasiköp ännu</h1>
          <p className="mt-4 leading-7 text-black/55">Genomför köpet i fantasikassan så skapar vi din exklusiva sammanställning.</p>
          <Link href="/shop" className="mt-7 inline-flex rounded-full bg-[var(--ink)] px-6 py-3 font-semibold text-white focus-ring">Till shoppen</Link>
        </div>
      </section>
    );
  }

  const finalResult = result;
  const entries = finalResult.cart.flatMap((item) => {
    const product = productById.get(item.productId);
    return product ? [{ item, product, subtotal: product.priceSek * item.quantity }] : [];
  }).sort((a, b) => b.subtotal - a.subtotal);
  const total = getCartTotal(finalResult.cart, products);
  const remaining = Math.max(0, finalResult.startingBudgetSek - total);
  const ratio = getSpentRatio(finalResult.cart, products, finalResult.startingBudgetSek);
  const totalQuantity = getTotalQuantity(finalResult.cart);
  const achievements = getAchievements(finalResult.cart, products, finalResult.startingBudgetSek);
  const sourceLabel = getBudgetSourceLabel(finalResult.budgetSource);
  const categories = entries.reduce<Record<ProductCategory, number>>((acc, entry) => {
    acc[entry.product.category] += entry.subtotal;
    return acc;
  }, { bilar: 0, klockor: 0, flyg: 0, yachter: 0, fastigheter: 0, samlarobjekt: 0 });
  const shareCode = encodeShareData(finalResult.name, finalResult.cart, finalResult.startingBudgetSek, finalResult.currency, finalResult.budgetSource, finalResult.completedAt ? new Date(finalResult.completedAt).getTime() : 0);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?haul=${shareCode}` : `?haul=${shareCode}`;
  const shareText = createShareText(finalResult, total);

  async function copyLink() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      showToast("Delningslänken är kopierad.", "success");
    } catch {
      showToast("Länken kunde inte kopieras automatiskt. Markera adressen i webbläsaren i stället.", "error");
    }
  }

  async function shareResult() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Mitt Spend a Billion-resultat", text: shareText, url: shareUrl });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copyLink();
  }

  function downloadImage() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1500;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#11110f";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#d3b875";
    context.lineWidth = 3;
    context.strokeRect(54, 54, canvas.width - 108, canvas.height - 108);
    context.fillStyle = "#d3b875";
    context.font = "700 28px Arial";
    context.fillText("SPEND A BILLION", 90, 125);
    context.fillStyle = "#f5f1e8";
    context.font = "700 72px Georgia";
    context.fillText(finalResult.name.slice(0, 24), 90, 235);
    context.fillStyle = "#aaa59b";
    context.font = "24px Arial";
    context.fillText(sourceLabel.slice(0, 65), 90, 285);
    context.fillStyle = "#f5f1e8";
    context.font = "700 54px Georgia";
    context.fillText(formatMoneyFromSek(total, finalResult.currency), 90, 370);
    context.fillStyle = "#aaa59b";
    context.font = "27px Arial";
    context.fillText(`${formatMoneyFromSek(remaining, finalResult.currency)} kvar · ${formatPercent(ratio)} spenderat`, 90, 420);
    context.fillStyle = "#f5f1e8";
    context.font = "700 34px Georgia";
    context.fillText("Största köp", 90, 510);
    entries.slice(0, 5).forEach((entry, index) => {
      const y = 600 + index * 150;
      context.fillStyle = "#252521";
      context.fillRect(90, y - 55, 1020, 112);
      context.fillStyle = "#f5f1e8";
      context.font = "700 29px Arial";
      context.fillText(`${entry.item.quantity}× ${entry.product.name}`.slice(0, 48), 125, y);
      context.fillStyle = "#d3b875";
      context.font = "26px Arial";
      context.fillText(formatMoneyFromSek(entry.subtotal, finalResult.currency), 125, y + 38);
    });
    context.fillStyle = "#aaa59b";
    context.font = "24px Arial";
    context.fillText("Inga riktiga pengar. Väldigt riktiga prioriteringar.", 90, 1410);
    const link = document.createElement("a");
    link.download = "spend-a-billion-resultat.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("Resultatbilden är skapad.", "success");
  }

  return (
    <section className="bg-[var(--paper)] py-12 text-[var(--ink)]">
      <div className="shell">
        {readOnly && <div className="mb-6 rounded-xl border border-[var(--gold-dark)]/25 bg-[var(--gold)]/15 px-4 py-3 text-sm font-semibold">Du tittar på ett delat resultat i skrivskyddat läge. Valutan och startbudgeten följer originalet.</div>}
        <div className="overflow-hidden rounded-[1.75rem] bg-[var(--ink)] p-6 text-white shadow-2xl md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">{finalResult.name} · {sourceLabel}</p>
              <h1 className="mt-4 font-display text-6xl leading-[.9] md:text-8xl">{getResultVerdict(ratio)}</h1>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white/5 p-4"><p className="text-xs text-white/40">Startbudget</p><p className="mt-1 font-display text-xl">{formatMoneyFromSek(finalResult.startingBudgetSek, finalResult.currency)}</p></div>
              <div className="rounded-xl bg-white/5 p-4"><p className="text-xs text-white/40">Spenderat</p><p className="mt-1 font-display text-xl">{formatMoneyFromSek(total, finalResult.currency)}</p></div>
              <div className="rounded-xl bg-white/5 p-4"><p className="text-xs text-white/40">Kvar</p><p className="mt-1 font-display text-xl text-[var(--gold)]">{formatMoneyFromSek(remaining, finalResult.currency)}</p></div>
              <div className="rounded-xl bg-white/5 p-4"><p className="text-xs text-white/40">Träffsäkerhet</p><p className="mt-1 font-display text-2xl">{formatPercent(ratio)}</p></div>
              <div className="rounded-xl bg-white/5 p-4"><p className="text-xs text-white/40">Unika produkter</p><p className="mt-1 font-display text-2xl">{entries.length}</p></div>
              <div className="rounded-xl bg-white/5 p-4"><p className="text-xs text-white/40">Totalt antal</p><p className="mt-1 font-display text-2xl">{formatNumber(totalQuantity)}</p></div>
            </div>
          </div>
          <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${Math.min(100, ratio * 100)}%` }} /></div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
          <div>
            <h2 className="font-display text-5xl">Hela samlingen</h2>
            <div className="mt-5 space-y-3">
              {entries.map((entry) => (
                <article key={entry.product.id} className="grid gap-4 rounded-2xl border border-black/10 bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold-dark)]">{categoryLabels[entry.product.category]}</p>
                    <h3 className="mt-1 font-display text-3xl">{entry.item.quantity}× {entry.product.name}</h3>
                    <p className="mt-1 text-sm text-black/50">{formatMoneyFromSek(entry.product.priceSek, finalResult.currency)} per styck</p>
                  </div>
                  <p className="font-display text-3xl sm:text-right">{formatMoneyFromSek(entry.subtotal, finalResult.currency)}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="flex items-center gap-2"><Trophy className="h-5 w-5 text-[var(--gold-dark)]" /><h2 className="font-display text-3xl">Achievements</h2></div>
              {achievements.length ? <div className="mt-5 grid gap-3">{achievements.map((achievement) => <div key={achievement.id} className="rounded-xl bg-[var(--paper-2)] p-4"><p className="flex items-center gap-2 font-semibold"><Award className="h-4 w-4 text-[var(--gold-dark)]" /> {achievement.title}</p><p className="mt-1 text-sm text-black/55">{achievement.description}</p></div>)}</div> : <p className="mt-4 text-sm leading-6 text-black/55">Inga specialutmärkelser ännu. Men du lyckades åtminstone spendera pengar som inte finns.</p>}
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="font-display text-3xl">Kategorifördelning</h2>
              <div className="mt-5 space-y-3">
                {Object.entries(categories).filter(([, value]) => value > 0).sort((a, b) => b[1] - a[1]).map(([category, value]) => (
                  <div key={category}>
                    <div className="flex justify-between gap-3 text-sm"><span>{categoryLabels[category as ProductCategory]}</span><span className="font-semibold">{formatMoneyFromSek(value, finalResult.currency)}</span></div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/8"><div className="h-full bg-[var(--gold-dark)]" style={{ width: `${(value / total) * 100}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--ink)] p-6 text-white">
              <div className="flex items-center gap-2"><Share2 className="h-5 w-5 text-[var(--gold)]" /><h2 className="font-display text-3xl">Dela skrytet</h2></div>
              <p className="mt-3 text-sm leading-6 text-white/55">{shareText}</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={copyLink} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold hover:bg-white/5 focus-ring"><Copy className="h-4 w-4" /> Kopiera länk</button>
                <button type="button" onClick={shareResult} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-4 text-sm font-bold text-black focus-ring"><ExternalLink className="h-4 w-4" /> Dela</button>
                <button type="button" onClick={downloadImage} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold hover:bg-white/5 focus-ring sm:col-span-2"><Download className="h-4 w-4" /> Ladda ner resultatbild</button>
                <button type="button" onClick={shareResult} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--gold)]/40 px-4 text-sm font-semibold text-[var(--gold)] hover:bg-white/5 focus-ring sm:col-span-2"><Sparkles className="h-4 w-4" /> Utmana en vän</button>
              </div>
            </div>

            <div className="grid gap-2">
              {readOnly && <button type="button" onClick={() => { replaceWithResult({ name: `${finalResult.name} – remix`, cart: finalResult.cart, startingBudgetSek: finalResult.startingBudgetSek, currency: finalResult.currency, budgetSource: finalResult.budgetSource }); router.push("/shop"); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--gold-dark)] px-5 font-bold text-white focus-ring"><RefreshCcw className="h-4 w-4" /> Starta från detta resultat</button>}
              <button type="button" onClick={() => { resetGame(); router.push("/"); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 font-bold text-white focus-ring"><Sparkles className="h-4 w-4" /> Skapa din egen förmögenhet</button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
