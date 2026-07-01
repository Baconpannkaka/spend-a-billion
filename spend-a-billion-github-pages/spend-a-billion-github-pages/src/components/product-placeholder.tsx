import { categoryLabels } from "@/data/products";
import type { Product } from "@/types";
import { Building2, CarFront, Clock3, Gem, Plane, ShipWheel } from "lucide-react";

const icons = {
  bilar: CarFront,
  klockor: Clock3,
  flyg: Plane,
  yachter: ShipWheel,
  fastigheter: Building2,
  samlarobjekt: Gem,
};

export function ProductPlaceholder({ product, compact = false }: { product: Product; compact?: boolean }) {
  const Icon = icons[product.category];
  return (
    <div className={`placeholder placeholder-${product.category} relative flex h-full min-h-56 overflow-hidden ${compact ? "min-h-44" : ""}`}>
      <div className="absolute inset-0 opacity-40" aria-hidden="true">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/20" />
        <div className="absolute -bottom-20 -left-12 h-56 w-56 rotate-12 border border-white/10" />
      </div>
      <div className="relative flex w-full flex-col justify-between p-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/70">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {categoryLabels[product.category]}
        </span>
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/55">Imagined collection</p>
          <p className={`font-display leading-[0.95] text-white ${compact ? "text-3xl" : "text-4xl md:text-5xl"}`}>{product.name}</p>
        </div>
      </div>
    </div>
  );
}
