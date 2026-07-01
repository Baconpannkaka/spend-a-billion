import { sekToCurrency } from "@/data/currencies";
import type { CurrencyCode } from "@/types";

const numberFormatter = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 });

export function formatMoneyValue(value: number, currency: CurrencyCode, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatMoneyFromSek(valueSek: number, currency: CurrencyCode): string {
  return formatMoneyValue(sekToCurrency(valueSek, currency), currency);
}

export function formatSek(value: number): string {
  return formatMoneyFromSek(value, "SEK");
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatCompactMoneyFromSek(valueSek: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(sekToCurrency(valueSek, currency));
}

export function formatPercent(value: number, decimals = 1): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "percent",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}
