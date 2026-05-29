import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { GroupsForm } from "@/components/GroupsForm";
import { buildMetadata } from "@/lib/metadata";

const groupsMetadata: Record<string, { title: string; description: string }> = {
  fr: {
    title: "Groupes & Entreprises | Amalur Tours — Visites Guidées Pays Basque",
    description: "Organisez votre visite de groupe à Bayonne ou Biarritz avec Amalur Tours. Groupes scolaires, entreprises, associations. Tarifs dégressifs, guide trilingue.",
  },
  en: {
    title: "Groups & Corporate | Amalur Tours — Guided Tours Basque Country",
    description: "Organise your group visit to Bayonne or Biarritz with Amalur Tours. School groups, corporate, associations. Group rates, trilingual guide.",
  },
  es: {
    title: "Grupos & Empresas | Amalur Tours — Visitas Guiadas País Vasco",
    description: "Organiza tu visita de grupo en Bayona o Biarritz con Amalur Tours. Grupos escolares, empresas, asociaciones. Tarifas grupales, guía trilingüe.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = groupsMetadata[locale] || groupsMetadata.fr;
  return buildMetadata(meta, locale, "/groups");
}

export default async function GroupsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GroupsForm />;
}
