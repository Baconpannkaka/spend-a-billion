import type { CartItem, Product } from "@/types";

export function sanitizeCart(cart: CartItem[], products: Product[]): CartItem[] {
  const productIds = new Set(products.map((product) => product.id));
  const merged = new Map<string, number>();

  for (const item of cart) {
    if (!productIds.has(item.productId) || !Number.isInteger(item.quantity) || item.quantity <= 0) continue;
    merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);
  }

  return Array.from(merged, ([productId, quantity]) => ({ productId, quantity }));
}

export function sanitizeCartToBudget(cart: CartItem[], products: Product[], budgetSek: number): CartItem[] {
  const clean = sanitizeCart(cart, products);
  const priceById = new Map(products.map((product) => [product.id, product.priceSek]));
  let remaining = Math.max(0, budgetSek);

  return clean.flatMap((item) => {
    const price = priceById.get(item.productId);
    if (!price || remaining < price) return [];
    const quantity = Math.min(item.quantity, Math.floor(remaining / price));
    if (quantity <= 0) return [];
    remaining -= quantity * price;
    return [{ productId: item.productId, quantity }];
  });
}

export function getCartTotal(cart: CartItem[], products: Product[]): number {
  const priceById = new Map(products.map((product) => [product.id, product.priceSek]));
  return cart.reduce((total, item) => total + (priceById.get(item.productId) ?? 0) * item.quantity, 0);
}

export function getRemainingBudget(cart: CartItem[], products: Product[], budgetSek: number): number {
  return Math.max(0, budgetSek - getCartTotal(cart, products));
}

export function getSpentRatio(cart: CartItem[], products: Product[], budgetSek: number): number {
  if (budgetSek <= 0) return 0;
  return getCartTotal(cart, products) / budgetSek;
}

export function getTotalQuantity(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getMaxAffordableQuantity(remainingBudget: number, priceSek: number): number {
  if (priceSek <= 0 || remainingBudget <= 0) return 0;
  return Math.floor(remainingBudget / priceSek);
}

export function canAddQuantity(
  cart: CartItem[],
  products: Product[],
  productId: string,
  quantity: number,
  budgetSek: number,
): boolean {
  if (!Number.isInteger(quantity) || quantity <= 0) return false;
  const product = products.find((entry) => entry.id === productId);
  if (!product) return false;
  return getCartTotal(cart, products) + product.priceSek * quantity <= budgetSek;
}

export function addToCart(cart: CartItem[], productId: string, quantity = 1): CartItem[] {
  const existing = cart.find((item) => item.productId === productId);
  if (!existing) return [...cart, { productId, quantity }];
  return cart.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
}

export function setCartQuantity(cart: CartItem[], productId: string, quantity: number): CartItem[] {
  if (quantity <= 0) return cart.filter((item) => item.productId !== productId);
  return cart.map((item) => (item.productId === productId ? { ...item, quantity } : item));
}

export function removeFromCart(cart: CartItem[], productId: string): CartItem[] {
  return cart.filter((item) => item.productId !== productId);
}
