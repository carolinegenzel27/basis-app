// Businesses created before profession became free text store one of three
// fixed keys - map those back to Hebrew. Anything else is already the
// owner's own wording and is shown as-is.
const LEGACY_PROFESSION_LABELS: Record<string, string> = {
  driving_instructor: "מורה לנהיגה",
  dietitian: "דיאטן/ית",
  private_chef: "שף/ית פרטי/ת",
};

export function professionLabel(profession: string): string {
  return LEGACY_PROFESSION_LABELS[profession] ?? profession;
}
