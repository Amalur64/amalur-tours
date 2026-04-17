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
    padding: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },
  pattern: {
    backgroundColor: "#A93226",
    height: 8,
  },
  body: {
    padding: 40,
  },
  recipientBox: {
    backgroundColor: "#FDF2F0",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    borderLeft: "4 solid #C0392B",
  },
  recipientLabel: {
    fontSize: 10,
    color: "#C0392B",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  recipientName: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  fromText: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  voucherBox: {
    backgroundColor: "#C0392B",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  voucherLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  voucherName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  voucherDescription: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  voucherPrice: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  messageBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  messageLabel: {
    fontSize: 10,
    color: "#7F8C8D",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 13,
    color: "#2C3E50",
    lineHeight: 1.6,
    fontStyle: "italic",
  },
  codeBox: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    border: "2 dashed #C0392B",
    alignItems: "center",
  },
  codeLabel: {
    fontSize: 10,
    color: "#7F8C8D",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#C0392B",
    letterSpacing: 4,
  },
  validityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  validityBox: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  validityLabel: {
    fontSize: 9,
    color: "#7F8C8D",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  validityValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#2C3E50",
  },
  footer: {
    backgroundColor: "#2C3E50",
    padding: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: 4,
  },
  footerBold: {
    fontSize: 12,
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
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
          <Text style={styles.headerTitle}>BON CADEAU</Text>
          <Text style={styles.headerTitle}>AMALUR TOURS</Text>
          <Text style={styles.headerSubtitle}>Visites guidées authentiques au Pays Basque</Text>
        </View>

        <View style={styles.pattern} />

        {/* Corps */}
        <View style={styles.body}>
          {/* Destinataire */}
          <View style={styles.recipientBox}>
            <Text style={styles.recipientLabel}>Offert à</Text>
            <Text style={styles.recipientName}>{data.recipientName}</Text>
            <Text style={styles.fromText}>avec tout l&apos;amour de {data.senderName}</Text>
          </View>

          {/* Forfait */}
          <View style={styles.voucherBox}>
            <View>
              <Text style={styles.voucherLabel}>Votre expérience</Text>
              <Text style={styles.voucherName}>{data.voucherLabel}</Text>
              <Text style={styles.voucherDescription}>{description}</Text>
            </View>
            <Text style={styles.voucherPrice}>{data.price}€</Text>
          </View>

          {/* Message personnel */}
          {data.message && (
            <View style={styles.messageBox}>
              <Text style={styles.messageLabel}>Message personnel</Text>
              <Text style={styles.messageText}>&quot;{data.message}&quot;</Text>
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
              <Text style={styles.validityLabel}>Date d&apos;achat</Text>
              <Text style={styles.validityValue}>{formatDate(purchaseDate)}</Text>
            </View>
            <View style={styles.validityBox}>
              <Text style={styles.validityLabel}>Valable jusqu&apos;au</Text>
              <Text style={styles.validityValue}>{formatDate(expiryDate)}</Text>
            </View>
            <View style={styles.validityBox}>
              <Text style={styles.validityLabel}>Langues</Text>
              <Text style={styles.validityValue}>FR · EN · ES</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Pour réserver, contactez-nous avec votre code :</Text>
          <Text style={styles.footerBold}>amalur.tours@gmail.com</Text>
          <Text style={styles.footerText}>www.amalurtours.com · Pays Basque</Text>
        </View>
      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}
