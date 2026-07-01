"use client";

import { useGame } from "@/context/game-context";
import { formatMoneyFromSek } from "@/lib/format";

export function Money({ valueSek, className }: { valueSek: number; className?: string }) {
  const { currency } = useGame();
  return <span className={className}>{formatMoneyFromSek(valueSek, currency)}</span>;
}
