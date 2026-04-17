import { setRequestLocale } from "next-intl/server";
import { GroupsForm } from "@/components/GroupsForm";

export default async function GroupsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GroupsForm />;
}
