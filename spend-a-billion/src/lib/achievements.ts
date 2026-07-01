import { STARTING_BUDGET_SEK } from "@/lib/constants";
import { getCartTotal } from "@/lib/cart";
import type { Achievement, CartItem, Product } from "@/types";

export function getAchievements(cart: CartItem[], products: Product[]): Achievement[] {
  const productById = new Map(products.map((product) => [product.id, product]));
  const selected = cart.flatMap((item) => {
    const product = productById.get(item.productId);
    return product ? [{ product, quantity: item.quantity }] : [];
  });
  const categories = new Set(selected.map(({ product }) => product.category));
  const remaining = STARTING_BUDGET_SEK - getCartTotal(cart, products);
  const result: Achievement[] = [];

  const add = (id: string, title: string, description: string) => result.push({ id, title, description });

  if (selected.filter(({ product }) => product.brand === "Bugatti").reduce((n, x) => n + x.quantity, 0) >= 2) {
    add("bugatti", "Bugatti-samlare", "Minst två Bugatti i garaget.");
  }
  if (selected.some(({ product }) => product.category === "flyg")) {
    add("flyg", "Privatflygare", "Köpte ett flygplan eller en helikopter.");
  }
  if (selected.some(({ product }) => product.category === "yachter")) {
    add("hav", "Havets härskare", "Har minst en yacht eller extrem båt.");
  }
  if (selected.filter(({ product }) => product.category === "fastigheter").reduce((n, x) => n + x.quantity, 0) >= 2) {
    add("fastighet", "Fastighetsmogul", "Minst två fastigheter i portföljen.");
  }
  if (selected.filter(({ product }) => product.category === "klockor").reduce((n, x) => n + x.quantity, 0) >= 3) {
    add("klocka", "Klockren", "Minst tre exklusiva klockor.");
  }
  if (remaining >= 0 && remaining < 1_000_000) {
    add("perfekt", "Perfekt spenderare", "Mindre än en miljon kronor kvar.");
  }
  if (selected.some(({ quantity }) => quantity >= 10)) {
    add("tio", "Jag tar tio", "Minst tio exemplar av samma produkt.");
  }
  if (categories.size >= 5) {
    add("variation", "Lite av varje", "Köpte från minst fem kategorier.");
  }

  return result;
}

export function getResultVerdict(spentRatio: number): string {
  if (spentRatio < 0.5) return "Oväntat försiktig för att vara miljardär.";
  if (spentRatio < 0.8) return "Du har fortfarande råd att göra något riktigt dumt.";
  if (spentRatio < 0.95) return "En stark miljardärsinsats.";
  if (spentRatio < 0.995) return "Nästan obehagligt bra spenderat.";
  return "Du lämnade i princip bara dricks.";
}
