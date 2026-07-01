import { LEGACY_STORAGE_KEY, STORAGE_KEY } from "@/lib/constants";
import type { BudgetSource, CartItem, CompletedResult, CurrencyCode } from "@/types";

export type StoredGame = {
  name: string;
  cart: CartItem[];
  introShown: boolean;
  completedResult: CompletedResult | null;
  lastSessionAt: string;
  startingBudgetSek: number;
  currency: CurrencyCode;
  budgetSource: BudgetSource;
  hasStarted: boolean;
};

function parseStored(raw: string | null): Partial<StoredGame> | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed as Partial<StoredGame> : null;
  } catch {
    return null;
  }
}

export function loadGame(): Partial<StoredGame> | null {
  if (typeof window === "undefined") return null;
  try {
    return parseStored(window.localStorage.getItem(STORAGE_KEY))
      ?? parseStored(window.localStorage.getItem(LEGACY_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function saveGame(game: StoredGame): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  } catch {
    // The game remains usable even if storage is unavailable.
  }
}

export function clearGame(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Ignore storage failures during reset.
  }
}
