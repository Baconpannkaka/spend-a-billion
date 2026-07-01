import { ShieldCheck } from "lucide-react";

export function LegalNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 ${compact ? "p-4" : "p-5"}`}>
      <div className="flex gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold-dark)]" aria-hidden="true" />
        <div>
          <p className="font-semibold text-[var(--ink)]">Hundra procent fantasiköp</p>
          <p className="mt-1 text-sm leading-6 text-black/60">Inga riktiga pengar lämnar kontot. Tyvärr kommer ingen Bugatti heller.</p>
        </div>
      </div>
    </aside>
  );
}
