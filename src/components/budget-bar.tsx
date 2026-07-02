"use client";

import { useGame } from "@/context/game-context";
import { formatCompactMoneyFromSek, formatMoneyFromSek, formatPercent } from "@/lib/format";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function BudgetBar() {
  const { startingBudgetSek, total, remaining, spentRatio, totalQuantity, currency } = useGame();
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
      <div><div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 text-xs"><span className="text-white/45">Budget <strong className="ml-1 text-white" title={formatMoneyFromSek(startingBudgetSek, currency)}>{formatCompactMoneyFromSek(startingBudgetSek, currency)}</strong></span><span className="text-white/45">Spenderat <strong className="ml-1 text-white">{formatCompactMoneyFromSek(total, currency)}</strong></span><span className="text-white/45">Kvar <strong className="ml-1 text-[var(--gold)]">{formatCompactMoneyFromSek(remaining, currency)}</strong></span><span className="text-white/45">Använt <strong className="ml-1 text-white">{formatPercent(spentRatio)}</strong></span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${Math.min(100, spentRatio * 100)}%` }} /></div></div>
      <Link href="/varukorg" className="focus-ring inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[var(--gold)] px-4 text-xs font-bold text-black"><ShoppingBag className="h-4 w-4" /> {totalQuantity.toLocaleString("sv-SE")} saker</Link>
    </div>
  );
}
