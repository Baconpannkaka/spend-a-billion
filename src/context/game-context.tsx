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
import { clampBudgetSek, createClassicSetup, getBudgetSourceLabel, isBudgetSource } from "@/lib/budget";
import { STARTING_BUDGET_SEK } from "@/lib/constants";
import { clearGame, loadGame, saveGame } from "@/lib/storage";
import { isCurrencyCode } from "@/data/currencies";
import { products } from "@/data/products";
import type { BudgetSource, CartItem, CompletedResult, CurrencyCode, GameSetup } from "@/types";
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
  startingBudgetSek: number;
  currency: CurrencyCode;
  budgetSource: BudgetSource;
  budgetSourceLabel: string;
  hasStarted: boolean;
  total: number;
  remaining: number;
  spentRatio: number;
  totalQuantity: number;
  setCurrency: (currency: CurrencyCode) => void;
  startGame: (setup: GameSetup) => void;
  addItem: (productId: string, quantity?: number) => AddResult;
  updateQuantity: (productId: string, quantity: number) => AddResult;
  removeItem: (productId: string) => void;
  completePurchase: () => CompletedResult;
  resetGame: () => void;
  replaceWithResult: (result: Omit<CompletedResult, "completedAt">) => void;
};

const GameContext = createContext<GameContextValue | null>(null);
const defaultSetup = createClassicSetup("SEK");

function normalizeCompletedResult(
  value: unknown,
  fallback: { startingBudgetSek: number; currency: CurrencyCode; budgetSource: BudgetSource },
): CompletedResult | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<CompletedResult>;
  if (typeof candidate.name !== "string" || !Array.isArray(candidate.cart)) return null;

  const startingBudgetSek = typeof candidate.startingBudgetSek === "number" && Number.isFinite(candidate.startingBudgetSek) && candidate.startingBudgetSek > 0
    ? clampBudgetSek(candidate.startingBudgetSek)
    : fallback.startingBudgetSek;
  const currency = isCurrencyCode(candidate.currency) ? candidate.currency : fallback.currency;
  const budgetSource = isBudgetSource(candidate.budgetSource) ? candidate.budgetSource : fallback.budgetSource;
  const cart = sanitizeCartToBudget(candidate.cart, products, startingBudgetSek);
  if (cart.length === 0) return null;

  return {
    name: candidate.name.trim().slice(0, 60) || "Future Billionaire",
    cart,
    completedAt: typeof candidate.completedAt === "string" ? candidate.completedAt : new Date(0).toISOString(),
    startingBudgetSek,
    currency,
    budgetSource,
  };
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [name, setNameState] = useState("Future Billionaire");
  const [cart, setCart] = useState<CartItem[]>([]);
  const cartRef = useRef<CartItem[]>([]);
  const [introShown, setIntroShown] = useState(false);
  const [completedResult, setCompletedResult] = useState<CompletedResult | null>(null);
  const [startingBudgetSek, setStartingBudgetSek] = useState(defaultSetup.startingBudgetSek);
  const budgetRef = useRef(defaultSetup.startingBudgetSek);
  const [currency, setCurrencyState] = useState<CurrencyCode>(defaultSetup.currency);
  const [budgetSource, setBudgetSource] = useState<BudgetSource>(defaultSetup.budgetSource);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const stored = loadGame();
      if (stored) {
        const loadedBudget = typeof stored.startingBudgetSek === "number" && Number.isFinite(stored.startingBudgetSek) && stored.startingBudgetSek > 0
          ? clampBudgetSek(stored.startingBudgetSek)
          : STARTING_BUDGET_SEK;
        const loadedCurrency = isCurrencyCode(stored.currency) ? stored.currency : "SEK";
        const loadedSource = isBudgetSource(stored.budgetSource) ? stored.budgetSource : { kind: "classic" } as const;
        const storedCart = sanitizeCartToBudget(Array.isArray(stored.cart) ? stored.cart : [], products, loadedBudget);

        setNameState(typeof stored.name === "string" ? stored.name.slice(0, 60) : "Future Billionaire");
        cartRef.current = storedCart;
        setCart(storedCart);
        setIntroShown(Boolean(stored.introShown));
        setCompletedResult(normalizeCompletedResult(stored.completedResult, {
          startingBudgetSek: loadedBudget,
          currency: loadedCurrency,
          budgetSource: loadedSource,
        }));
        setStartingBudgetSek(loadedBudget);
        budgetRef.current = loadedBudget;
        setCurrencyState(loadedCurrency);
        setBudgetSource(loadedSource);
        setHasStarted(Boolean(stored.hasStarted) || storedCart.length > 0);
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveGame({
      name,
      cart,
      introShown,
      completedResult,
      lastSessionAt: new Date().toISOString(),
      startingBudgetSek,
      currency,
      budgetSource,
      hasStarted,
    });
  }, [hydrated, name, cart, introShown, completedResult, startingBudgetSek, currency, budgetSource, hasStarted]);

  const total = useMemo(() => getCartTotal(cart, products), [cart]);
  const remaining = useMemo(() => getRemainingBudget(cart, products, startingBudgetSek), [cart, startingBudgetSek]);
  const spentRatio = useMemo(() => getSpentRatio(cart, products, startingBudgetSek), [cart, startingBudgetSek]);
  const totalQuantity = useMemo(() => getTotalQuantity(cart), [cart]);
  const budgetSourceLabel = useMemo(() => getBudgetSourceLabel(budgetSource), [budgetSource]);

  const setName = useCallback((value: string) => setNameState(value.slice(0, 60)), []);
  const setCurrency = useCallback((value: CurrencyCode) => setCurrencyState(value), []);

  const startGame = useCallback((setup: GameSetup) => {
    const safeBudget = clampBudgetSek(setup.startingBudgetSek);
    budgetRef.current = safeBudget;
    setStartingBudgetSek(safeBudget);
    setCurrencyState(setup.currency);
    setBudgetSource(setup.budgetSource);
    cartRef.current = [];
    setCart([]);
    setCompletedResult(null);
    setIntroShown(false);
    setHasStarted(true);
  }, []);

  const addItem = useCallback((productId: string, quantity = 1): AddResult => {
    const current = cartRef.current;
    const product = products.find((entry) => entry.id === productId);
    const currentTotal = getCartTotal(current, products);
    if (!product || !canAddQuantity(current, products, productId, quantity, budgetRef.current)) {
      const missing = product ? Math.max(0, currentTotal + product.priceSek * quantity - budgetRef.current) : 0;
      return { ok: false, missing };
    }
    const next = addToCart(current, productId, quantity);
    cartRef.current = next;
    setCart(next);
    setCompletedResult(null);
    setHasStarted(true);
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
    if (quantity > currentQuantity && !canAddQuantity(current, products, productId, quantity - currentQuantity, budgetRef.current)) {
      const product = products.find((entry) => entry.id === productId);
      const currentTotal = getCartTotal(current, products);
      const missing = product ? Math.max(0, currentTotal + product.priceSek * (quantity - currentQuantity) - budgetRef.current) : 0;
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
      startingBudgetSek: budgetRef.current,
      currency,
      budgetSource,
    };
    setCompletedResult(result);
    return result;
  }, [name, currency, budgetSource]);

  const resetGame = useCallback(() => {
    clearGame();
    setNameState("Future Billionaire");
    cartRef.current = [];
    setCart([]);
    setIntroShown(false);
    setCompletedResult(null);
    budgetRef.current = STARTING_BUDGET_SEK;
    setStartingBudgetSek(STARTING_BUDGET_SEK);
    setCurrencyState("SEK");
    setBudgetSource({ kind: "classic" });
    setHasStarted(false);
  }, []);

  const replaceWithResult = useCallback((result: Omit<CompletedResult, "completedAt">) => {
    setNameState(result.name.slice(0, 60) || "Future Billionaire");
    const safeBudget = clampBudgetSek(result.startingBudgetSek);
    const safeCart = sanitizeCartToBudget(result.cart, products, safeBudget);
    cartRef.current = safeCart;
    setCart(safeCart);
    budgetRef.current = safeBudget;
    setStartingBudgetSek(safeBudget);
    setCurrencyState(result.currency);
    setBudgetSource(result.budgetSource);
    setCompletedResult(null);
    setIntroShown(true);
    setHasStarted(true);
  }, []);

  const value = useMemo<GameContextValue>(() => ({
    hydrated,
    name,
    setName,
    cart,
    introShown,
    setIntroShown,
    completedResult,
    startingBudgetSek,
    currency,
    budgetSource,
    budgetSourceLabel,
    hasStarted,
    total,
    remaining,
    spentRatio,
    totalQuantity,
    setCurrency,
    startGame,
    addItem,
    updateQuantity,
    removeItem,
    completePurchase,
    resetGame,
    replaceWithResult,
  }), [hydrated, name, setName, cart, introShown, completedResult, startingBudgetSek, currency, budgetSource, budgetSourceLabel, hasStarted, total, remaining, spentRatio, totalQuantity, setCurrency, startGame, addItem, updateQuantity, removeItem, completePurchase, resetGame, replaceWithResult]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame måste användas inom GameProvider");
  return context;
}
