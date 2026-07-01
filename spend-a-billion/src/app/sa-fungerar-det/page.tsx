import type { Metadata } from "next";
import { CreditCard, Share2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Så fungerar det" };

export default function HowItWorksPage() {
  const steps = [
    [ShoppingBag, "1. Du får en miljard", "Din virtuella plånbok startar på 1 000 000 000 kronor. Välj fritt bland 40 lyxprodukter, köp flera exemplar och försök komma nära noll utan att gå över."],
    [CreditCard, "2. Du fyller din fantasivarukorg", "Budgeten räknas automatiskt. När du är nöjd går du till en tydligt simulerad kassa där inga riktiga kortuppgifter kan anges och inga pengar kan dras."],
    [Share2, "3. Du delar resultatet", "Efter fantasiköpet får du en sammanställning med achievements och en länk som fungerar utan konto, databas eller inloggning."],
  ] as const;

  return (
    <section className="bg-[var(--paper)] py-16 text-[var(--ink)]">
      <div className="shell">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-dark)]">En extremt enkel ekonomisk modell</p>
        <h1 className="mt-3 max-w-4xl font-display text-6xl leading-none md:text-8xl">En miljard in. Väldigt tveksamma prioriteringar ut.</h1>
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
          <p className="mt-3 max-w-3xl leading-7 text-white/60">Spend a Billion säljer ingenting och är inte anslutet till de varumärken som nämns. Produktnamn används bara för ett oberoende underhållningsspel och priserna är grova fantasivärden, inte offerter eller aktuell marknadsdata.</p>
          <Link href="/shop" className="mt-6 inline-flex rounded-full bg-[var(--gold)] px-6 py-3 font-bold text-black focus-ring">Börja shoppa</Link>
        </div>
      </div>
    </section>
  );
}
