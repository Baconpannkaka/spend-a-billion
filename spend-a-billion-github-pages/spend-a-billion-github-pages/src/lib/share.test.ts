import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { decodeShareData, encodeShareData } from "@/lib/share";
import { getCartTotal } from "@/lib/cart";
import { STARTING_BUDGET_SEK } from "@/lib/constants";

describe("delningsdata", () => {
  it("serialiserar budget, valuta, scenario och varukorg", () => {
    const encoded = encodeShareData("Albin", [{ productId: "car-01", quantity: 2 }], STARTING_BUDGET_SEK, "EUR", { kind: "classic" }, 1234);
    expect(decodeShareData(encoded, products)).toEqual({
      name: "Albin",
      cart: [{ productId: "car-01", quantity: 2 }],
      timestamp: 1234,
      startingBudgetSek: STARTING_BUDGET_SEK,
      currency: "EUR",
      budgetSource: { kind: "classic" },
    });
  });

  it("hanterar trasig data säkert", () => {
    expect(decodeShareData("inte-giltig-base64", products)).toBeNull();
  });

  it("ignorerar okända id och begränsar orimliga antal till budgeten", () => {
    const encoded = encodeShareData("Test", [
      { productId: "unknown", quantity: 4 },
      { productId: "air-01", quantity: 999999 },
    ], STARTING_BUDGET_SEK, "SEK", { kind: "classic" });
    const decoded = decodeShareData(encoded, products);
    expect(decoded?.cart).toEqual([{ productId: "air-01", quantity: 1 }]);
    expect(getCartTotal(decoded?.cart ?? [], products)).toBeLessThanOrEqual(STARTING_BUDGET_SEK);
  });
});
