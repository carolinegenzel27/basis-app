import { describe, it, expect } from "vitest";
import { getBusinessTheme } from "./business-theme";

describe("getBusinessTheme", () => {
  it.each([
    ["קונדיטוריה / אפייה", "sweets"],
    ["מניקור ולק ג'ל", "nails"],
    ["עיצוב שיער", "hair"],
    ["צלם אירועים", "photo"],
    ["מאמנת כושר", "fitness"],
    ["דיאטנית", "wellness"],
    ["עיצוב גרפי", "creative"],
    ["מורה לנהיגה", "driving"],
    ["שף פרטי", "food"],
  ])("%s -> %s", (profession, key) => {
    expect(getBusinessTheme(profession, "x").key).toBe(key);
  });

  it("falls back to the default theme for an unknown business", () => {
    expect(getBusinessTheme("מאלפת כלבים", "x").key).toBe("default");
  });

  it.each([
    ["קבלן שיפוצים", "construction"],
    ["אינסטלטור", "construction"],
    ["עורכת דין", "legal"],
    ["רואה חשבון", "finance"],
    ["הנהלת חשבונות", "finance"],
    ["מתווך נדל\"ן", "realestate"],
    ["אדריכלית", "architecture"],
    ["בניית אתרים", "tech"],
  ])("%s -> professional %s", (profession, key) => {
    const theme = getBusinessTheme(profession, "x");
    expect(theme.key).toBe(key);
    expect(theme.style).toBe("professional");
  });

  it("keeps playful businesses playful, with playful section titles", () => {
    const theme = getBusinessTheme("קונדיטוריה", "x");
    expect(theme.style).toBe("playful");
    expect(theme.labels.gallery).toBe("גלריה");
  });

  it("gives a contractor business-like section titles", () => {
    expect(getBusinessTheme("קבלן בנייה", "x").labels).toEqual({
      gallery: "פרויקטים נבחרים",
      documents: "רישיונות ותעודות",
      contact: "יצירת קשר",
    });
  });

  it("doesn't mistake unrelated words for a business type", () => {
    // "חלקי חילוף" contains "לק", "אופנה" contains "אופ" - neither is nails/sweets
    expect(getBusinessTheme("חלקי חילוף", "x").key).toBe("default");
    expect(getBusinessTheme("אופנה", "x").key).toBe("default");
  });

  it("is stable per slug, so a page keeps its look between visits", () => {
    expect(getBusinessTheme("צילום", "noa-photo").pattern).toBe(
      getBusinessTheme("צילום", "noa-photo").pattern
    );
  });
});
