import { formatCompactMoneyFromSek, formatSek } from "@/lib/format";
import { describe, expect, it } from "vitest";

describe("format", () => {
  it("formaterar svenska kronor", () => expect(formatSek(45_000_000)).toMatch(/45[\s\u00a0]000[\s\u00a0]000[\s\u00a0]kr/));
  it("förkortar mycket stora belopp", () => expect(formatCompactMoneyFromSek(10_700_000_000, "SEK")).toContain("md"));
});
