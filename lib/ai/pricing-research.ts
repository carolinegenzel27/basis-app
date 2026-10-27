import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { getClaude, MODEL, FALLBACK_BETA, textOf, AiUnavailableError } from "./claude";

export type BusinessForResearch = {
  business_name: string;
  profession: string;
  business_description?: string | null;
  years_experience?: number | null;
};

const ServiceSchema = z.object({
  label: z.string(),
  price_min: z.number(),
  price_max: z.number(),
  source: z.string(),
});

const ResearchSchema = z.object({ services: z.array(ServiceSchema) });

export type ResearchedService = z.infer<typeof ServiceSchema>;

const RESEARCH_SYSTEM = `You are a pricing researcher for Basis, an app that helps small business owners in Israel price their services.
Search the web for current Israeli market prices (in ILS, ₪) for the business described by the user. Prefer Israeli sources such as price guides (e.g. midrag.co.il), price lists of comparable businesses, and Israeli marketplaces.
Write your findings as plain notes: for each service or product, a short Hebrew name a customer would recognize, a realistic min-max price range in ₪ for a typical order, and where the numbers came from (site name, and URL when you have one). If the web has no direct number for a service, give a careful estimate and say it is an estimate.`;

const EXTRACT_SYSTEM = `Convert pricing research notes into structured data for a Hebrew app.
- label: short Hebrew name of the service or product, as a customer would say it (e.g. "עוגת יום הולדת מעוצבת", "לק ג'ל").
- price_min / price_max: whole numbers in ILS, price_min <= price_max.
- source: one short Hebrew line naming the source, and marking estimates with "הערכה".
Keep only services that appear in the notes. Do not invent new ones.`;

// Searches the web for what businesses like this one charge, and returns a
// price list tailored to them (a baker gets cakes, a nail artist gets gel
// polish). When `serviceQuery` is given, researches only that service.
//
// Two calls on purpose: the first lets Claude search freely (web search
// results come back with citations, which can't be combined with structured
// outputs), the second turns the notes into validated JSON.
export async function researchBusinessPricing(
  business: BusinessForResearch,
  serviceQuery?: string
): Promise<ResearchedService[]> {
  const claude = getClaude();

  const about = [
    `Business name: ${business.business_name}`,
    `Profession: ${business.profession}`,
    business.business_description ? `What they sell: ${business.business_description}` : null,
    business.years_experience != null ? `Years of experience: ${business.years_experience}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const task = serviceQuery
    ? `Find the Israeli market price range for this specific service or product of theirs: "${serviceQuery}". Return 1 or 2 closely matching services.`
    : `Find the 4 to 6 services or products this kind of business most commonly sells, and their Israeli market price ranges.`;

  const messages: Anthropic.Beta.BetaMessageParam[] = [
    { role: "user", content: `${about}\n\n${task}` },
  ];

  let notes = "";
  // Web search runs a server-side loop; if it hits its iteration limit the
  // response stops with "pause_turn" and is resumed by sending it back.
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await claude.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: [FALLBACK_BETA],
      fallbacks: "default",
      output_config: { effort: "medium" },
      system: RESEARCH_SYSTEM,
      tools: [
        {
          type: "web_search_20260209",
          name: "web_search",
          max_uses: 6,
          user_location: { type: "approximate", country: "IL" },
        },
      ],
      messages,
    });

    if (response.stop_reason === "refusal") {
      throw new AiUnavailableError("research request was declined");
    }

    notes += `\n${textOf(response.content)}`;

    if (response.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: response.content });
  }

  if (!notes.trim()) {
    throw new AiUnavailableError("research returned no notes");
  }

  const extracted = await claude.beta.messages.parse({
    model: MODEL,
    max_tokens: 4000,
    betas: [FALLBACK_BETA],
    fallbacks: "default",
    output_config: { effort: "low", format: betaZodOutputFormat(ResearchSchema) },
    system: EXTRACT_SYSTEM,
    messages: [{ role: "user", content: notes }],
  });

  const services = extracted.parsed_output?.services ?? [];
  return cleanServices(services);
}

// Model output is still untrusted data - drop anything that can't be stored
// as a sane price row (the DB has check constraints on these too).
export function cleanServices(services: ResearchedService[]): ResearchedService[] {
  const seen = new Set<string>();
  return services
    .map((s) => ({
      label: s.label.trim().slice(0, 80),
      price_min: Math.round(Math.min(s.price_min, s.price_max)),
      price_max: Math.round(Math.max(s.price_min, s.price_max)),
      source: s.source.trim().slice(0, 300),
    }))
    .filter((s) => {
      if (!s.label || s.price_min <= 0 || !Number.isFinite(s.price_max)) return false;
      if (seen.has(s.label)) return false;
      seen.add(s.label);
      return true;
    })
    .slice(0, 8);
}
