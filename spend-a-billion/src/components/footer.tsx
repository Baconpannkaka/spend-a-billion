import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#090909]">
      <div className="shell grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-display text-2xl text-white">Spend a Billion</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
            Ett oberoende underhållningsprojekt. Inga pengar dras, inga produkter beställs och all speldata sparas bara lokalt i din webbläsare.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/60" aria-label="Sidfot">
          <Link href="/bildkallor" className="hover:text-white focus-ring">Bildkällor</Link>
          <Link href="/juridiskt" className="hover:text-white focus-ring">Juridiskt</Link>
          <Link href="/om" className="hover:text-white focus-ring">Om projektet</Link>
        </nav>
      </div>
    </footer>
  );
}
