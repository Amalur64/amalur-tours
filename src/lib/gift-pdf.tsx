// Utilitaire partagé pour générer le PDF bon cadeau Amalur Tours
// Utilisé par /api/gift-pdf (téléchargement direct) et sendGiftVoucherEmail (envoi auto)

import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 0,
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: "#C0392B",
    paddingVertical: 28,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  pattern: {
    backgroundColor: "#A93226",
    height: 6,
  },
  body: {
    paddingHorizontal: 36,
    paddingTop: 24,
    paddingBottom: 16,
  },
  recipientBox: {
    backgroundColor: "#FDF2F0",
    borderRadius: 10,
    padding: 20,
    marginBottom: 14,
    borderLeft: "4 solid #C0392B",
  },
  recipientLabel: {
    fontSize: 9,
    color: "#C0392B",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },
  recipientName: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#2C3E50",
    marginBottom: 3,
  },
  fromText: {
    fontSize: 11,
    color: "#7F8C8D",
  },
  voucherBox: {
    backgroundColor: "#C0392B",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  voucherLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  voucherName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  voucherDescription: {
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  voucherPrice: {
    fontSize: 34,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  messageBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  messageLabel: {
    fontSize: 9,
    color: "#7F8C8D",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  messageText: {
    fontSize: 12,
    color: "#2C3E50",
    lineHeight: 1.5,
    fontStyle: "italic",
  },
  codeBox: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 14,
    border: "2 dashed #C0392B",
    alignItems: "center",
  },
  codeLabel: {
    fontSize: 9,
    color: "#7F8C8D",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  codeText: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#C0392B",
    letterSpacing: 4,
  },
  validityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  validityBox: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 3,
    alignItems: "center",
  },
  validityLabel: {
    fontSize: 8,
    color: "#7F8C8D",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  validityValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#2C3E50",
  },
  howToBox: {
    backgroundColor: "#EAF4FB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 0,
    borderLeft: "4 solid #2980B9",
  },
  howToTitle: {
    fontSize: 9,
    color: "#2980B9",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  howToRow: {
    flexDirection: "row",
    marginBottom: 3,
    alignItems: "flex-start",
  },
  howToBullet: {
    fontSize: 10,
    color: "#2980B9",
    fontFamily: "Helvetica-Bold",
    marginRight: 6,
    width: 14,
  },
  howToText: {
    fontSize: 10,
    color: "#2C3E50",
    flex: 1,
    lineHeight: 1.4,
  },
  footer: {
    backgroundColor: "#2C3E50",
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  footerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: "1 solid rgba(255,255,255,0.15)",
  },
  footerBrand: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
  },
  footerTagline: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },
  footerContactBlock: {
    alignItems: "flex-end",
  },
  footerEmail: {
    fontSize: 12,
    color: "#E8A87C",
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  footerWebsite: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 2,
  },
  footerLocation: {
    fontSize: 10,
    color: "rgba(255,255,255,0.55)",
  },
  footerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerNote: {
    fontSize: 9,
    color: "rgba(255,255,255,0.45)",
    fontStyle: "italic",
  },
  footerLang: {
    fontSize: 9,
    color: "rgba(255,255,255,0.45)",
  },
});

export function generateVoucherCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "AMALUR-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
    if (i === 3) code += "-";
  }
  return code;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export interface GiftPdfData {
  voucherLabel: string;
  price: number; // en euros
  recipientName: string;
  senderName: string;
  message?: string;
  voucherId: string;
  voucherCode?: string; // si déjà généré, sinon on en crée un nouveau
}

const voucherDescriptions: Record<string, string> = {
  solo: "1 adulte · Tour Biarritz ou Bayonne",
  couple: "2 adultes · Tour Biarritz ou Bayonne",
  "family-child": "1 adulte + 1 enfant · Tour Biarritz ou Bayonne",
  family: "2 adultes + 1 enfant · Tour Biarritz ou Bayonne",
};

export async function generateGiftPdfBuffer(data: GiftPdfData): Promise<Buffer> {
  const voucherCode = data.voucherCode || generateVoucherCode();
  const purchaseDate = new Date();
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  const description = voucherDescriptions[data.voucherId] || "Tour guidé au Pays Basque";

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BON CADEAU · AMALUR TOURS</Text>
          <Text style={styles.headerSubtitle}>Visites guidées authentiques au Pays Basque</Text>
        </View>

        <View style={styles.pattern} />

        {/* Corps */}
        <View style={styles.body}>

          {/* Destinataire */}
          <View style={styles.recipientBox}>
            <Text style={styles.recipientLabel}>Offert a</Text>
            <Text style={styles.recipientName}>{data.recipientName}</Text>
            <Text style={styles.fromText}>avec tout l'amour de {data.senderName}</Text>
          </View>

          {/* Forfait */}
          <View style={styles.voucherBox}>
            <View>
              <Text style={styles.voucherLabel}>Votre experience</Text>
              <Text style={styles.voucherName}>{data.voucherLabel}</Text>
              <Text style={styles.voucherDescription}>{description}</Text>
            </View>
            <Text style={styles.voucherPrice}>{data.price}€</Text>
          </View>

          {/* Message personnel */}
          {data.message && (
            <View style={styles.messageBox}>
              <Text style={styles.messageLabel}>Message personnel</Text>
              <Text style={styles.messageText}>"{data.message}"</Text>
            </View>
          )}

          {/* Code cadeau */}
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Votre code cadeau</Text>
            <Text style={styles.codeText}>{voucherCode}</Text>
          </View>

          {/* Validité */}
          <View style={styles.validityRow}>
            <View style={styles.validityBox}>
              <Text style={styles.validityLabel}>Date d'achat</Text>
              <Text style={styles.validityValue}>{formatDate(purchaseDate)}</Text>
            </View>
            <View style={styles.validityBox}>
              <Text style={styles.validityLabel}>Valable jusqu'au</Text>
              <Text style={styles.validityValue}>{formatDate(expiryDate)}</Text>
            </View>
            <View style={styles.validityBox}>
              <Text style={styles.validityLabel}>Langues</Text>
              <Text style={styles.validityValue}>FR · EN · ES</Text>
            </View>
          </View>

          {/* Comment utiliser */}
          <View style={styles.howToBox}>
            <Text style={styles.howToTitle}>Comment utiliser votre bon cadeau</Text>
            <View style={styles.howToRow}>
              <Text style={styles.howToBullet}>1.</Text>
              <Text style={styles.howToText}>Choisissez votre tour et votre date sur www.amalurtours.com</Text>
            </View>
            <View style={styles.howToRow}>
              <Text style={styles.howToBullet}>2.</Text>
              <Text style={styles.howToText}>Contactez-nous par email avec votre code cadeau pour valider la reservation</Text>
            </View>
            <View style={styles.howToRow}>
              <Text style={styles.howToBullet}>3.</Text>
              <Text style={styles.howToText}>Profitez de votre experience unique au Pays Basque !</Text>
            </View>
          </View>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerTop}>
            <View>
              <Text style={styles.footerBrand}>Amalur Tours</Text>
              <Text style={styles.footerTagline}>Visites guidees au Pays Basque</Text>
            </View>
            <View style={styles.footerContactBlock}>
              <Text style={styles.footerEmail}>reservations@amalurtours.com</Text>
              <Text style={styles.footerWebsite}>www.amalurtours.com</Text>
              <Text style={styles.footerLocation}>Biarritz & Bayonne, Pays Basque</Text>
            </View>
          </View>
          <View style={styles.footerBottom}>
            <Text style={styles.footerNote}>
              Ce bon cadeau est valable 1 an a compter de la date d'achat. Non remboursable.
            </Text>
            <Text style={styles.footerLang}>FR · EN · ES</Text>
          </View>
        </View>

      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}
