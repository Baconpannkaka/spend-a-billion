import type { Metadata } from "next";
import { CartClient } from "@/components/cart-client";

export const metadata: Metadata = { title: "Varukorg" };
export default function CartPage() { return <CartClient />; }
