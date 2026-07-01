import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { decodeShareData, encodeShareData } from "@/lib/share";
import { getCartTotal } from "@/lib/cart";
import { STARTING_BUDGET_SEK } from "@/lib/constants";

describe("delningsdata", () => {
  it("serialiserar och avkodar giltig data", () => {
    const encoded = encodeShareData("Albin", [{ productId: "car-01", quantity: 2 }], 1234);
    expect(decodeShareData(encoded, products)).toEqual({ name: "Albin", cart: [{ productId: "car-01", quantity: 2 }], timestamp: 1234 });
  });

  it("hanterar trasig data säkert", () => {
    expect(decodeShareData("inte-giltig-base64", products)).toBeNull();
  });

  it("ignorerar okända id och begränsar orimliga antal och budget", () => {
    const encoded = encodeShareData("Test", [
      { productId: "unknown", quantity: 4 },
      { productId: "air-01", quantity: 999999 },
    ]);
    const decoded = decodeShareData(encoded, products);
    expect(decoded?.cart).toEqual([{ productId: "air-01", quantity: 1 }]);
    expect(getCartTotal(decoded?.cart ?? [], products)).toBeLessThanOrEqual(STARTING_BUDGET_SEK);
  });
});
