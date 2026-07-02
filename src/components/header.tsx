"use client";

import { CurrencySelect } from "@/components/currency-select";
import { useGame } from "@/context/game-context";
import { formatCompactMoneyFromSek } from "@/lib/format";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const nav = [
  ["/", "Start"],
  ["/shop", "Shop"],
  ["/sa-fungerar-det", "Så fungerar det"],
  ["/om", "Om"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { hasStarted, remaining, currency, totalQuantity } = useGame();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(10,10,9,.94)] backdrop-blur-xl">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="focus-ring font-display text-xl tracking-wide text-white">SPEND A <span className="text-[var(--gold)]">BILLION</span></Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Huvudmeny">
          {nav.map(([href, label]) => <Link key={href} href={href} className="text-sm text-white/60 transition hover:text-white">{label}</Link>)}
        </nav>
        <div className="flex items-center gap-2.5">
          {hasStarted && <div className="hidden text-right md:block"><p className="text-[10px] uppercase tracking-[.14em] text-white/35">Kvar</p><p className="text-sm font-semibold text-white">{formatCompactMoneyFromSek(remaining, currency)}</p></div>}
          <CurrencySelect compact />
          <Link href="/varukorg" className="focus-ring relative inline-flex h-9 items-center gap-2 rounded-md border border-white/15 px-3 text-sm font-semibold text-white hover:bg-white/5">
            <ShoppingBag className="h-4 w-4" /><span className="hidden sm:inline">Varukorg</span>
            {totalQuantity > 0 && <span className="min-w-5 rounded-full bg-[var(--gold)] px-1.5 py-0.5 text-center text-[10px] font-bold text-black">{totalQuantity > 999 ? "999+" : totalQuantity}</span>}
          </Link>
          <button type="button" aria-label={open ? "Stäng meny" : "Öppna meny"} onClick={() => setOpen((value) => !value)} className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-white lg:hidden">{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
        </div>
      </div>
      {open && <nav className="border-t border-white/10 bg-[#0d0d0b] px-4 py-3 lg:hidden" aria-label="Mobilmeny">{nav.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-sm font-semibold text-white/75 hover:bg-white/5 hover:text-white">{label}</Link>)}</nav>}
    </header>
  );
}
