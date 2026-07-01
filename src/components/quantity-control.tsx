import { Minus, Plus } from "lucide-react";

export function QuantityControl({ quantity, onDecrease, onIncrease, disabledIncrease = false, label }: { quantity: number; onDecrease: () => void; onIncrease: () => void; disabledIncrease?: boolean; label: string }) {
  return (
    <div className="inline-flex items-center rounded-full border border-black/15 bg-white" aria-label={label}>
      <button type="button" onClick={onDecrease} className="grid h-11 w-11 place-items-center rounded-full hover:bg-black/5 focus-ring" aria-label="Minska antal">
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-10 text-center text-sm font-semibold" aria-live="polite">{quantity}</span>
      <button type="button" onClick={onIncrease} disabled={disabledIncrease} className="grid h-11 w-11 place-items-center rounded-full hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-35 focus-ring" aria-label="Öka antal">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
