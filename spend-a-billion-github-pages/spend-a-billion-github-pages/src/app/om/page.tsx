import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Om projektet" };

export default function AboutPage() {
  return (
    <section className="bg-[var(--paper)] py-16 text-[var(--ink)]">
      <div className="shell max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-dark)]">Om Spend a Billion</p>
        <h1 className="mt-3 font-display text-6xl leading-none md:text-8xl">Vad skulle du göra om drömmen faktiskt slog in?</h1>
        <div className="prose-copy mt-10 space-y-6 text-lg">
          <p>Spend a Billion är ett socialt fantasishopping-spel om prioriteringar, överdrifter och hur märkligt snabbt även en enorm förmögenhet kan försvinna.</p>
          <p>Du kan börja med en miljard, prova en välkänd persons uppskattade förmögenhet eller skapa ett eget aktiescenario. Den valda displayvalutan följer hela upplevelsen, medan alla beräkningar görs mot en gemensam grundvaluta för att budgeten ska vara konsekvent.</p>
          <p>Projektet har ingen databas, inga konton, inga annonser och inga riktiga betalningar. Din session sparas lokalt i webbläsaren och färdiga resultat kan delas som kompakt, validerad data direkt i länken.</p>
          <p>Alla produktpriser, förmögenheter och växelkurser är ungefärliga och daterade underhållningsvärden. Sidan är oberoende och har inget samarbete med de personer eller varumärken som nämns.</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-[var(--ink)] px-6 py-3 font-semibold text-white focus-ring">Skapa en drömbudget</Link>
          <Link href="/juridiskt" className="rounded-full border border-black/15 px-6 py-3 font-semibold focus-ring">Läs friskrivningen</Link>
        </div>
      </div>
    </section>
  );
}
