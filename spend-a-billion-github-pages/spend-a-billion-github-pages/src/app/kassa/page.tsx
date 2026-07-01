import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout-client";

export const metadata: Metadata = { title: "Fantasikassan", robots: { index: false, follow: true } };
export default function CheckoutPage() { return <CheckoutClient />; }
