import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!session || session.value !== adminPassword) {
    redirect("/admin/login");
  }
}

function formatEur(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  // Format YYYY-MM-DD ou DD/MM/YYYY
  if (dateStr.includes("-")) {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }
  return dateStr;
}

export default async function AdminPage() {
  await checkAuth();

  // Dates du mois en cours
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfMonthTs = Math.floor(startOfMonth.getTime() / 1000);

  // Récupérer les sessions Stripe des 90 derniers jours
  const ninetyDaysAgo = Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60;

  let allSessions: Stripe.Checkout.Session[] = [];
  try {
    const response = await stripe.checkout.sessions.list({
      limit: 100,
      created: { gte: ninetyDaysAgo },
    });
    allSessions = response.data.filter((s) => s.payment_status === "paid");
  } catch (e) {
    console.error("Stripe error:", e);
  }

  // Séparer tours et bons cadeaux
  const tourSessions = allSessions.filter((s) => s.metadata?.type !== "gift_voucher");
  const giftSessions = allSessions.filter((s) => s.metadata?.type === "gift_voucher");

  // Stats du mois en cours
  const monthTours = tourSessions.filter((s) => (s.created || 0) >= startOfMonthTs);
  const monthGifts = giftSessions.filter((s) => (s.created || 0) >= startOfMonthTs);
  const monthRevenue = [...monthTours, ...monthGifts].reduce((sum, s) => sum + (s.amount_total || 0), 0);

  // Stats totales (90 jours)
  const totalRevenue = allSessions.reduce((sum, s) => sum + (s.amount_total || 0), 0);

  // Prochaines réservations (dates futures)
  const todayStr = now.toISOString().split("T")[0];
  const upcomingBookings = tourSessions
    .filter((s) => {
      const d = s.metadata?.date || "";
      if (d.includes("-")) return d >= todayStr;
      // Format DD/MM/YYYY
      const [day, month, year] = d.split("/");
      return `${year}-${month}-${day}` >= todayStr;
    })
    .sort((a, b) => {
      const da = a.metadata?.date || "";
      const db = b.metadata?.date || "";
      return da.localeCompare(db);
    })
    .slice(0, 5);

  // Dernières transactions (toutes confondues)
  const recentTransactions = allSessions.slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-basque-red text-white px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🏠 Espace Admin</h1>
          <p className="text-red-100 text-sm">Amalur Tours — Tableau de bord</p>
        </div>
        <a
          href="/fr"
          className="text-red-100 hover:text-white text-sm underline"
        >
          ← Retour au site
        </a>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Stats du mois */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">📊 Ce mois-ci</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              emoji="💶"
              label="Chiffre d'affaires"
              value={formatEur(monthRevenue)}
              color="green"
            />
            <StatCard
              emoji="🗺️"
              label="Réservations"
              value={String(monthTours.length)}
              color="blue"
            />
            <StatCard
              emoji="🎁"
              label="Bons cadeaux"
              value={String(monthGifts.length)}
              color="purple"
            />
            <StatCard
              emoji="💰"
              label="Total 90 jours"
              value={formatEur(totalRevenue)}
              color="red"
            />
          </div>
        </section>

        {/* Prochaines réservations */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">📅 Prochaines réservations</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {upcomingBookings.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Aucune réservation à venir</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Tour</th>
                    <th className="text-left px-4 py-3">Client</th>
                    <th className="text-left px-4 py-3">Participants</th>
                    <th className="text-right px-4 py-3">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {upcomingBookings.map((s) => {
                    const m = s.metadata!;
                    const total = parseInt(m.adults || "0") + parseInt(m.teens || "0") + parseInt(m.children || "0");
                    return (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-basque-red">
                          {formatDate(m.date)} {m.time && `@ ${m.time}`}
                        </td>
                        <td className="px-4 py-3">{m.tourId || "—"}</td>
                        <td className="px-4 py-3">{s.customer_details?.name || "—"}</td>
                        <td className="px-4 py-3">{total} pers.</td>
                        <td className="px-4 py-3 text-right font-semibold">{formatEur(s.amount_total || 0)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Dernières transactions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">🕐 Dernières transactions</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {recentTransactions.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Aucune transaction</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="text-left px-4 py-3">Date paiement</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Client</th>
                    <th className="text-left px-4 py-3">Détail</th>
                    <th className="text-right px-4 py-3">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentTransactions.map((s) => {
                    const m = s.metadata;
                    const isGift = m?.type === "gift_voucher";
                    const date = new Date((s.created || 0) * 1000).toLocaleDateString("fr-FR");
                    return (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-500">{date}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isGift ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                            {isGift ? "🎁 Bon cadeau" : "🗺️ Tour"}
                          </span>
                        </td>
                        <td className="px-4 py-3">{s.customer_details?.name || "—"}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {isGift
                            ? `Pour ${m?.recipientName || "?"}`
                            : `${m?.tourId || "?"} — ${formatDate(m?.date || "")}`}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-green-600">
                          {formatEur(s.amount_total || 0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

function StatCard({ emoji, label, value, color }: {
  emoji: string;
  label: string;
  value: string;
  color: "green" | "blue" | "purple" | "red";
}) {
  const colors = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 ${colors[color]}`}>
        {emoji}
      </div>
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
