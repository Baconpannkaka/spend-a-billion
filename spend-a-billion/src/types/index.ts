export const PRODUCT_CATEGORIES = [
  "bilar",
  "klockor",
  "flyg",
  "yachter",
  "fastigheter",
  "samlarobjekt",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

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

export type CompletedResult = {
  name: string;
  cart: CartItem[];
  completedAt: string;
};

export type SharePayload = {
  v: 1;
  n: string;
  i: Array<[string, number]>;
  t?: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
};
