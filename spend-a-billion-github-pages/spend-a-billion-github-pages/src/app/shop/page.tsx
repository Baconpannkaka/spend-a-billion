import type { Metadata } from "next";
import { ShopClient } from "@/components/shop-client";

export const metadata: Metadata = {
  title: "Shoppa",
  description: "Välj bland 40 lyxprodukter och försök spendera din valda fantasiförmögenhet utan att gå över budget.",
};

export default function ShopPage() {
  return <ShopClient />;
}
