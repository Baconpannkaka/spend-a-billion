import { expect, it } from "vitest";
import { getAchievements } from "@/lib/achievements";
import { products } from "@/data/products";
import { STARTING_BUDGET_SEK } from "@/lib/constants";

it("låser upp relevanta achievements", () => {
  const achievements = getAchievements([
    { productId: "car-01", quantity: 1 },
    { productId: "car-02", quantity: 1 },
    { productId: "air-06", quantity: 1 },
    { productId: "boat-01", quantity: 1 },
    { productId: "watch-01", quantity: 3 },
  ], products, STARTING_BUDGET_SEK);
  const ids = achievements.map((entry) => entry.id);
  expect(ids).toContain("bugatti");
  expect(ids).toContain("flyg");
  expect(ids).toContain("hav");
  expect(ids).toContain("klocka");
});
