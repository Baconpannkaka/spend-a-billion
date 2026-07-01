"use client";

import { LegalNotice } from "@/components/legal-notice";
import { useGame } from "@/context/game-context";
import { formatMoneyFromSek } from "@/lib/format";
import { ArrowLeft, CheckCircle2, CreditCard, LockKeyhole, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const statuses = [
  "Kontrollerar förmögenhetsstatus…",
  "Kontaktar yachtmäklaren…",
  "Polerar din nya Bugatti…",
  "Räknar väldigt stora kvitton…",
];

export function CheckoutClient() {
  const { cart, total, remaining, name, setName, completePurchase, hydrated, currency, budgetSourceLabel } = useGame();
  const [processing, setProcessing] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!processing) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepDelay = reduced ? 120 : 650;
    const timers = statuses.map((_, index) => window.setTimeout(() => setStatusIndex(index), index * stepDelay));
    const done = window.setTimeout(() => {
      completePurchase();
      setComplete(true);
      setProcessing(false);
      window.setTimeout(() => router.push("/resultat"), reduced ? 150 : 950);
    }, statuses.length * stepDelay + (reduced ? 80 : 300));
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
  }, [processing, completePurchase, router]);

  if (!hydrated) return <div className="shell min-h-[65vh] py-16"><div className="h-80 animate-pulse rounded-2xl bg-white/5 motion-reduce:animate-none" /></div>;

  if (cart.length === 0) {
    return (
      <section className="bg-[var(--paper)] py-20 text-center text-[var(--ink)]">
        <div className="shell max-w-xl">
          <h1 className="font-display text-6xl">Kassan väntar på något dyrt</h1>
          <p className="mt-4 text-black/55">Lägg minst en produkt i varukorgen innan du försöker genomföra ditt fantasiköp.</p>
          <Link href="/shop" className="mt-7 inline-flex rounded-full bg-[var(--ink)] px-6 py-3 font-semibold text-white focus-ring">Till shoppen</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[var(--paper)] py-12 text-[var(--ink)]">
      {complete && (
        <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden="true">
          {Array.from({ length: 28 }, (_, index) => (
            <span key={index} className="absolute top-[-10%] h-3 w-2 animate-[fall_1.2s_ease-in_forwards] bg-[var(--gold)] motion-reduce:hidden" style={{ left: `${(index * 37) % 100}%`, animationDelay: `${(index % 7) * 70}ms`, transform: `rotate(${index * 29}deg)` }} />
          ))}
        </div>
      )}
      <style>{`@keyframes fall { to { transform: translateY(115vh) rotate(540deg); opacity: 0; } }`}</style>
      <div className="shell">
        <Link href="/varukorg" className="inline-flex items-center gap-2 text-sm font-semibold text-black/55 hover:text-black focus-ring"><ArrowLeft className="h-4 w-4" /> Tillbaka till varukorgen</Link>
        <div className="mt-7 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold-dark)]">Fantasikassan</p>
            <h1 className="mt-3 font-display text-6xl leading-none md:text-8xl">Sista steget. Helt utan konsekvenser.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-black/60">Du handlar med scenariot ”{budgetSourceLabel}”. Välj namnet som ska stå på resultatet. Kortuppgifterna är visuella, låsta och fullständigt påhittade.</p>

            <label className="mt-8 block max-w-xl">
              <span className="mb-2 block text-sm font-semibold">Namn på köparen</span>
              <input value={name} onChange={(event) => setName(event.target.value)} maxLength={60} className="h-13 w-full rounded-xl border border-black/15 bg-white px-4 outline-none focus:border-[var(--gold-dark)] focus:ring-2 focus:ring-[var(--gold)]/25" placeholder="Future Billionaire" />
            </label>

            <div className="mt-8 max-w-2xl rounded-[1.6rem] bg-[#10100f] p-6 text-white shadow-2xl md:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] text-[var(--gold)]">BILLIONAIRE BLACK</p>
                  <p className="mt-1 text-xs text-white/40">VIRTUAL · UNLIMITED IMAGINATION</p>
                </div>
                <CreditCard className="h-8 w-8 text-[var(--gold)]" />
              </div>
              <div className="mt-12 h-10 w-14 rounded-md bg-gradient-to-br from-[#e2cb91] to-[#8f7438]" aria-hidden="true" />
              <p className="mt-8 font-mono text-[clamp(1.15rem,4vw,1.8rem)] tracking-[0.12em]">4242 4242 4242 4242</p>
              <div className="mt-7 grid grid-cols-[1fr_auto_auto] gap-5 text-xs uppercase tracking-[0.12em]">
                <div><p className="text-white/35">Kortinnehavare</p><p className="mt-1 max-w-[230px] truncate text-white">{name.trim() || "Future Billionaire"}</p></div>
                <div><p className="text-white/35">Giltigt till</p><p className="mt-1">12/99</p></div>
                <div><p className="text-white/35">CVC</p><p className="mt-1">000</p></div>
              </div>
            </div>
          </div>

          <aside className="sticky top-24 space-y-5">
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-xl">
              <div className="flex items-center gap-2 text-sm font-semibold"><LockKeyhole className="h-4 w-4 text-[var(--gold-dark)]" /> Simulerad betalning</div>
              <dl className="mt-6 space-y-4">
                <div className="flex justify-between gap-4"><dt className="text-black/50">Fantasiköp</dt><dd className="font-semibold">{formatMoneyFromSek(total, currency)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-black/50">Kvar efter köp</dt><dd className="font-semibold text-[var(--gold-dark)]">{formatMoneyFromSek(remaining, currency)}</dd></div>
              </dl>
              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-semibold leading-6 text-red-900">Detta är ett fantasiköp. Inga pengar dras och inga produkter beställs.</div>

              {processing ? (
                <div className="mt-6 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-5 text-center" aria-live="polite">
                  <Sparkles className="mx-auto h-6 w-6 animate-pulse text-[var(--gold-dark)] motion-reduce:animate-none" />
                  <p className="mt-3 font-semibold">{statuses[statusIndex]}</p>
                </div>
              ) : complete ? (
                <div className="mt-6 rounded-xl bg-emerald-50 p-5 text-center text-emerald-900" aria-live="polite">
                  <CheckCircle2 className="mx-auto h-7 w-7" />
                  <p className="mt-2 font-semibold">Fantasiköpet är klart!</p>
                  <p className="mt-1 text-sm">Öppnar ditt resultat…</p>
                </div>
              ) : (
                <button type="button" onClick={() => setProcessing(true)} className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-6 font-bold text-white hover:bg-black focus-ring">
                  Genomför fantasiköpet <Sparkles className="h-4 w-4" />
                </button>
              )}
            </div>
            <LegalNotice compact />
          </aside>
        </div>
      </div>
    </section>
  );
}
