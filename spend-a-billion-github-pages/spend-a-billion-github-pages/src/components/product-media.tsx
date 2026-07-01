import type { Product } from "@/types";
import Image from "next/image";
import { ProductPlaceholder } from "@/components/product-placeholder";

export function ProductMedia({ product, compact = false, priority = false }: { product: Product; compact?: boolean; priority?: boolean }) {
  if (!product.imageUrl) return <ProductPlaceholder product={product} compact={compact} />;
  return (
    <div className="relative h-full min-h-56 overflow-hidden bg-neutral-900">
      <Image src={product.imageUrl} alt={product.imageAlt ?? product.name} fill priority={priority} className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
    </div>
  );
}
