import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Om projektet" };

export default function AboutPage() {
  return (
    <section className="bg-[var(--paper)] py-16 text-[var(--ink)]">
      <div className="shell max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-dark)]">Om Spend a Billion</p>
        <h1 className="mt-3 font-display text-6xl leading-none md:text-8xl">Tänk om en miljard bara dök upp?</h1>
        <div className="prose-copy mt-10 space-y-6 text-lg">
          <p>Spend a Billion är ett litet socialt fantasishopping-spel om prioriteringar, överdrifter och hur oväntat svårt det faktiskt kan vara att spendera exakt en miljard kronor.</p>
          <p>Projektet har ingen databas, inga konton, inga annonser och inga riktiga betalningar. Din pågående session sparas lokalt i webbläsaren, medan färdiga resultat kan delas genom kompakt data direkt i länken.</p>
          <p>Alla produkter, fastigheter och upplevelser presenteras som ungefärliga underhållningsvärden. Sidan är oberoende och har inget samarbete med de personer eller varumärken som nämns.</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/shop" className="rounded-full bg-[var(--ink)] px-6 py-3 font-semibold text-white focus-ring">Testa spelet</Link>
          <Link href="/juridiskt" className="rounded-full border border-black/15 px-6 py-3 font-semibold focus-ring">Läs friskrivningen</Link>
        </div>
      </div>
    </section>
  );
}
