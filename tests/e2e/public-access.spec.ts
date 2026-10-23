import { test, expect } from "@playwright/test";
import {
  anonClient,
  createOnboardedTestUser,
  deleteTestUser,
  seedBrandingAndDocument,
  signedInClient,
  testEmail,
  TEST_PASSWORD,
} from "./helpers";

// Requires supabase/fix_public_access.sql to have been run.
//
// These tests skip the app's pages entirely and call the Supabase REST API
// directly with the public anon key - the same thing anyone can do after
// copying that key out of the browser. What the PAGE chooses to render
// doesn't matter here; what the DATABASE agrees to return is what's public.
test.describe("public data access through the API", () => {
  const ownerEmail = testEmail("public-owner");
  const visitorEmail = testEmail("public-visitor");
  let businessProfileId: string;
  let documentId: string;

  test.beforeAll(async () => {
    const owner = await createOnboardedTestUser(ownerEmail, TEST_PASSWORD);
    businessProfileId = owner.businessProfileId;
    documentId = await seedBrandingAndDocument(businessProfileId);
    await createOnboardedTestUser(visitorEmail, TEST_PASSWORD);
  });

  test.afterAll(async () => {
    await deleteTestUser(ownerEmail);
    await deleteTestUser(visitorEmail);
  });

  test("the public view does not expose unpublished branding drafts, even when asked for them by name", async () => {
    const anon = anonClient();

    // Asking for the columns explicitly must fail - they aren't in the view.
    const { error } = await anon
      .from("public_business_profiles")
      .select("linkedin_text, sales_pitch")
      .eq("business_profile_id", businessProfileId);
    expect(error).not.toBeNull();

    // And "select everything" must not contain them either.
    const { data, error: starError } = await anon
      .from("public_business_profiles")
      .select("*")
      .eq("business_profile_id", businessProfileId)
      .single();
    expect(starError).toBeNull();
    expect(Object.keys(data!)).not.toContain("linkedin_text");
    expect(Object.keys(data!)).not.toContain("sales_pitch");
    expect(Object.keys(data!)).not.toContain("user_id");
    expect(JSON.stringify(data)).not.toContain("E2E-UNPUBLISHED");
  });

  test("a logged-out visitor and a logged-in non-owner see the same public documents", async () => {
    const anon = anonClient();
    const visitor = await signedInClient(visitorEmail, TEST_PASSWORD);

    const anonResult = await anon
      .from("business_profile_documents")
      .select("id")
      .eq("business_profile_id", businessProfileId);
    const visitorResult = await visitor
      .from("business_profile_documents")
      .select("id")
      .eq("business_profile_id", businessProfileId);

    expect(anonResult.data?.map((d) => d.id)).toEqual([documentId]);
    expect(visitorResult.data?.map((d) => d.id)).toEqual([documentId]);
  });

  test("a logged-in non-owner still cannot delete someone else's document", async () => {
    const visitor = await signedInClient(visitorEmail, TEST_PASSWORD);

    // RLS turns an unauthorized delete into "0 rows affected", not an error.
    const { data } = await visitor
      .from("business_profile_documents")
      .delete()
      .eq("id", documentId)
      .select("id");
    expect(data ?? []).toHaveLength(0);

    // Confirm the row really is still there.
    const { data: stillThere } = await anonClient()
      .from("business_profile_documents")
      .select("id")
      .eq("id", documentId);
    expect(stillThere).toHaveLength(1);
  });
});
