"use client";

import { GameProvider } from "@/context/game-context";
import { ToastProvider } from "@/context/toast-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <GameProvider>{children}</GameProvider>
    </ToastProvider>
  );
}
