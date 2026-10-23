import { FIT_QUESTIONS } from "./questions";

export type FitRecommendation = "pricing" | "branding" | "both";

export type FitAssessmentResult = {
  pricingScore: number;
  brandingScore: number;
  recommendation: FitRecommendation;
};

// If the pricing/branding scores are this close (on the 1-4 scale), neither
// need is clearly bigger than the other, so we recommend both.
const TIE_THRESHOLD = 0.5;

// answers[i] is the 1-4 answer for FIT_QUESTIONS[i]. Each category's score
// is an average (not a sum), so a category with more questions doesn't
// automatically win just because it has more questions to add up.
export function scoreFitAssessment(answers: number[]): FitAssessmentResult {
  let pricingTotal = 0;
  let pricingCount = 0;
  let brandingTotal = 0;
  let brandingCount = 0;

  FIT_QUESTIONS.forEach((question, i) => {
    const value = answers[i];
    if (question.category === "pricing") {
      pricingTotal += value;
      pricingCount += 1;
    } else {
      brandingTotal += value;
      brandingCount += 1;
    }
  });

  const pricingScore = pricingTotal / pricingCount;
  const brandingScore = brandingTotal / brandingCount;
  const diff = pricingScore - brandingScore;

  let recommendation: FitRecommendation;
  if (Math.abs(diff) < TIE_THRESHOLD) {
    recommendation = "both";
  } else {
    recommendation = diff > 0 ? "pricing" : "branding";
  }

  return { pricingScore, brandingScore, recommendation };
}
