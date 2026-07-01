import { STORAGE_KEY } from "@/lib/constants";
import type { CartItem, CompletedResult } from "@/types";

export type StoredGame = {
  name: string;
  cart: CartItem[];
  introShown: boolean;
  completedResult: CompletedResult | null;
  lastSessionAt: string;
};

export function loadGame(): StoredGame | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as StoredGame;
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
  } catch {
    // Ignore storage failures during reset.
  }
}
