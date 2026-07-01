"use client";

import { currencies } from "@/data/currencies";
import { useGame } from "@/context/game-context";
import type { CurrencyCode } from "@/types";
import { Coins } from "lucide-react";

export function CurrencySelect({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency, hydrated } = useGame();

  return (
    <label className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] text-white ${compact ? "px-2.5" : "px-3"}`}>
      <Coins className="h-4 w-4 text-[var(--gold)]" aria-hidden="true" />
      <span className="sr-only">Vald valuta</span>
      <select
        value={hydrated ? currency : "SEK"}
        onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
        className={`cursor-pointer appearance-none bg-transparent font-semibold text-white outline-none ${compact ? "h-9 text-xs" : "h-11 text-sm"}`}
        aria-label="Välj valuta för alla belopp"
      >
        {currencies.map((entry) => (
          <option key={entry.code} value={entry.code} className="bg-[#171714] text-white">
            {entry.code}
          </option>
        ))}
      </select>
    </label>
  );
}
