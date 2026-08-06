import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { QuoteDocument } from "@/lib/pdf/QuoteDocument";

// @react-pdf/renderer needs real filesystem + Node APIs (it reads the font
// files off disk) - the default Edge runtime doesn't have those.
export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "יש להתחבר מחדש" }, { status: 401 });
  }

  // RLS already limits this to quotes owned by the current user, but the
  // explicit business_profiles join also gives us the business name to
  // print on the PDF in one round trip.
  const { data: quote } = await supabase
    .from("quotes")
    .select(
      "client_name, client_email, project_description, price, created_at, pricing_recommendation_id, document_title, business_profiles(business_name)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!quote) {
    return NextResponse.json({ error: "הצעת המחיר לא נמצאה" }, { status: 404 });
  }

  const businessName =
    (quote.business_profiles as unknown as { business_name: string } | null)
      ?.business_name ?? "Basis";

  // Only quotes created straight from the pricing advisor carry this link -
  // manually-entered quotes have no market data to cite, so marketRange
  // stays null and the PDF simply omits the note.
  let marketRange: { min: number; max: number } | null = null;
  if (quote.pricing_recommendation_id) {
    const { data: recommendation } = await supabase
      .from("pricing_recommendations")
      .select("recommended_min, recommended_max")
      .eq("id", quote.pricing_recommendation_id)
      .maybeSingle();

    if (recommendation) {
      marketRange = {
        min: Number(recommendation.recommended_min),
        max: Number(recommendation.recommended_max),
      };
    }
  }

  const buffer = await renderToBuffer(
    QuoteDocument({
      data: {
        businessName,
        title: quote.document_title,
        clientName: quote.client_name,
        clientEmail: quote.client_email,
        projectDescription: quote.project_description,
        price: Number(quote.price),
        createdAt: quote.created_at,
        marketRange,
      },
    })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="quote-${id}.pdf"`,
    },
  });
}
