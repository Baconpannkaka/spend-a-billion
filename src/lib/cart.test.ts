import { describe, expect, it } from "vitest";
import { addToCart, canAddQuantity, getCartTotal, getMaxAffordableQuantity, getRemainingBudget, removeFromCart, setCartQuantity } from "@/lib/cart";
import { products } from "@/data/products";
import { STARTING_BUDGET_SEK } from "@/lib/constants";

const rolex = products.find((product) => product.id === "watch-01")!;
const gulfstream = products.find((product) => product.id === "air-01")!;

describe("kundvagn", () => {
  it("räknar totalsumma och återstående budget", () => {
    const cart = [{ productId: rolex.id, quantity: 2 }];
    expect(getCartTotal(cart, products)).toBe(1_800_000);
    expect(getRemainingBudget(cart, products, STARTING_BUDGET_SEK)).toBe(998_200_000);
  });

  it("hindrar köp som överskrider den valda budgeten", () => {
    const cart = [{ productId: gulfstream.id, quantity: 1 }];
    expect(canAddQuantity(cart, products, gulfstream.id, 1, STARTING_BUDGET_SEK)).toBe(false);
    expect(canAddQuantity(cart, products, rolex.id, 1, STARTING_BUDGET_SEK)).toBe(true);
    expect(canAddQuantity([], products, rolex.id, 1, 500_000)).toBe(false);
  });

  it("ökar, minskar och tar bort antal", () => {
    const initial = addToCart([], rolex.id, 2);
    expect(initial[0].quantity).toBe(2);
    expect(setCartQuantity(initial, rolex.id, 1)[0].quantity).toBe(1);
    expect(removeFromCart(initial, rolex.id)).toEqual([]);
  });

  it("beräknar maxantal som ryms", () => {
    expect(getMaxAffordableQuantity(10_000_000, rolex.priceSek)).toBe(11);
  });
});
