import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/ContactForm";
import { contactMetadata, buildMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(contactMetadata[locale] || contactMetadata.fr, locale);
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactForm />;
}
