import path from "path";
import { Document, Page, Text, View, Font, StyleSheet } from "@react-pdf/renderer";
import { BidiText } from "./bidi-text";

// Registered once per server process. The default fonts (Helvetica etc.)
// that ship with @react-pdf/renderer have no Hebrew glyphs at all, so a
// Hebrew-covering font has to be bundled and registered explicitly.
Font.register({
  family: "NotoHebrew",
  fonts: [
    { src: path.join(process.cwd(), "lib/pdf/fonts/NotoSansHebrew-Regular.woff"), fontWeight: 400 },
    { src: path.join(process.cwd(), "lib/pdf/fonts/NotoSansHebrew-SemiBold.woff"), fontWeight: 600 },
  ],
});

// Brand blue (matches the app's blue-900/950 palette) instead of plain
// slate/black - ties the PDF visually to the rest of the product and reads
// more like an official letterhead than a plain text dump.
const BRAND = "#1e3a8a";
const BRAND_DARK = "#172554";
const MUTED = "#64748b";

const styles = StyleSheet.create({
  page: { padding: 0, fontFamily: "NotoHebrew", fontSize: 12, color: "#1e293b" },
  content: { padding: 44 },
  // Letterhead band - a filled color bar at the very top of the page gives
  // the document an "official" feel instead of plain text on white.
  letterhead: {
    backgroundColor: BRAND_DARK,
    paddingVertical: 10,
    paddingHorizontal: 44,
  },
  letterheadText: { fontSize: 10, color: "#ffffff", opacity: 0.85 },
  header: { marginBottom: 28, borderBottom: `2pt solid ${BRAND}`, paddingBottom: 14, marginTop: 20 },
  title: { fontSize: 24, fontWeight: 600, textAlign: "right", color: BRAND_DARK },
  subtitle: { fontSize: 11, color: MUTED, textAlign: "right", marginTop: 4 },
  // Label + value line in the header ("מאת: X", "תאריך: Y") - same
  // split-Text trick as labelGroup below, because "מאת:" in one Text node
  // is exactly the Hebrew+ASCII-colon mix that renders corrupted.
  subtitleRow: { flexDirection: "row-reverse", gap: 4, marginTop: 4 },
  subtitleText: { fontSize: 11, color: MUTED },
  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    textAlign: "right",
    marginBottom: 8,
    color: BRAND_DARK,
  },
  row: { flexDirection: "row-reverse", marginBottom: 6, gap: 4 },
  // "שם" and ":" are rendered as two separate Text nodes (see labelGroup
  // below) instead of one "שם:" string. A single Text mixing Hebrew letters
  // with an ASCII punctuation mark is the exact bug pattern that corrupted
  // "ש"ח" earlier - splitting them into pure-script pieces with zero gap
  // between them sidesteps it entirely (verified by rendering).
  labelGroup: { flexDirection: "row-reverse" },
  label: { color: MUTED },
  priceBox: {
    marginTop: 10,
    padding: 18,
    backgroundColor: "#eff6ff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    alignItems: "flex-end",
  },
  priceLabel: { fontSize: 11, color: BRAND, marginBottom: 4 },
  priceValue: { fontSize: 26, fontWeight: 600, color: BRAND_DARK },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 44,
    right: 44,
    justifyContent: "center",
    fontSize: 9,
    color: "#94a3b8",
    borderTop: "0.5pt solid #e2e8f0",
    paddingTop: 10,
  },
});

function formatPrice(price: number) {
  return new Intl.NumberFormat("he-IL").format(price);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

// Single source of truth for the fallback title - used both here and by the
// PDF route (which needs it to decide the <title> shown in "Content-Disposition"-
// adjacent UI, if that's ever added).
export const DEFAULT_QUOTE_TITLE = "הצעת מחיר";

export type QuotePdfData = {
  businessName: string;
  // Null/empty means "use the default" - resolved to DEFAULT_QUOTE_TITLE
  // right here in the component, so every caller gets the same fallback
  // instead of each one having to remember the default string.
  title: string | null;
  clientName: string;
  clientEmail: string;
  projectDescription: string | null;
  price: number;
  createdAt: string;
  // The date the PDF is actually generated/downloaded (not necessarily the
  // same as createdAt, which is when the quote row was first saved) - shown
  // prominently near the top so the client sees a current, real date.
  currentDate: string;
};

export function QuoteDocument({ data }: { data: QuotePdfData }) {
  // A user-typed title can freely mix Hebrew and digits/Latin (e.g. "הצעה -
  // 10 שיעורי נהיגה"), same problem as the other free-text fields, so it
  // needs the bidi-run splitter too rather than a plain <Text>.
  const title = data.title?.trim() || DEFAULT_QUOTE_TITLE;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Letterhead band - solid brand-color bar across the very top of
            the page, like a real letterhead, instead of the document just
            starting with plain text on white. */}
        <View style={styles.letterhead}>
          <BidiText style={styles.letterheadText}>Basis</BidiText>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <BidiText style={styles.title}>{title}</BidiText>
            <View style={styles.subtitleRow}>
              <View style={styles.labelGroup}>
                <Text style={styles.subtitleText}>מאת</Text>
                <Text style={styles.subtitleText}>:</Text>
              </View>
              <BidiText style={styles.subtitleText}>{data.businessName}</BidiText>
            </View>
            <View style={styles.subtitleRow}>
              <View style={styles.labelGroup}>
                <Text style={styles.subtitleText}>תאריך</Text>
                <Text style={styles.subtitleText}>:</Text>
              </View>
              <Text style={styles.subtitleText}>{formatDate(data.currentDate)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>פרטי לקוח</Text>
            <View style={styles.row}>
              <View style={styles.labelGroup}>
                <Text style={styles.label}>שם</Text>
                <Text style={styles.label}>:</Text>
              </View>
              <BidiText>{data.clientName}</BidiText>
            </View>
            <View style={styles.row}>
              <View style={styles.labelGroup}>
                <Text style={styles.label}>אימייל</Text>
                <Text style={styles.label}>:</Text>
              </View>
              <Text>{data.clientEmail}</Text>
            </View>
          </View>

          {data.projectDescription && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>תיאור הפרויקט</Text>
              <BidiText>{data.projectDescription}</BidiText>
            </View>
          )}

          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>מחיר מוצע</Text>
            <Text style={styles.priceValue}>{`${formatPrice(data.price)} ש״ח`}</Text>
          </View>
        </View>

        <BidiText style={styles.footer}>
          {`הצעת מחיר זו הופקה באמצעות Basis בתאריך ${formatDate(data.createdAt)}`}
        </BidiText>
      </Page>
    </Document>
  );
}
