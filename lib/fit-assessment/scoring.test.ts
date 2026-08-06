import { describe, it, expect } from "vitest";
import { scoreFitAssessment } from "./scoring";
import { FIT_QUESTIONS } from "./questions";

// scoreFitAssessment is pure and has no DB/network dependency, so it's a
// good first target: every branch (pricing wins, branding wins, tie) is
// reachable with plain inputs.

describe("scoreFitAssessment", () => {
  const pricingCount = FIT_QUESTIONS.filter((q) => q.category === "pricing").length;
  const brandingCount = FIT_QUESTIONS.filter((q) => q.category === "branding").length;

  it("recommends pricing when pricing answers are clearly higher", () => {
    const answers = FIT_QUESTIONS.map((q) => (q.category === "pricing" ? 4 : 1));
    const result = scoreFitAssessment(answers);
    expect(result.recommendation).toBe("pricing");
    expect(result.pricingScore).toBeGreaterThan(result.brandingScore);
  });

  it("recommends branding when branding answers are clearly higher", () => {
    const answers = FIT_QUESTIONS.map((q) => (q.category === "branding" ? 4 : 1));
    const result = scoreFitAssessment(answers);
    expect(result.recommendation).toBe("branding");
    expect(result.brandingScore).toBeGreaterThan(result.pricingScore);
  });

  it("recommends both when every answer is identical (perfect tie)", () => {
    const answers = FIT_QUESTIONS.map(() => 3);
    const result = scoreFitAssessment(answers);
    expect(result.recommendation).toBe("both");
    expect(result.pricingScore).toBe(result.brandingScore);
  });

  it("recommends both when category averages tie, even if individual answers differ", () => {
    // Pricing answers are all 3 (avg 3). Branding answers are 2 and 4
    // (avg 3) - same tied score as the identical-answers test above, but
    // reached through averaging rather than every answer being literally
    // the same number. Confirms the score is a real average, not a
    // shortcut that only works when inputs are uniform.
    const answers = FIT_QUESTIONS.map((q) => {
      if (q.category === "pricing") return 3;
      const brandingIndex = FIT_QUESTIONS.filter((x) => x.category === "branding").findIndex(
        (x) => x.id === q.id
      );
      return brandingIndex === 0 ? 2 : 4;
    });
    const result = scoreFitAssessment(answers);
    expect(result.pricingScore).toBe(3);
    expect(result.brandingScore).toBe(3);
    expect(result.recommendation).toBe("both");
  });

  it("uses an average per category, not a raw sum (question-count independence)", () => {
    // Sanity check on the averaging logic itself: scoring all-4s in one
    // category and all-1s in the other should always favor the all-4s side,
    // regardless of how many questions land in each category.
    expect(pricingCount).toBeGreaterThan(0);
    expect(brandingCount).toBeGreaterThan(0);
    const answers = FIT_QUESTIONS.map((q) => (q.category === "pricing" ? 4 : 1));
    const result = scoreFitAssessment(answers);
    expect(result.pricingScore).toBe(4);
    expect(result.brandingScore).toBe(1);
  });
});
