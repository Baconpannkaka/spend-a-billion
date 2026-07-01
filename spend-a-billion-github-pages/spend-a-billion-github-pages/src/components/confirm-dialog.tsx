"use client";

import { useEffect, useRef } from "react";

export function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onClose }: { open: boolean; title: string; description: string; confirmLabel: string; onConfirm: () => void; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} onCancel={onClose} onClose={onClose} className="w-[min(92vw,480px)] rounded-2xl bg-[var(--paper)] p-0 text-[var(--ink)] shadow-2xl backdrop:bg-black/70">
      <div className="p-6">
        <h2 className="font-display text-3xl">{title}</h2>
        <p className="mt-3 leading-7 text-black/60">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="min-h-11 rounded-full border border-black/15 px-5 font-semibold hover:bg-black/5 focus-ring">Avbryt</button>
          <button type="button" onClick={() => { onConfirm(); onClose(); }} className="min-h-11 rounded-full bg-[var(--ink)] px-5 font-semibold text-white hover:bg-black focus-ring">{confirmLabel}</button>
        </div>
      </div>
    </dialog>
  );
}
