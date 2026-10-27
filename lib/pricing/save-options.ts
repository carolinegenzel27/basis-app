import { randomUUID } from "crypto";
import type { createClient } from "@/lib/supabase/server";
import {
  researchBusinessPricing,
  type BusinessForResearch,
} from "@/lib/ai/pricing-research";

type Supabase = Awaited<ReturnType<typeof createClient>>;

// Runs the AI market search for a business and stores the result as its
// pricing-advisor options. `replace` wipes the previous list first (a full
// re-search); otherwise the new services are added to it (a search for one
// specific service). Returns how many options were saved.
export async function researchAndSavePricingOptions(
  supabase: Supabase,
  businessProfileId: string,
  business: BusinessForResearch,
  { serviceQuery, replace }: { serviceQuery?: string; replace: boolean }
): Promise<number> {
  const services = await researchBusinessPricing(business, serviceQuery);
  if (services.length === 0) return 0;

  if (replace) {
    const { error } = await supabase
      .from("business_pricing_options")
      .delete()
      .eq("business_profile_id", businessProfileId);
    if (error) throw new Error(error.message);
  }

  const { error } = await supabase.from("business_pricing_options").insert(
    services.map((s) => ({
      business_profile_id: businessProfileId,
      // Labels are Hebrew, so they can't double as a readable key - a short
      // random key keeps (business_profile_id, project_type) unique instead.
      project_type: `ai-${randomUUID().slice(0, 8)}`,
      project_type_label: s.label,
      price_min: s.price_min,
      price_max: s.price_max,
      source: s.source,
    }))
  );
  if (error) throw new Error(error.message);

  return services.length;
}
