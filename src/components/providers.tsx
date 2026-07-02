"use client";

import { CatalogProvider } from "@/catalog/catalog-context";
import { GameProvider } from "@/context/game-context";
import { ToastProvider } from "@/context/toast-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CatalogProvider>
        <GameProvider>{children}</GameProvider>
      </CatalogProvider>
    </ToastProvider>
  );
}
