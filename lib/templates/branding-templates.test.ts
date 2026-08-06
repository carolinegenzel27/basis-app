import { describe, it, expect } from "vitest";
import { generateMarketingContent } from "./branding-templates";
import type { BrandingAnswers } from "@/lib/validations/branding";

// generateMarketingContent is the "no external AI" content engine - every
// answer gets slotted into a fixed sentence template. These tests confirm
// every one of the six answers actually ends up in the generated output
// (a template typo that drops a field is otherwise invisible until a real
// user notices their answer missing from the marketing text).

const SAMPLE_ANSWERS: BrandingAnswers = {
  ideal_client: "מורים חדשים",
  problem_solved: "פחד מבחינה",
  desired_outcome: "רישיון נהיגה",
  unique_approach: "שיעורים אישיים",
  credential: "15 שנות ניסיון",
  cta: "לתאם שיעור ניסיון",
};

describe("generateMarketingContent", () => {
  it("returns all four content fields", () => {
    const result = generateMarketingContent(SAMPLE_ANSWERS);
    expect(result).toHaveProperty("uvp_statement");
    expect(result).toHaveProperty("website_text");
    expect(result).toHaveProperty("linkedin_text");
    expect(result).toHaveProperty("sales_pitch");
  });

  it("includes every answer somewhere in the combined output", () => {
    const result = generateMarketingContent(SAMPLE_ANSWERS);
    const combined = Object.values(result).join(" ");
    for (const value of Object.values(SAMPLE_ANSWERS)) {
      expect(combined).toContain(value);
    }
  });

  it("uvp_statement reuses ideal_client, problem_solved, desired_outcome, and unique_approach", () => {
    const result = generateMarketingContent(SAMPLE_ANSWERS);
    expect(result.uvp_statement).toContain(SAMPLE_ANSWERS.ideal_client);
    expect(result.uvp_statement).toContain(SAMPLE_ANSWERS.problem_solved);
    expect(result.uvp_statement).toContain(SAMPLE_ANSWERS.desired_outcome);
    expect(result.uvp_statement).toContain(SAMPLE_ANSWERS.unique_approach);
  });

  it("linkedin_text embeds the same uvp_statement produced independently", () => {
    // linkedin_text is built by string-interpolating uvp_statement into it -
    // this test locks in that composition instead of re-deriving the whole
    // template by hand.
    const result = generateMarketingContent(SAMPLE_ANSWERS);
    expect(result.linkedin_text).toContain(result.uvp_statement);
  });

  it("produces different output for different answers (not a hardcoded string)", () => {
    const other = generateMarketingContent({
      ...SAMPLE_ANSWERS,
      ideal_client: "דיאטניות עסוקות",
    });
    const result = generateMarketingContent(SAMPLE_ANSWERS);
    expect(result.uvp_statement).not.toBe(other.uvp_statement);
  });
});
