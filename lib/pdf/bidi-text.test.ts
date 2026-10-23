import { describe, it, expect } from "vitest";
import { splitBidiRuns } from "./bidi-text";

// This is the fix behind a real, previously-shipped bug: @react-pdf/renderer
// corrupts Hebrew text that's mixed with ASCII digits/punctuation in a
// single <Text> node. splitBidiRuns is the pure function that decides where
// to break the text into same-script runs - these tests lock in that
// behavior without needing to render any PDF.

describe("splitBidiRuns", () => {
  it("keeps a pure Hebrew phrase as a single run", () => {
    expect(splitBidiRuns("שלום עולם")).toEqual(["שלום עולם"]);
  });

  it("keeps a pure ASCII phrase as a single run", () => {
    expect(splitBidiRuns("Basis App")).toEqual(["Basis App"]);
  });

  it("splits Hebrew text mixed with a number into separate runs", () => {
    // The exact case from the code comment: "חבילת 10 שיעורים"
    const runs = splitBidiRuns("חבילת 10 שיעורים");
    expect(runs).toEqual(["חבילת", "10", "שיעורים"]);
  });

  it("splits a Hebrew label from a following colon", () => {
    // The "מאת:" / "תאריך:" pattern used in the PDF header - colon is
    // non-Hebrew punctuation, so it must not merge into the Hebrew run.
    const runs = splitBidiRuns("מאת:");
    expect(runs).toEqual(["מאת", ":"]);
  });

  it("returns an empty array for an empty string", () => {
    expect(splitBidiRuns("")).toEqual([]);
  });

  it("collapses internal whitespace runs into the adjacent script run", () => {
    // Neutral whitespace should attach to whichever run it's already inside,
    // not become its own run.
    const runs = splitBidiRuns("שלום  עולם");
    expect(runs).toEqual(["שלום  עולם"]);
  });

  it("trims and drops runs that are empty after trimming", () => {
    const runs = splitBidiRuns("  שלום  ");
    expect(runs).toEqual(["שלום"]);
  });
});
