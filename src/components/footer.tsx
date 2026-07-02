import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#090908] py-10">
      <div className="shell grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div><p className="font-display text-2xl">Spend a Billion</p><p className="mt-2 max-w-xl text-sm leading-6 text-white/45">Ett oberoende fantasishopping-spel. Inga köp, betalningar eller beställningar genomförs. Speldata sparas bara lokalt i din webbläsare.</p></div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/55"><Link href="/juridiskt">Juridiskt</Link><Link href="/bildkallor">Bildkällor</Link><Link href="/om">Om projektet</Link></div>
      </div>
    </footer>
  );
}
