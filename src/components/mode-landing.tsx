import { ArrowRight, Crown, ShoppingBasket, Sparkles, Tags } from "lucide-react";
import Link from "next/link";

export function ModeLanding() {
  return (
    <>
      <section className="hero-luxury relative overflow-hidden border-b border-white/10 py-16 md:py-24">
        <div className="hero-grain pointer-events-none absolute inset-0 opacity-40" />
        <div className="shell relative">
          <p className="eyebrow">Fantasishopping för alla budgetar</p>
          <h1 className="mt-4 max-w-5xl font-display text-5xl leading-[.92] text-white md:text-7xl xl:text-8xl">Hur vill du shoppa i dag?</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/55 md:text-lg">Välj extrem lyx eller en mer igenkännbar kundvagn. Samma spelmotor, två helt olika dopaminkickar.</p>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <Link href="/miljardar" className="mode-card group bg-[#171713]">
              <div className="flex items-start justify-between gap-4"><div className="icon-tile"><Crown className="h-6 w-6" /></div><span className="pill">10 000 produkter</span></div>
              <div className="mt-16 md:mt-24"><p className="eyebrow">Miljardärsläge</p><h2 className="mt-2 font-display text-4xl md:text-5xl">Privatjet, samlarkort och fullständig orimlighet.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-white/50">Välj en känd förmögenhet, den klassiska miljarden eller din egen aktiedröm.</p><span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[var(--gold)]">Välj förmögenhet <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></div>
            </Link>
            <Link href="/vardag" className="mode-card group bg-[var(--paper)] text-[var(--ink)]">
              <div className="flex items-start justify-between gap-4"><div className="icon-tile border-black/10 bg-black/5 text-black"><ShoppingBasket className="h-6 w-6" /></div><span className="pill border-black/10 bg-black/5 text-black/60">10 000 produkter</span></div>
              <div className="mt-16 md:mt-24"><p className="eyebrow text-[var(--gold-dark)]">Vardagsläge</p><h2 className="mt-2 font-display text-4xl md:text-5xl">Mobil, mat, möbler och allt du faktiskt känner igen.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-black/55">Välj en shoppingkassa och se hur långt den räcker bland vardagens frestelser.</p><span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-black">Välj budget <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></div>
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-[var(--paper)] py-14 text-[var(--ink)]"><div className="shell grid gap-8 md:grid-cols-3"><div><Sparkles className="h-5 w-5 text-[var(--gold-dark)]" /><h2 className="mt-3 font-display text-3xl">Välj en dröm</h2><p className="mt-2 text-sm leading-6 text-black/55">Känd förmögenhet, egen budget eller en aktie som går till månen.</p></div><div><Tags className="h-5 w-5 text-[var(--gold-dark)]" /><h2 className="mt-3 font-display text-3xl">Sök bland 20 000 saker</h2><p className="mt-2 text-sm leading-6 text-black/55">Tydliga kategorier, underkategorier och fri sökning i två kataloger.</p></div><div><ArrowRight className="h-5 w-5 text-[var(--gold-dark)]" /><h2 className="mt-3 font-display text-3xl">Dela resultatet</h2><p className="mt-2 text-sm leading-6 text-black/55">Skicka en skrivskyddad sammanställning eller utmana en vän med samma budget.</p></div></div></section>
    </>
  );
}
