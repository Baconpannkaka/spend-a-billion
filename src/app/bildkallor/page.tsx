import type { Metadata } from "next";
import { products } from "@/data/products";
import { ExternalLink, ImageIcon } from "lucide-react";

export const metadata: Metadata = { title: "Bildkällor" };

export default function ImageSourcesPage() {
  const sourced = products.filter((product) => product.imageUrl && (product.imageSourceUrl || product.imageCreator || product.imageLicense));
  return (
    <section className="bg-[var(--paper)] py-16 text-[var(--ink)]">
      <div className="shell max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-dark)]">Transparens för framtida bilder</p>
        <h1 className="mt-3 font-display text-6xl md:text-8xl">Bildkällor</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-black/60">Sidan skapas automatiskt från produktdatan. Just nu används bara egenutformade placeholders och därför finns inga externa bildkällor att lista.</p>
        {sourced.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-black/20 bg-white/50 p-10 text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-black/35" />
            <h2 className="mt-4 font-display text-4xl">Inga externa produktbilder ännu</h2>
            <p className="mt-2 text-black/50">När bildmetadata läggs in i produktfilen visas den automatiskt här.</p>
          </div>
        ) : (
          <div className="mt-10 overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-black/5"><tr><th className="p-4">Produkt</th><th className="p-4">Fotograf</th><th className="p-4">Källa</th><th className="p-4">Licens</th></tr></thead>
                <tbody>
                  {sourced.map((product) => <tr key={product.id} className="border-t border-black/10"><td className="p-4 font-semibold">{product.name}</td><td className="p-4">{product.imageCreator ?? "Ej angivet"}</td><td className="p-4">{product.imageSourceUrl ? <a href={product.imageSourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline focus-ring">Öppna källa <ExternalLink className="h-3 w-3" /></a> : "Ej angivet"}</td><td className="p-4">{product.imageLicenseUrl ? <a href={product.imageLicenseUrl} target="_blank" rel="noreferrer" className="underline focus-ring">{product.imageLicense ?? "Licens"}</a> : product.imageLicense ?? "Ej angivet"}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
