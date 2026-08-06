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

const styles = StyleSheet.create({
  page: { padding: 48, fontFamily: "NotoHebrew", fontSize: 12, color: "#1e293b" },
  header: { marginBottom: 28, borderBottom: "2pt solid #0f172a", paddingBottom: 14 },
  title: { fontSize: 22, fontWeight: 600, textAlign: "right" },
  subtitle: { fontSize: 11, color: "#64748b", textAlign: "right", marginTop: 4 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 13, fontWeight: 600, textAlign: "right", marginBottom: 8 },
  row: { flexDirection: "row-reverse", marginBottom: 6, gap: 4 },
  // "שם" and ":" are rendered as two separate Text nodes (see labelGroup
  // below) instead of one "שם:" string. A single Text mixing Hebrew letters
  // with an ASCII punctuation mark is the exact bug pattern that corrupted
  // "ש"ח" earlier - splitting them into pure-script pieces with zero gap
  // between them sidesteps it entirely (verified by rendering, see the
  // fix for the market-price note).
  labelGroup: { flexDirection: "row-reverse" },
  label: { color: "#64748b" },
  priceBox: {
    marginTop: 10,
    padding: 14,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    alignItems: "flex-end",
  },
  priceLabel: { fontSize: 11, color: "#64748b", marginBottom: 4 },
  priceValue: { fontSize: 22, fontWeight: 600 },
  priceNote: { fontSize: 9, color: "#94a3b8", marginTop: 6 },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    justifyContent: "center",
    fontSize: 9,
    color: "#94a3b8",
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
  // Only set when this quote was created from a pricing-advisor
  // recommendation (via pricing_recommendation_id) - lets us show the quote
  // isn't an arbitrary number, it's grounded in market data.
  marketRange: { min: number; max: number } | null;
};

export function QuoteDocument({ data }: { data: QuotePdfData }) {
  // A user-typed title can freely mix Hebrew and digits/Latin (e.g. "הצעה -
  // 10 שיעורי נהיגה"), same problem as the other free-text fields, so it
  // needs the bidi-run splitter too rather than a plain <Text>.
  const title = data.title?.trim() || DEFAULT_QUOTE_TITLE;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <BidiText style={styles.title}>{title}</BidiText>
          <BidiText style={styles.subtitle}>{`מאת: ${data.businessName}`}</BidiText>
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
          {data.marketRange && (
            <BidiText style={styles.priceNote}>
              {`המחיר מבוסס על טווח המחירים המומלץ בשוק: ${formatPrice(data.marketRange.min)}-${formatPrice(data.marketRange.max)} ש״ח`}
            </BidiText>
          )}
        </View>

        <BidiText style={styles.footer}>
          {`הצעת מחיר זו הופקה באמצעות Basis בתאריך ${formatDate(data.createdAt)}`}
        </BidiText>
      </Page>
    </Document>
  );
}
