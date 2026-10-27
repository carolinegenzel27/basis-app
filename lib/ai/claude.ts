import Anthropic from "@anthropic-ai/sdk";

// Shared Claude client for the AI features (pricing market search, branding
// ideas). Server-only - reads ANTHROPIC_API_KEY, which must never reach the
// browser. Only imported from Server Actions.
export const MODEL = "claude-opus-5-5";

// Server-side refusal fallback: if a request is declined by a safety
// classifier, the API re-runs it on a suitable fallback model in the same call.
export const FALLBACK_BETA = "server-side-fallback-2026-07-01";

let client: Anthropic | null = null;

export function getClaude(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new AiUnavailableError("ANTHROPIC_API_KEY is not set");
  }
  client ??= new Anthropic();
  return client;
}

// Thrown for anything that should show the user a friendly "try again"
// message instead of crashing the page.
export class AiUnavailableError extends Error {}

// Joins every text block of a response into one string.
export function textOf(content: Anthropic.Beta.BetaContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

export function describeAiError(error: unknown): string {
  if (error instanceof AiUnavailableError) return error.message;
  if (error instanceof Anthropic.AuthenticationError) return "invalid Anthropic API key";
  if (error instanceof Anthropic.RateLimitError) return "rate limited";
  if (error instanceof Anthropic.APIError) return `API error ${error.status}: ${error.message}`;
  return error instanceof Error ? error.message : String(error);
}
