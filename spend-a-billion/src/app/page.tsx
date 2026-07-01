import { LegalNotice } from "@/components/legal-notice";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";
import { formatSek } from "@/lib/format";
import { ArrowRight, CreditCard, Share2, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const featured = products.filter((product) => product.featured).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <div className="absolute left-[55%] top-[-15rem] h-[44rem] w-[44rem] rounded-full border border-[var(--gold)]/30" />
          <div className="absolute left-[70%] top-[8rem] h-[24rem] w-[24rem] rotate-45 border border-white/10" />
        </div>
        <div className="shell relative grid min-h-[78vh] items-center gap-12 py-20 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">Fantasishopping på högsta nivå</p>
            <h1 className="max-w-4xl font-display text-[clamp(4rem,10vw,8.5rem)] leading-[0.83] tracking-[-0.045em] text-white">
              Du har fått en miljard. <span className="text-[var(--gold)]">Vad köper du?</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">
              Fyll din virtuella samling med hyperbilar, privatjet, yachter och extrema upplevelser. Kom så nära noll som möjligt utan att spräcka budgeten.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/shop" className="inline-flex min-h-13 items-center gap-2 rounded-full bg-[var(--gold)] px-6 font-bold text-black transition hover:-translate-y-0.5 hover:bg-[#e0c783] focus-ring">
                Börja shoppa <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="#sa-fungerar-det" className="inline-flex min-h-13 items-center rounded-full border border-white/20 px-6 font-semibold text-white hover:bg-white/5 focus-ring">
                Se hur det fungerar
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rotate-3 rounded-[2rem] border border-[var(--gold)]/30" aria-hidden="true" />
            <div className="relative rounded-[1.75rem] border border-white/12 bg-[#161614] p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Virtuell plånbok</p>
                <Sparkles className="h-5 w-5 text-[var(--gold)]" />
              </div>
              <p className="mt-10 font-display text-5xl leading-none text-white">1 000 000 000 kr</p>
              <p className="mt-3 text-sm text-white/50">Din miljard väntar.</p>
              <div className="mt-10 h-px bg-white/10" />
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-white/45">Status</span>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-300">Redo att spenderas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper)] py-20 text-[var(--ink)]">
        <div className="shell">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-dark)]">Några dåliga idéer</p>
              <h2 className="mt-3 max-w-3xl font-display text-5xl leading-none md:text-7xl">Börja stort. Justera sen.</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 font-semibold hover:underline focus-ring">Se alla 40 produkter <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section id="sa-fungerar-det" className="py-20">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">Tre steg. En miljard.</p>
            <h2 className="mt-3 font-display text-5xl leading-none text-white md:text-7xl">Så fungerar det</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [ShoppingBag, "01", "Fyll varukorgen", "Välj bland 40 lyxprodukter och köp gärna flera av samma. Du får aldrig överskrida budgeten."],
              [CreditCard, "02", "Genomför fantasiköpet", "Använd BILLIONAIRE BLACK. Kortet är fejk, fälten är låsta och inga pengar kan dras."],
              [Share2, "03", "Utmana en vän", "Skapa en kompakt delningslänk som fungerar utan konto, databas eller inloggning."],
            ].map(([Icon, number, title, text]) => {
              const StepIcon = Icon as typeof ShoppingBag;
              return (
                <article key={String(number)} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                  <div className="flex items-center justify-between">
                    <StepIcon className="h-6 w-6 text-[var(--gold)]" />
                    <span className="font-display text-3xl text-white/20">{String(number)}</span>
                  </div>
                  <h3 className="mt-9 font-display text-3xl text-white">{String(title)}</h3>
                  <p className="mt-3 leading-7 text-white/55">{String(text)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper-2)] py-20 text-[var(--ink)]">
        <div className="shell grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-dark)]">Exempelresultat</p>
            <h2 className="mt-3 font-display text-5xl leading-none md:text-6xl">Nästan obehagligt bra spenderat.</h2>
            <p className="mt-5 max-w-xl leading-7 text-black/60">”Jag fick en miljard att spendera. Det här köpte jag.” Resultatet kan delas direkt med en länk – helt utan konto.</p>
          </div>
          <div className="rounded-[1.5rem] bg-[var(--ink)] p-6 text-white shadow-2xl md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">Alex fantasiköp</p>
                <p className="mt-2 font-display text-4xl">{formatSek(997_500_000)}</p>
              </div>
              <span className="rounded-full border border-[var(--gold)]/35 px-3 py-1 text-xs text-[var(--gold)]">2 500 000 kr kvar</span>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["1× Ferrari 250 GTO", "1× Embraer Praetor 600", "25× Rolex Daytona"].map((item) => <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">{item}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper)] py-14 text-[var(--ink)]">
        <div className="shell"><LegalNotice /></div>
      </section>
    </>
  );
}
