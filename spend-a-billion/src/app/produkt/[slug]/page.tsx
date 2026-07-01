import type { Metadata } from "next";
import { BudgetBar } from "@/components/budget-bar";
import { LegalNotice } from "@/components/legal-notice";
import { ProductCard } from "@/components/product-card";
import { ProductMedia } from "@/components/product-media";
import { ProductPurchase } from "@/components/product-purchase";
import { categoryLabels, productBySlug, products } from "@/data/products";
import { formatSek } from "@/lib/format";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug.get(slug);
  if (!product) return { title: "Produkten hittades inte" };
  return { title: product.name, description: product.shortDescription };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug.get(slug);
  if (!product) notFound();
  const related = products.filter((entry) => entry.category === product.category && entry.id !== product.id).slice(0, 3);

  return (
    <>
      <section className="bg-[var(--paper)] py-8 text-[var(--ink)]">
        <div className="shell">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-black/55 hover:text-black focus-ring"><ArrowLeft className="h-4 w-4" /> Tillbaka till shoppen</Link>
          <div className="mt-6 grid overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-2xl lg:grid-cols-2">
            <div className="min-h-[420px]"><ProductMedia product={product} priority /></div>
            <div className="flex flex-col justify-between p-6 md:p-9">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold-dark)]">{categoryLabels[product.category]}</p>
                <h1 className="mt-3 font-display text-5xl leading-[.92] md:text-7xl">{product.name}</h1>
                <p className="mt-5 font-display text-3xl text-black/75">{formatSek(product.priceSek)}</p>
                <p className="mt-5 text-lg leading-8 text-black/60">{product.description}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.12em] text-black/40">Ungefärligt pris för underhållning – inte en offert</p>
              </div>
              <div className="mt-8"><ProductPurchase product={product} /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper-2)] py-14 text-[var(--ink)]">
        <div className="shell grid gap-8 lg:grid-cols-[1fr_.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold-dark)]">Detaljer att namedroppa</p>
            <h2 className="mt-2 font-display text-5xl">Några fakta</h2>
            <ul className="mt-6 grid gap-3">
              {product.facts.map((fact) => <li key={fact} className="flex gap-3 rounded-xl border border-black/10 bg-white/55 p-4 text-black/65"><Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold-dark)]" /> {fact}</li>)}
            </ul>
          </div>
          <div className="space-y-5">
            <BudgetBar />
            <LegalNotice />
          </div>
        </div>
      </section>

      <section className="bg-[var(--paper)] py-16 text-[var(--ink)]">
        <div className="shell">
          <h2 className="font-display text-5xl">Mer i samma liga</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">{related.map((entry) => <ProductCard key={entry.id} product={entry} />)}</div>
        </div>
      </section>
    </>
  );
}
