import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultClient } from "@/components/result-client";

export const metadata: Metadata = { title: "Resultat", description: "Se och dela ett färdigt Spend a Billion-resultat." };

export default function ResultPage() {
  return <Suspense fallback={<div className="shell min-h-[65vh] py-16"><div className="h-96 animate-pulse rounded-2xl bg-white/5 motion-reduce:animate-none" /></div>}><ResultClient /></Suspense>;
}
