"use client";

import { useGame } from "@/context/game-context";
import { formatMoneyFromSek, formatPercent } from "@/lib/format";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function BudgetBar({ compact = false }: { compact?: boolean }) {
  const { total, remaining, spentRatio, totalQuantity, hydrated, currency, startingBudgetSek, budgetSourceLabel } = useGame();
  const ratio = Math.min(1, Math.max(0, spentRatio));

  return (
    <section className={`rounded-2xl border border-white/10 bg-[#151513] text-white shadow-xl ${compact ? "p-4" : "p-5"}`} aria-label="Virtuell budget">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">{hydrated ? budgetSourceLabel : "Din förmögenhet"}</p>
          <p className={`${compact ? "text-2xl" : "text-3xl"} mt-1 font-display text-white`}>{hydrated ? formatMoneyFromSek(remaining, currency) : formatMoneyFromSek(startingBudgetSek, currency)}</p>
          {!compact && <p className="mt-1 text-xs text-white/35">av {formatMoneyFromSek(startingBudgetSek, currency)}</p>}
        </div>
        <div className="flex gap-5 text-sm">
          <div><p className="text-white/40">Spenderat</p><p className="font-semibold">{hydrated ? formatMoneyFromSek(total, currency) : formatMoneyFromSek(0, currency)}</p></div>
          <div><p className="text-white/40">Valda</p><p className="font-semibold">{hydrated ? totalQuantity : 0} st</p></div>
        </div>
        <Link href="/varukorg" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--gold)] px-4 text-sm font-bold text-black transition hover:bg-[#e2c887] focus-ring"><ShoppingBag className="h-4 w-4" /> Varukorgen</Link>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10" aria-label={`${formatPercent(ratio)} av budgeten spenderad`}><div className="h-full rounded-full bg-[var(--gold)] transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${ratio * 100}%` }} /></div>
    </section>
  );
}
