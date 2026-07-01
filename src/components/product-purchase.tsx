"use client";

import { QuantityControl } from "@/components/quantity-control";
import { useGame } from "@/context/game-context";
import { useToast } from "@/context/toast-context";
import { formatMoneyFromSek, formatNumber } from "@/lib/format";
import { getMaxAffordableQuantity } from "@/lib/cart";
import type { Product } from "@/types";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

export function ProductPurchase({ product }: { product: Product }) {
  const { remaining, addItem, currency } = useGame();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const max = getMaxAffordableQuantity(remaining, product.priceSek);
  const canBuy = quantity <= max && max > 0;

  const purchase = () => {
    const result = addItem(product.id, quantity);
    if (result.ok) {
      showToast(`${quantity} × ${product.name} lades till.`, "success");
      setQuantity(1);
    } else {
      showToast(`Det där spräckte budgeten. Du saknar ${formatMoneyFromSek(result.missing, currency)}.`, "error");
    }
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-black/45">Antal</p>
          <p className="mt-1 text-sm text-black/55">Du har råd med {formatNumber(max)} till.</p>
        </div>
        <QuantityControl
          quantity={quantity}
          onDecrease={() => setQuantity((value) => Math.max(1, value - 1))}
          onIncrease={() => setQuantity((value) => Math.min(Math.max(1, max), value + 1))}
          disabledIncrease={quantity >= max}
          label={`Antal ${product.name}`}
        />
      </div>
      <div className="mt-5 flex items-end justify-between gap-4 border-t border-black/10 pt-5">
        <div>
          <p className="text-xs text-black/45">Summa</p>
          <p className="font-display text-3xl">{formatMoneyFromSek(product.priceSek * quantity, currency)}</p>
        </div>
        <button type="button" disabled={!canBuy} onClick={purchase} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--ink)] px-5 font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-40 focus-ring">
          <ShoppingBag className="h-4 w-4" /> Lägg till i samlingen
        </button>
      </div>
      {!canBuy && <p className="mt-3 text-sm font-medium text-red-700">Det där spräckte budgeten. Välj färre eller fortsätt med något billigare.</p>}
    </div>
  );
}
