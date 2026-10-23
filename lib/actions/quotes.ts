"use server";

import { createClient } from "@/lib/supabase/server";
import { quoteSchema } from "@/lib/validations/quotes";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  error?: string;
};

export async function createQuote(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = quoteSchema.safeParse({
    business_profile_id: formData.get("business_profile_id"),
    pricing_recommendation_id: formData.get("pricing_recommendation_id") || null,
    client_name: formData.get("client_name"),
    client_email: formData.get("client_email"),
    project_description: formData.get("project_description") ?? "",
    price: formData.get("price"),
    document_title: formData.get("document_title") ?? "",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "יש להתחבר מחדש" };
  }

  // Ownership check - same pattern as every other action.
  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("id")
    .eq("id", parsed.data.business_profile_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!businessProfile) {
    return { success: false, error: "פרופיל עסק לא נמצא" };
  }

  const { error } = await supabase.from("quotes").insert({
    business_profile_id: businessProfile.id,
    pricing_recommendation_id: parsed.data.pricing_recommendation_id || null,
    client_name: parsed.data.client_name,
    client_email: parsed.data.client_email,
    project_description: parsed.data.project_description || null,
    price: parsed.data.price,
    document_title: parsed.data.document_title?.trim() || null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/quotes");
  return { success: true };
}

export async function deleteQuote(quoteId: string): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "יש להתחבר מחדש" };
  }

  // RLS restricts this select to quotes the current user owns, so a null
  // result here already means "not found or not yours" - gives a clearer
  // error than a silent "0 rows deleted" from the delete below.
  const { data: quote } = await supabase
    .from("quotes")
    .select("id")
    .eq("id", quoteId)
    .maybeSingle();

  if (!quote) {
    return { success: false, error: "הצעת המחיר לא נמצאה" };
  }

  const { error } = await supabase.from("quotes").delete().eq("id", quoteId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/quotes");
  return { success: true };
}
