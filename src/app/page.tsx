import { LegalNotice } from "@/components/legal-notice";
import { ProductCard } from "@/components/product-card";
import { WealthStarter } from "@/components/wealth-starter";
import { products } from "@/data/products";
import { ArrowRight, CreditCard, Share2, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const featured = products.filter((product) => product.featured).slice(0, 3);

  return (
    <>
      <section className="hero-luxury relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute -right-56 -top-56 h-[48rem] w-[48rem] rounded-full border border-[var(--gold)]/18" />
          <div className="absolute right-[8%] top-[10%] h-[30rem] w-[30rem] rounded-full border border-white/[0.05]" />
          <div className="hero-grain absolute inset-0 opacity-40" />
        </div>
        <div className="shell relative grid min-h-[calc(100vh-4.5rem)] items-center gap-12 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div className="max-w-3xl">
            <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]"><span className="h-px w-10 bg-[var(--gold)]/60" /> Fantasishopping, personligt förmögen</p>
            <h1 className="font-display text-[clamp(4.5rem,9.5vw,9rem)] leading-[0.78] tracking-[-0.055em] text-white">
              Hur rik vill du <span className="italic text-[var(--gold)]">vara?</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-white/58">
              Låna Elon Musks förmögenhet, dröm om din favoritaktie eller börja med den klassiska miljarden. Sedan handlar du bort allt på hyperbilar, privatjet och fastigheter.
            </p>
            <div className="mt-9 grid max-w-xl grid-cols-3 border-y border-white/10 py-5 text-center sm:text-left">
              <div><p className="font-display text-2xl text-white">20</p><p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/35">Förmögenheter</p></div>
              <div className="border-x border-white/10 px-3"><p className="font-display text-2xl text-white">40</p><p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/35">Drömköp</p></div>
              <div className="pl-3"><p className="font-display text-2xl text-white">10</p><p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/35">Valutor</p></div>
            </div>
          </div>

          <WealthStarter />
        </div>
      </section>

      <section className="bg-[var(--paper)] py-20 text-[var(--ink)] md:py-28">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.23em] text-[var(--gold-dark)]">The acquisition edit</p>
              <h2 className="mt-4 max-w-3xl font-display text-5xl leading-[.92] md:text-7xl">Saker som gör en absurd budget förvånansvärt liten.</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 font-semibold hover:underline focus-ring">Utforska hela samlingen <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-12 grid gap-7 lg:grid-cols-3">
            {featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section id="sa-fungerar-det" className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/[0.04]" aria-hidden="true" />
        <div className="shell relative">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.23em] text-[var(--gold)]">Din fantasi. Din portfölj.</p>
            <h2 className="mt-4 font-display text-5xl leading-none text-white md:text-7xl">Tre steg från dröm till kvitto</h2>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
            {[
              [ShoppingBag, "01", "Välj din nivå", "Spela med en miljard, en välkänd persons uppskattade förmögenhet eller värdet av din egen aktiedröm."],
              [CreditCard, "02", "Bygg din samling", "Köp flera exemplar, byt valuta när du vill och håll dig precis innanför din personliga budget."],
              [Share2, "03", "Dela resultatet", "Skicka ett skrivskyddat resultat till en vän utan konto, databas eller riktig betalning."],
            ].map(([Icon, number, title, text]) => {
              const StepIcon = Icon as typeof ShoppingBag;
              return (
                <article key={String(number)} className="bg-[#11110f] p-7 md:p-9">
                  <div className="flex items-center justify-between"><StepIcon className="h-6 w-6 text-[var(--gold)]" /><span className="font-display text-4xl text-white/15">{String(number)}</span></div>
                  <h3 className="mt-12 font-display text-3xl text-white">{String(title)}</h3>
                  <p className="mt-4 leading-7 text-white/50">{String(text)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper-2)] py-20 text-[var(--ink)] md:py-28">
        <div className="shell grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.23em] text-[var(--gold-dark)]">Ett resultat värt att skicka</p>
            <h2 className="mt-4 font-display text-5xl leading-[.93] md:text-7xl">Du lämnade i princip bara dricks.</h2>
            <p className="mt-6 max-w-lg leading-8 text-black/58">Resultatet visar var pengarna försvann, vilka achievements du låste upp och vilken förmögenhetsdröm du började med.</p>
          </div>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-[var(--ink)] p-7 text-white shadow-[0_35px_90px_rgba(25,20,12,.25)] md:p-10">
            <Sparkles className="absolute right-8 top-8 h-6 w-6 text-[var(--gold)]" />
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Alex · Be as rich as Michael Jordan</p>
            <p className="mt-5 max-w-xl font-display text-5xl leading-[.95]">En garageplats, ett privatjet och märkligt många klockor senare.</p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["Ferrari 250 GTO", "Embraer Praetor 600", "Rolex Daytona × 25"].map((item, index) => <div key={item} className="border-t border-white/15 pt-4"><p className="text-[10px] uppercase tracking-[0.14em] text-white/35">0{index + 1}</p><p className="mt-2 text-sm text-white/70">{item}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper)] py-14 text-[var(--ink)]"><div className="shell"><LegalNotice /></div></section>
    </>
  );
}
