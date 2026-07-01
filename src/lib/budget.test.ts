import { describe, expect, it } from "vitest";
import { currencyToSek } from "@/data/currencies";
import { createPersonSetup, createStockSetup } from "@/lib/budget";

describe("budgetscenarier", () => {
  it("skapar budget från en vald persons uppskattade förmögenhet", () => {
    const setup = createPersonSetup("michael-jordan", "USD");
    expect(setup?.budgetSource).toEqual({ kind: "person", personId: "michael-jordan", personName: "Michael Jordan" });
    expect(setup?.startingBudgetSek).toBe(Math.round(currencyToSek(4_300_000_000, "USD")));
  });

  it("räknar aktier i kursvalutan och behåller separat displayvaluta", () => {
    const setup = createStockSetup({
      stockName: "NVIDIA",
      shares: 1_000,
      targetPrice: 500,
      quoteCurrency: "USD",
      currency: "SEK",
    });
    expect(setup?.startingBudgetSek).toBe(Math.round(currencyToSek(500_000, "USD")));
    expect(setup?.currency).toBe("SEK");
    expect(setup?.budgetSource).toMatchObject({ kind: "stock", stockName: "NVIDIA", shares: 1_000, targetPrice: 500, quoteCurrency: "USD" });
  });

  it("avvisar ogiltiga aktiescenarier", () => {
    expect(createStockSetup({ stockName: "Test", shares: 0, targetPrice: 100, quoteCurrency: "USD", currency: "SEK" })).toBeNull();
    expect(createStockSetup({ stockName: "Test", shares: 10, targetPrice: -1, quoteCurrency: "USD", currency: "SEK" })).toBeNull();
  });
});
