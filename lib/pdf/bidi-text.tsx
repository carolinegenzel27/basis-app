// @react-pdf/renderer has no real bidi (mixed-direction) support: a Hebrew
// string that also contains numbers (e.g. "חבילת 10 שיעורים") renders with
// corrupted characters, because the library does not reorder or isolate the
// embedded left-to-right run the way a browser would.
//
// Fix: split the text into runs that are each *purely* Hebrew or *purely*
// non-Hebrew, keep them in their original (typed/logical) order, and lay
// them out as separate <Text> nodes inside a row-reverse flex row. Since
// row-reverse places the first child on the right, logical order already
// produces the correct visual order - no actual bidi algorithm needed for
// this simpler case (verified by hand against sample quote text).
import { Text, View } from "@react-pdf/renderer";

const HEBREW_RE = /[֐-׿]/;

// Only real whitespace is treated as "attach to whichever run it's in" -
// this was tried more broadly (also treating '"'/'-' as neutral so they'd
// merge into Hebrew runs), but a single Text run mixing multiple Hebrew
// words with a hyphen or an ASCII quote turned out to corrupt on its own
// (verified by hand, not assumed) - so punctuation still gets its own run,
// same as digits. The ש"ח case is handled differently: see the ×´ note in
// QuoteDocument.tsx (use the real Hebrew gershayim character, not an ASCII
// quote, which is the typographically correct choice anyway).
const NEUTRAL_RE = /\s/;

export function splitBidiRuns(text: string): string[] {
  const runs: string[] = [];
  let current = "";
  let currentIsHebrew: boolean | null = null;

  for (const ch of text) {
    const isHebrew = HEBREW_RE.test(ch);
    const isNeutral = NEUTRAL_RE.test(ch);

    if (currentIsHebrew === null) {
      currentIsHebrew = isHebrew;
      current = ch;
    } else if (isHebrew === currentIsHebrew || isNeutral) {
      current += ch;
    } else {
      runs.push(current);
      current = ch;
      currentIsHebrew = isHebrew;
    }
  }
  if (current) runs.push(current);
  return runs.map((r) => r.trim()).filter(Boolean);
}

export function BidiText({
  children,
  style,
}: {
  children: string;
  style?: object;
}) {
  const runs = splitBidiRuns(children ?? "");
  return (
    <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", gap: 3, ...style }}>
      {runs.map((run, i) => (
        <Text key={i}>{run}</Text>
      ))}
    </View>
  );
}
