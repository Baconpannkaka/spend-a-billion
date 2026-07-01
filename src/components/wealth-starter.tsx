"use client";

import { CurrencySelect } from "@/components/currency-select";
import { currencies, currencyToSek } from "@/data/currencies";
import { wealthProfiles } from "@/data/wealth-profiles";
import { useGame } from "@/context/game-context";
import { createClassicSetup, createPersonSetup, createStockSetup } from "@/lib/budget";
import { formatCompactMoneyFromSek, formatMoneyFromSek, formatMoneyValue, formatNumber } from "@/lib/format";
import type { CurrencyCode } from "@/types";
import { ArrowRight, BarChart3, Crown, Gem, RefreshCcw, Sparkles, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Mode = "classic" | "person" | "stock";

const stockExamples = ["NVIDIA", "Tesla", "Apple", "Investor", "Spotify"];

export function WealthStarter() {
  const router = useRouter();
  const { currency, startGame, hasStarted, remaining, budgetSourceLabel, hydrated } = useGame();
  const [mode, setMode] = useState<Mode>("person");
  const [selectedPersonId, setSelectedPersonId] = useState("elon-musk");
  const [stockName, setStockName] = useState("NVIDIA");
  const [shares, setShares] = useState("1000");
  const [targetPrice, setTargetPrice] = useState("1000");
  const [quoteCurrency, setQuoteCurrency] = useState<CurrencyCode>("USD");
  const [error, setError] = useState("");

  const selectedPerson = wealthProfiles.find((profile) => profile.id === selectedPersonId) ?? wealthProfiles[0];
  const personSetup = createPersonSetup(selectedPersonId, currency);
  const personBudgetSek = personSetup?.startingBudgetSek ?? currencyToSek(selectedPerson.netWorthUsd, "USD");
  const parsedShares = Number(shares.replace(/\s/g, "").replace(",", "."));
  const parsedPrice = Number(targetPrice.replace(/\s/g, "").replace(",", "."));
  const stockSetup = useMemo(() => createStockSetup({
    stockName,
    shares: parsedShares,
    targetPrice: parsedPrice,
    quoteCurrency,
    currency,
  }), [stockName, parsedShares, parsedPrice, quoteCurrency, currency]);
  const stockBudgetSek = stockSetup?.startingBudgetSek ?? 0;

  function begin() {
    setError("");
    if (mode === "classic") {
      startGame(createClassicSetup(currency));
      router.push("/shop");
      return;
    }
    if (mode === "person") {
      if (!personSetup) return;
      startGame(personSetup);
      router.push("/shop");
      return;
    }
    if (!stockSetup) {
      setError("Fyll i ett giltigt antal aktier och en positiv drömkurs.");
      return;
    }
    startGame(stockSetup);
    router.push("/shop");
  }

  const previewBudget = mode === "classic" ? 1_000_000_000 : mode === "person" ? personBudgetSek : stockBudgetSek;

  return (
    <section className="wealth-desk" aria-labelledby="wealth-desk-title">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--gold)]">Private wealth desk</p>
          <h2 id="wealth-desk-title" className="mt-2 font-display text-3xl text-white sm:text-4xl">Välj din förmögenhet</h2>
        </div>
        <div className="text-right">
          <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-white/40">Visa allt i</p>
          <CurrencySelect />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2" role="tablist" aria-label="Välj sätt att skapa budget">
        {[
          { id: "classic" as const, label: "En miljard", Icon: Gem },
          { id: "person" as const, label: "Be as rich as", Icon: Crown },
          { id: "stock" as const, label: "Get rich on stock", Icon: TrendingUp },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={`min-h-16 rounded-xl border px-2 py-3 text-center text-xs font-semibold transition focus-ring sm:text-sm ${mode === id ? "border-[var(--gold)]/60 bg-[var(--gold)]/12 text-white" : "border-white/10 bg-white/[0.025] text-white/55 hover:bg-white/5 hover:text-white"}`}
          >
            <Icon className={`mx-auto mb-1.5 h-4 w-4 ${mode === id ? "text-[var(--gold)]" : "text-white/35"}`} />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5 min-h-[330px]">
        {mode === "classic" && (
          <div className="grid min-h-[330px] place-items-center rounded-2xl border border-white/10 bg-white/[0.025] p-7 text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10">
                <Sparkles className="h-7 w-7 text-[var(--gold)]" />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-white/40">Originalutmaningen</p>
              <p className="mt-2 font-display text-5xl text-white">{formatMoneyFromSek(1_000_000_000, currency)}</p>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/50">En svensk miljard i köpkraft, visad i din valda valuta.</p>
            </div>
          </div>
        )}

        {mode === "person" && (
          <div>
            <div className="max-h-[245px] overflow-y-auto pr-1 luxury-scrollbar">
              <div className="grid gap-2 sm:grid-cols-2">
                {wealthProfiles.map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => setSelectedPersonId(person.id)}
                    className={`group flex min-h-20 items-center gap-3 rounded-xl border p-3 text-left transition focus-ring ${selectedPersonId === person.id ? "border-[var(--gold)]/55 bg-[var(--gold)]/10" : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"}`}
                  >
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border font-display text-sm ${selectedPersonId === person.id ? "border-[var(--gold)]/45 bg-[var(--gold)]/15 text-[var(--gold)]" : "border-white/10 bg-white/5 text-white/55"}`}>{person.initials}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-white">{person.name}</span>
                      <span className="mt-0.5 block truncate text-xs text-white/40">{person.profession}</span>
                    </span>
                    <span className="shrink-0 text-right text-xs font-semibold text-[var(--gold)]">{formatCompactMoneyFromSek(currencyToSek(person.netWorthUsd, "USD"), currency)}</span>
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-white/35">Avrundade offentliga uppskattningar per 1 juli 2026. Förmögenheter förändras snabbt och används endast för underhållning.</p>
          </div>
        )}

        {mode === "stock" && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Aktie eller bolag</span>
                <input value={stockName} onChange={(event) => setStockName(event.target.value)} className="luxury-input" placeholder="Exempel: NVIDIA" maxLength={40} />
              </label>
              <label>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Antal aktier</span>
                <input value={shares} onChange={(event) => setShares(event.target.value)} inputMode="numeric" className="luxury-input" aria-describedby="stock-explanation" />
              </label>
              <label>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Drömkurs</span>
                <div className="flex overflow-hidden rounded-xl border border-white/12 bg-black/20 focus-within:border-[var(--gold)]/60 focus-within:ring-2 focus-within:ring-[var(--gold)]/15">
                  <input value={targetPrice} onChange={(event) => setTargetPrice(event.target.value)} inputMode="decimal" className="min-w-0 flex-1 bg-transparent px-4 text-white outline-none" />
                  <select value={quoteCurrency} onChange={(event) => setQuoteCurrency(event.target.value as CurrencyCode)} className="h-12 border-l border-white/10 bg-[#1b1b18] px-3 text-sm font-semibold text-white outline-none" aria-label="Aktiekursens valuta">
                    {currencies.map((entry) => <option key={entry.code} value={entry.code}>{entry.code}</option>)}
                  </select>
                </div>
              </label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Snabbval för aktienamn">
              {stockExamples.map((example) => <button key={example} type="button" onClick={() => setStockName(example)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/45 hover:border-white/20 hover:text-white focus-ring">{example}</button>)}
            </div>
            <div id="stock-explanation" className="mt-5 rounded-xl border border-[var(--gold)]/20 bg-[var(--gold)]/[0.07] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)]"><BarChart3 className="h-4 w-4" /> Din drömportfölj</div>
              <p className="mt-2 font-display text-3xl text-white">{stockBudgetSek > 0 ? formatMoneyFromSek(stockBudgetSek, currency) : "Fyll i ett scenario"}</p>
              {stockBudgetSek > 0 && <p className="mt-1 text-xs text-white/40">{formatNumber(Math.floor(parsedShares))} × {formatMoneyValue(parsedPrice, quoteCurrency, 2)}, omräknat med fasta referenskurser.</p>}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-white/10 pt-5">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Din shoppingbudget</p>
            <p className="mt-1 font-display text-3xl text-white sm:text-4xl">{previewBudget > 0 ? formatMoneyFromSek(previewBudget, currency) : "—"}</p>
          </div>
          {mode === "person" && <p className="max-w-[12rem] text-right text-xs leading-5 text-white/40">Du spelar med hela {selectedPerson.name}s uppskattade förmögenhet.</p>}
        </div>
        {error && <p className="mb-3 rounded-lg bg-red-400/10 px-3 py-2 text-sm text-red-200" role="alert">{error}</p>}
        <button type="button" onClick={begin} className="group inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-6 font-bold text-[#11100d] transition hover:-translate-y-0.5 hover:bg-[#e1ca8f] focus-ring">
          Börja drömshoppa <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
        </button>

        {hydrated && hasStarted && (
          <button type="button" onClick={() => router.push("/shop")} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/15 px-5 text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white focus-ring">
            <RefreshCcw className="h-4 w-4" /> Fortsätt {budgetSourceLabel.toLocaleLowerCase("sv-SE")} · {formatMoneyFromSek(remaining, currency)} kvar
          </button>
        )}
      </div>
    </section>
  );
}
