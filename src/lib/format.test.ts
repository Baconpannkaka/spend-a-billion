import { describe, expect, it } from "vitest";
import { formatSek } from "@/lib/format";

describe("formatSek", () => {
  it("formaterar svenska kronor med svenska tusentalsavgränsare", () => {
    expect(formatSek(1_000_000_000)).toBe("1 000 000 000 kr");
    expect(formatSek(900_000)).toBe("900 000 kr");
  });
});
