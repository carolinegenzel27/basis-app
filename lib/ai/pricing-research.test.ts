import { describe, it, expect, vi } from "vitest";

// cleanServices never calls the API - stub the client module so importing
// pricing-research.ts doesn't need an Anthropic key.
vi.mock("./claude", () => ({}));

import { cleanServices } from "./pricing-research";

// The AI's price list is untrusted data - cleanServices is what stands
// between it and the business_pricing_options table.
describe("cleanServices", () => {
  const base = { label: "עוגת יום הולדת", price_min: 250, price_max: 450, source: "מידרג" };

  it("keeps a valid service and rounds prices", () => {
    expect(cleanServices([{ ...base, price_min: 249.6, price_max: 450.2 }])).toEqual([
      { ...base, price_min: 250, price_max: 450 },
    ]);
  });

  it("swaps a reversed range instead of dropping it", () => {
    const [s] = cleanServices([{ ...base, price_min: 450, price_max: 250 }]);
    expect([s.price_min, s.price_max]).toEqual([250, 450]);
  });

  it("drops free / negative prices and empty labels", () => {
    expect(
      cleanServices([
        { ...base, price_min: 0 },
        { ...base, price_min: -50 },
        { ...base, label: "   " },
      ])
    ).toEqual([]);
  });

  it("drops duplicate labels and caps the list at 8", () => {
    const many = Array.from({ length: 12 }, (_, i) => ({ ...base, label: `שירות ${i}` }));
    expect(cleanServices([base, base])).toHaveLength(1);
    expect(cleanServices(many)).toHaveLength(8);
  });
});
