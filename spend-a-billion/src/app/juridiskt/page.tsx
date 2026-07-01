import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Juridiskt" };

export default function LegalPage() {
  const items = [
    "Sidan är ett oberoende underhållningsprojekt.",
    "Inga produkter säljs och inga beställningar skapas.",
    "Inga riktiga betalningar genomförs eller betaluppgifter samlas in.",
    "Priser är ungefärliga och används enbart för underhållning.",
    "Produktnamn och varumärken tillhör respektive rättighetsinnehavare.",
    "Projektet är inte sponsrat, godkänt eller administrerat av de varumärken som omnämns.",
    "Kontakta projektets ägare om något material behöver korrigeras eller tas bort.",
    "Speldata sparas endast lokalt i användarens webbläsare. Inga cookies, annonser, trackers eller analysverktyg används.",
  ];
  return (
    <section className="bg-[var(--paper)] py-16 text-[var(--ink)]">
      <div className="shell max-w-4xl">
        <ShieldCheck className="h-9 w-9 text-[var(--gold-dark)]" />
        <h1 className="mt-5 font-display text-6xl md:text-8xl">Juridisk friskrivning</h1>
        <p className="mt-5 text-lg leading-8 text-black/60">Spend a Billion är ett spel, inte en butik, mäklare, resebyrå eller återförsäljare.</p>
        <ul className="mt-10 grid gap-3">
          {items.map((item) => <li key={item} className="rounded-xl border border-black/10 bg-white p-4 leading-7 text-black/65">{item}</li>)}
        </ul>
      </div>
    </section>
  );
}
