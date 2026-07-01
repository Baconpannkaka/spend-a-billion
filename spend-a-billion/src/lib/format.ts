const sekFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("sv-SE", {
  maximumFractionDigits: 0,
});

export function formatSek(value: number): string {
  return sekFormatter.format(value).replace("SEK", "kr");
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "percent",
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}
