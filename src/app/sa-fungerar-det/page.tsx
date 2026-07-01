import type { Metadata } from "next";
import { Crown, Share2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Så fungerar det",
  description: "Välj en förmögenhet, fyll en fantasivarukorg och dela resultatet med dina vänner.",
};

export default function HowItWorksPage() {
  const steps = [
    [Crown, "1. Välj hur rik du vill vara", "Börja med den klassiska miljarden, låna en välkänd persons uppskattade förmögenhet eller räkna fram värdet av din egen aktiedröm. Välj också vilken valuta alla belopp ska visas i."],
    [ShoppingBag, "2. Bygg din fantasiportfölj", "Shoppa bland 40 extrema produkter, köp flera exemplar och försök använda budgeten så effektivt som möjligt. Priser och gränser räknas om automatiskt utan att du kan gå över budget."],
    [Share2, "3. Genomför och dela", "Gå igenom en helt simulerad kassa och få ett färdigt resultat med statistik, achievements, resultatbild och en delningslänk som fungerar utan konto eller databas."],
  ] as const;

  return (
    <section className="bg-[var(--paper)] py-16 text-[var(--ink)]">
      <div className="shell">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-dark)]">Private wealth, public priorities</p>
        <h1 className="mt-3 max-w-5xl font-display text-6xl leading-none md:text-8xl">Välj drömmen. Bygg samlingen. Försök lämna så lite som möjligt.</h1>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {steps.map(([Icon, title, text]) => (
            <article key={title} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <Icon className="h-7 w-7 text-[var(--gold-dark)]" />
              <h2 className="mt-8 font-display text-4xl">{title}</h2>
              <p className="mt-3 leading-7 text-black/60">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-[var(--ink)] p-6 text-white md:p-8">
          <h2 className="font-display text-4xl">Bra att veta</h2>
          <p className="mt-3 max-w-3xl leading-7 text-white/60">Spend a Billion säljer ingenting och är inte anslutet till de personer eller varumärken som nämns. Produktpriser, förmögenheter och växelkurser är daterade, avrundade underhållningsvärden – inte offerter, aktuell marknadsdata eller finansiell rådgivning.</p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-[var(--gold)] px-6 py-3 font-bold text-black focus-ring">Välj din förmögenhet</Link>
        </div>
      </div>
    </section>
  );
}
