export const PRODUCT_CATEGORIES = [
  "bilar",
  "klockor",
  "flyg",
  "yachter",
  "fastigheter",
  "samlarobjekt",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const CURRENCY_CODES = ["SEK", "USD", "EUR", "GBP", "NOK", "DKK", "CHF", "JPY", "CAD", "AUD"] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category: ProductCategory;
  priceSek: number;
  shortDescription: string;
  description: string;
  facts: string[];
  imageUrl?: string;
  imageAlt?: string;
  imageSourceUrl?: string;
  imageCreator?: string;
  imageLicense?: string;
  imageLicenseUrl?: string;
  featured?: boolean;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type BudgetSource =
  | { kind: "classic" }
  | { kind: "person"; personId: string; personName: string }
  | {
      kind: "stock";
      stockName: string;
      shares: number;
      targetPrice: number;
      quoteCurrency: CurrencyCode;
    };

export type GameSetup = {
  startingBudgetSek: number;
  currency: CurrencyCode;
  budgetSource: BudgetSource;
};

export type CompletedResult = GameSetup & {
  name: string;
  cart: CartItem[];
  completedAt: string;
};

export type SharePayloadV2 = {
  v: 2;
  n: string;
  i: Array<[string, number]>;
  b: number;
  c: CurrencyCode;
  s: BudgetSource;
  t?: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
};
