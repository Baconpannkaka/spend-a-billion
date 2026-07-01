"use client";

import { CurrencySelect } from "@/components/currency-select";
import { useGame } from "@/context/game-context";
import { formatCompactMoneyFromSek } from "@/lib/format";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/shop", label: "Shoppa" },
  { href: "/sa-fungerar-det", label: "Så fungerar det" },
  { href: "/om", label: "Om" },
];

export function Header() {
  const pathname = usePathname();
  const { remaining, totalQuantity, hydrated, currency } = useGame();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(10,10,9,0.9)] backdrop-blur-xl">
      <div className="shell flex min-h-18 items-center justify-between gap-3 py-2">
        <Link href="/" className="font-display text-xl tracking-tight text-white focus-ring" aria-label="Spend a Billion – startsida">
          Spend a <span className="text-gold">Billion</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Huvudmeny">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`text-sm transition hover:text-white focus-ring ${pathname === link.href ? "text-white" : "text-white/55"}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div><CurrencySelect compact /></div>
          <Link href="/varukorg" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 text-sm text-white transition hover:border-[var(--gold)]/50 hover:bg-white/5 focus-ring">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">{hydrated ? formatCompactMoneyFromSek(remaining, currency) : "Din budget"}</span>
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[var(--gold)] px-1.5 text-xs font-bold text-black" aria-label={`${totalQuantity} valda produkter`}>{hydrated ? totalQuantity : 0}</span>
          </Link>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white lg:hidden focus-ring" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Stäng meny" : "Öppna meny"}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-white/10 bg-[var(--ink)] px-5 py-4 lg:hidden" aria-label="Mobilmeny">
          <div className="shell flex flex-col gap-1 px-0">
            {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-white/80 hover:bg-white/5 hover:text-white focus-ring">{link.label}</Link>)}
          </div>
        </nav>
      )}
    </header>
  );
}
