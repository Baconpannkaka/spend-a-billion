import { ShopClient } from "@/components/shop-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop", description: "Sök, filtrera och shoppa i din valda fantasikatalog." };
export default function ShopPage() { return <ShopClient />; }
