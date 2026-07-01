"use client";

import {
  addToCart,
  canAddQuantity,
  getCartTotal,
  getRemainingBudget,
  getSpentRatio,
  getTotalQuantity,
  removeFromCart,
  sanitizeCartToBudget,
  setCartQuantity,
} from "@/lib/cart";
import { STARTING_BUDGET_SEK } from "@/lib/constants";
import { clearGame, loadGame, saveGame } from "@/lib/storage";
import { products } from "@/data/products";
import type { CartItem, CompletedResult } from "@/types";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type AddResult = { ok: true } | { ok: false; missing: number };

type GameContextValue = {
  hydrated: boolean;
  name: string;
  setName: (name: string) => void;
  cart: CartItem[];
  introShown: boolean;
  setIntroShown: (shown: boolean) => void;
  completedResult: CompletedResult | null;
  total: number;
  remaining: number;
  spentRatio: number;
  totalQuantity: number;
  addItem: (productId: string, quantity?: number) => AddResult;
  updateQuantity: (productId: string, quantity: number) => AddResult;
  removeItem: (productId: string) => void;
  completePurchase: () => CompletedResult;
  resetGame: () => void;
  replaceWithCart: (name: string, cart: CartItem[]) => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [name, setNameState] = useState("Future Billionaire");
  const [cart, setCart] = useState<CartItem[]>([]);
  const cartRef = useRef<CartItem[]>([]);
  const [introShown, setIntroShown] = useState(false);
  const [completedResult, setCompletedResult] = useState<CompletedResult | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const stored = loadGame();
      if (stored) {
        setNameState(typeof stored.name === "string" ? stored.name.slice(0, 60) : "Future Billionaire");
        const storedCart = sanitizeCartToBudget(Array.isArray(stored.cart) ? stored.cart : [], products);
        cartRef.current = storedCart;
        setCart(storedCart);
        setIntroShown(Boolean(stored.introShown));
        setCompletedResult(stored.completedResult ?? null);
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveGame({ name, cart, introShown, completedResult, lastSessionAt: new Date().toISOString() });
  }, [hydrated, name, cart, introShown, completedResult]);

  const total = useMemo(() => getCartTotal(cart, products), [cart]);
  const remaining = useMemo(() => getRemainingBudget(cart, products), [cart]);
  const spentRatio = useMemo(() => getSpentRatio(cart, products), [cart]);
  const totalQuantity = useMemo(() => getTotalQuantity(cart), [cart]);

  const setName = useCallback((value: string) => setNameState(value.slice(0, 60)), []);

  const addItem = useCallback((productId: string, quantity = 1): AddResult => {
    const current = cartRef.current;
    const product = products.find((entry) => entry.id === productId);
    const currentTotal = getCartTotal(current, products);
    if (!product || !canAddQuantity(current, products, productId, quantity)) {
      const missing = product ? Math.max(0, currentTotal + product.priceSek * quantity - STARTING_BUDGET_SEK) : 0;
      return { ok: false, missing };
    }
    const next = addToCart(current, productId, quantity);
    cartRef.current = next;
    setCart(next);
    setCompletedResult(null);
    return { ok: true };
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number): AddResult => {
    const current = cartRef.current;
    if (quantity <= 0) {
      const next = setCartQuantity(current, productId, 0);
      cartRef.current = next;
      setCart(next);
      setCompletedResult(null);
      return { ok: true };
    }
    const currentQuantity = current.find((item) => item.productId === productId)?.quantity ?? 0;
    if (quantity > currentQuantity && !canAddQuantity(current, products, productId, quantity - currentQuantity)) {
      const product = products.find((entry) => entry.id === productId);
      const currentTotal = getCartTotal(current, products);
      const missing = product ? Math.max(0, currentTotal + product.priceSek * (quantity - currentQuantity) - STARTING_BUDGET_SEK) : 0;
      return { ok: false, missing };
    }
    const next = setCartQuantity(current, productId, quantity);
    cartRef.current = next;
    setCart(next);
    setCompletedResult(null);
    return { ok: true };
  }, []);

  const removeItem = useCallback((productId: string) => {
    const next = removeFromCart(cartRef.current, productId);
    cartRef.current = next;
    setCart(next);
    setCompletedResult(null);
  }, []);

  const completePurchase = useCallback(() => {
    const result: CompletedResult = {
      name: name.trim() || "Future Billionaire",
      cart: cartRef.current,
      completedAt: new Date().toISOString(),
    };
    setCompletedResult(result);
    return result;
  }, [name]);

  const resetGame = useCallback(() => {
    clearGame();
    setNameState("Future Billionaire");
    cartRef.current = [];
    setCart([]);
    setIntroShown(false);
    setCompletedResult(null);
  }, []);

  const replaceWithCart = useCallback((newName: string, newCart: CartItem[]) => {
    setNameState(newName.slice(0, 60) || "Future Billionaire");
    const sanitized = sanitizeCartToBudget(newCart, products);
    cartRef.current = sanitized;
    setCart(sanitized);
    setCompletedResult(null);
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      hydrated,
      name,
      setName,
      cart,
      introShown,
      setIntroShown,
      completedResult,
      total,
      remaining,
      spentRatio,
      totalQuantity,
      addItem,
      updateQuantity,
      removeItem,
      completePurchase,
      resetGame,
      replaceWithCart,
    }),
    [
      hydrated,
      name,
      setName,
      cart,
      introShown,
      completedResult,
      total,
      remaining,
      spentRatio,
      totalQuantity,
      addItem,
      updateQuantity,
      removeItem,
      completePurchase,
      resetGame,
      replaceWithCart,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame måste användas inom GameProvider");
  return context;
}
