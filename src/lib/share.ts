import { isBudgetSource } from "@/lib/budget";
import { MAX_BUDGET_SEK, MAX_SHARED_QUANTITY, SHARE_VERSION, STARTING_BUDGET_SEK } from "@/lib/constants";
import { isCurrencyCode } from "@/data/currencies";
import type { BudgetSource, CartItem, CurrencyCode, Product, SharePayloadV2 } from "@/types";

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(encoded: string): string {
  const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeShareData(
  name: string,
  cart: CartItem[],
  budgetSek: number,
  currency: CurrencyCode,
  budgetSource: BudgetSource,
  timestamp = Date.now(),
): string {
  const payload: SharePayloadV2 = {
    v: SHARE_VERSION,
    n: name.trim().slice(0, 60) || "Future Billionaire",
    i: cart.map((item) => [item.productId, item.quantity]),
    b: Math.min(MAX_BUDGET_SEK, Math.max(1, Math.round(budgetSek))),
    c: currency,
    s: budgetSource,
    t: timestamp,
  };
  return toBase64Url(JSON.stringify(payload));
}

export function decodeShareData(
  encoded: string,
  products: Product[],
): { name: string; cart: CartItem[]; timestamp?: number; startingBudgetSek: number; currency: CurrencyCode; budgetSource: BudgetSource } | null {
  try {
    if (!encoded || encoded.length > 30_000) return null;
    const parsed: unknown = JSON.parse(fromBase64Url(encoded));
    if (!parsed || typeof parsed !== "object") return null;
    const candidate = parsed as Record<string, unknown>;

    const isLegacy = candidate.v === 1;
    if (!isLegacy && candidate.v !== SHARE_VERSION) return null;
    if (typeof candidate.n !== "string" || !Array.isArray(candidate.i)) return null;

    const startingBudgetSek = isLegacy
      ? STARTING_BUDGET_SEK
      : typeof candidate.b === "number" && Number.isFinite(candidate.b)
        ? Math.min(MAX_BUDGET_SEK, Math.max(1, Math.round(candidate.b)))
        : STARTING_BUDGET_SEK;
    const currency: CurrencyCode = !isLegacy && isCurrencyCode(candidate.c) ? candidate.c : "SEK";
    const budgetSource: BudgetSource = !isLegacy && isBudgetSource(candidate.s) ? candidate.s : { kind: "classic" };

    const validIds = new Set(products.map((product) => product.id));
    const quantities = new Map<string, number>();
    for (const entry of candidate.i) {
      if (!Array.isArray(entry) || entry.length !== 2) continue;
      const [productId, rawQuantity] = entry;
      if (typeof productId !== "string" || !validIds.has(productId)) continue;
      if (typeof rawQuantity !== "number" || !Number.isFinite(rawQuantity)) continue;
      const quantity = Math.min(MAX_SHARED_QUANTITY, Math.floor(rawQuantity));
      if (quantity <= 0) continue;
      quantities.set(productId, Math.min(MAX_SHARED_QUANTITY, (quantities.get(productId) ?? 0) + quantity));
    }

    const priceById = new Map(products.map((product) => [product.id, product.priceSek]));
    let remainingBudget = startingBudgetSek;
    const cart = Array.from(quantities).flatMap(([productId, requestedQuantity]) => {
      const price = priceById.get(productId);
      if (!price || remainingBudget < price) return [];
      const quantity = Math.min(requestedQuantity, Math.floor(remainingBudget / price));
      if (quantity <= 0) return [];
      remainingBudget -= price * quantity;
      return [{ productId, quantity }];
    });
    if (cart.length === 0) return null;

    return {
      name: candidate.n.trim().slice(0, 60) || "Future Billionaire",
      cart,
      startingBudgetSek,
      currency,
      budgetSource,
      timestamp: typeof candidate.t === "number" && Number.isFinite(candidate.t) ? candidate.t : undefined,
    };
  } catch {
    return null;
  }
}
