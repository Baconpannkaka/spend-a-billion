import { describe, expect, it } from "vitest";
import { currencyToSek, sekToCurrency } from "@/data/currencies";
import { formatMoneyFromSek } from "@/lib/format";

const normalizeSpaces = (value: string) => value.replace(/\s/g, " ");

describe("valutor", () => {
  it("kan växla från och tillbaka till SEK utan meningsfull värdeförlust", () => {
    const sek = 1_000_000;
    const usd = sekToCurrency(sek, "USD");
    expect(currencyToSek(usd, "USD")).toBeCloseTo(sek, 6);
  });

  it("visar samma SEK-värde i vald valuta", () => {
    expect(normalizeSpaces(formatMoneyFromSek(1_000_000, "SEK"))).toBe("1 000 000 kr");
    expect(normalizeSpaces(formatMoneyFromSek(1_000_000, "EUR"))).toContain("€");
  });
});
