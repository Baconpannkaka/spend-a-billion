import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ShopClient } from "@/components/shop-client";
import { GameProvider } from "@/context/game-context";
import { ToastProvider } from "@/context/toast-context";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("ShopClient", () => {
  it("renderar shoppsidan och produktutbudet", async () => {
    render(<ToastProvider><GameProvider><ShopClient /></GameProvider></ToastProvider>);
    expect(screen.getByRole("heading", { name: /Shoppa utan rimliga gränser/i })).toBeInTheDocument();
    expect((await screen.findAllByText("Bugatti Tourbillon")).length).toBeGreaterThan(0);
    expect(screen.getByText("40 produkter")).toBeInTheDocument();
  });
});
