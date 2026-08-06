import { describe, it, expect } from "vitest";
import { signUpSchema, signInSchema } from "./auth";
import { businessProfileSchema } from "./business-profile";
import { quoteSchema } from "./quotes";
import {
  profileContentSchema,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
} from "./profile-media";
import { pricingRequestSchema } from "./pricing";
import { fitAssessmentSchema } from "./fit-assessment";
import { brandingSchema } from "./branding";

// These schemas are the app's real security/data-integrity boundary - every
// Server Action re-validates with the same schema server-side, so a hole
// here is a hole in the whole app, not just a nicer error message. Each
// block below tests both the "should pass" and "should reject" side of the
// schema's actual rule (min/max length, format, numeric range).

describe("signUpSchema / signInSchema", () => {
  it("accepts a valid email + password", () => {
    expect(
      signUpSchema.safeParse({ email: "test@example.com", password: "abcdef" }).success
    ).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(
      signUpSchema.safeParse({ email: "not-an-email", password: "abcdef" }).success
    ).toBe(false);
  });

  it("rejects a password under 6 characters on sign-up", () => {
    expect(
      signUpSchema.safeParse({ email: "test@example.com", password: "12345" }).success
    ).toBe(false);
  });

  it("sign-in only requires a non-empty password (no minimum length)", () => {
    // Sign-in intentionally doesn't re-enforce the 6-char rule - an existing
    // account could predate the rule, so sign-in must accept any non-empty
    // password and let Supabase itself say yes/no.
    expect(
      signInSchema.safeParse({ email: "test@example.com", password: "x" }).success
    ).toBe(true);
    expect(
      signInSchema.safeParse({ email: "test@example.com", password: "" }).success
    ).toBe(false);
  });
});

describe("businessProfileSchema", () => {
  const valid = {
    business_name: "נהיגה עם דנה",
    profession: "driving_instructor",
    years_experience: 5,
    team_size: 1,
    slug: "dana-driving",
  };

  it("accepts a fully valid profile", () => {
    expect(businessProfileSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an unknown profession", () => {
    expect(
      businessProfileSchema.safeParse({ ...valid, profession: "plumber" }).success
    ).toBe(false);
  });

  it("rejects a slug with uppercase letters or spaces", () => {
    expect(businessProfileSchema.safeParse({ ...valid, slug: "Dana Driving" }).success).toBe(
      false
    );
  });

  it("rejects a slug with Hebrew characters", () => {
    expect(businessProfileSchema.safeParse({ ...valid, slug: "דנה-נהיגה" }).success).toBe(
      false
    );
  });

  it("accepts a slug with only lowercase letters, digits, and hyphens", () => {
    expect(businessProfileSchema.safeParse({ ...valid, slug: "dana-2" }).success).toBe(true);
  });

  it("rejects years_experience above 80", () => {
    expect(businessProfileSchema.safeParse({ ...valid, years_experience: 81 }).success).toBe(
      false
    );
  });

  it("rejects team_size of 0 (minimum is 1)", () => {
    expect(businessProfileSchema.safeParse({ ...valid, team_size: 0 }).success).toBe(false);
  });
});

describe("quoteSchema", () => {
  const valid = {
    business_profile_id: "11111111-1111-4111-8111-111111111111",
    client_name: "יעל כהן",
    client_email: "yael@example.com",
    price: 250,
  };

  it("accepts a minimal valid quote", () => {
    expect(quoteSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a non-UUID business_profile_id", () => {
    expect(
      quoteSchema.safeParse({ ...valid, business_profile_id: "not-a-uuid" }).success
    ).toBe(false);
  });

  it("rejects a zero or negative price", () => {
    expect(quoteSchema.safeParse({ ...valid, price: 0 }).success).toBe(false);
    expect(quoteSchema.safeParse({ ...valid, price: -50 }).success).toBe(false);
  });

  it("coerces a numeric string price (form fields arrive as strings)", () => {
    const result = quoteSchema.safeParse({ ...valid, price: "250" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.price).toBe(250);
  });

  it("rejects a project_description over 300 characters", () => {
    expect(
      quoteSchema.safeParse({ ...valid, project_description: "א".repeat(301) }).success
    ).toBe(false);
  });

  it("rejects an invalid client_email", () => {
    expect(quoteSchema.safeParse({ ...valid, client_email: "not-an-email" }).success).toBe(
      false
    );
  });
});

describe("profileContentSchema", () => {
  const validId = "11111111-1111-4111-8111-111111111111";

  it("accepts all fields empty (page is fillable gradually)", () => {
    expect(
      profileContentSchema.safeParse({
        business_profile_id: validId,
        about_me: "",
        experience_text: "",
        additional_info: "",
      }).success
    ).toBe(true);
  });

  it("rejects about_me over 600 characters", () => {
    expect(
      profileContentSchema.safeParse({
        business_profile_id: validId,
        about_me: "א".repeat(601),
      }).success
    ).toBe(false);
  });
});

describe("file upload constants (profile-media)", () => {
  it("caps file size at 5MB", () => {
    expect(MAX_FILE_SIZE_BYTES).toBe(5 * 1024 * 1024);
  });

  it("only allows image mime types for photos", () => {
    expect(ALLOWED_IMAGE_TYPES).toEqual(["image/jpeg", "image/png", "image/webp"]);
  });

  it("only allows pdf/jpeg/png for documents", () => {
    expect(ALLOWED_DOCUMENT_TYPES).toEqual(["application/pdf", "image/jpeg", "image/png"]);
  });
});

describe("pricingRequestSchema", () => {
  it("rejects an empty project_type", () => {
    expect(
      pricingRequestSchema.safeParse({
        business_profile_id: "11111111-1111-4111-8111-111111111111",
        project_type: "",
      }).success
    ).toBe(false);
  });
});

describe("fitAssessmentSchema", () => {
  it("rejects an answer outside the 1-4 range", () => {
    // FIT_QUESTIONS currently has 5 questions - schema requires exactly
    // that many answers, so this array matches the length but has one
    // value (5) outside the allowed 1-4 range.
    const result = fitAssessmentSchema.safeParse({
      business_profile_id: "11111111-1111-4111-8111-111111111111",
      answers: [1, 2, 3, 5, 1],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an answers array with the wrong length", () => {
    const result = fitAssessmentSchema.safeParse({
      business_profile_id: "11111111-1111-4111-8111-111111111111",
      answers: [1, 2, 3],
    });
    expect(result.success).toBe(false);
  });

  it("accepts exactly 5 in-range answers", () => {
    const result = fitAssessmentSchema.safeParse({
      business_profile_id: "11111111-1111-4111-8111-111111111111",
      answers: [1, 2, 3, 4, 1],
    });
    expect(result.success).toBe(true);
  });
});

describe("brandingSchema", () => {
  it("rejects a phrase that's really a full sentence (over 60 chars)", () => {
    const tooLong = "א".repeat(61);
    const result = brandingSchema.safeParse({
      ideal_client: tooLong,
      problem_solved: "בעיה",
      desired_outcome: "תוצאה",
      unique_approach: "גישה",
      credential: "ותק",
      cta: "לתאם שיחה",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a phrase under 3 characters", () => {
    const result = brandingSchema.safeParse({
      ideal_client: "אב",
      problem_solved: "בעיה",
      desired_outcome: "תוצאה",
      unique_approach: "גישה",
      credential: "ותק",
      cta: "לתאם שיחה",
    });
    expect(result.success).toBe(false);
  });
});
