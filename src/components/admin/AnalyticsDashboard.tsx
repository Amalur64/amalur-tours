"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Users, Eye, Clock, TrendingUp, Globe, Smartphone, Monitor, AlertCircle, RefreshCw } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AnalyticsData {
  overview: {
    users: number;
    sessions: number;
    bounceRate: number;
    avgDuration: number;
    pageViews: number;
  };
  daily: { dateLabel: string; users: number; sessions: number }[];
  pages: { page: string; views: number }[];
  sources: { source: string; sessions: number }[];
  devices: { device: string; sessions: number }[];
  countries: { country: string; sessions: number }[];
}

// ─── Couleurs Amalur Tours ──────────────────────────────────────────────────

const PALETTE = ["#C41E3A", "#1565a8", "#2d7a3a", "#c9a227", "#7c3aed", "#ea580c"];

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m${s > 0 ? ` ${s}s` : ""}`;
}

function cleanPage(path: string): string {
  if (path === "/" || path === "") return "🏠 Accueil";
  return path
    .replace(/^\/(fr|en|es)\//, "/")
    .replace(/\/$/, "")
    .replace("/tours/", "Tour : ")
    .replace("/about", "À propos")
    .replace("/contact", "Contact")
    .replace("/gift", "Bon cadeau")
    .replace("/blog/", "Blog : ")
    || path;
}

// ─── Composants réutilisables ───────────────────────────────────────────────

function StatCard({
  icon: Icon, label, value, sub, color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
      {children}
    </h3>
  );
}

// ─── Tooltip personnalisé ───────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-lg text-sm">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.name === "users" ? "#C41E3A" : "#1565a8" }}>
          {p.name === "users" ? "👤 Visiteurs" : "🔁 Sessions"} : {p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Donut avec légende ─────────────────────────────────────────────────────

function DonutChart({ data, dataKey }: { data: { [key: string]: string | number }[]; dataKey: string }) {
  const total = data.reduce((sum, d) => sum + (d.sessions as number), 0);
  return (
    <div className="flex flex-col gap-3">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="sessions"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val) => [`${val} (${Math.round((Number(val) / total) * 100)}%)`, ""]}
            contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
              />
              <span className="text-gray-600 truncate max-w-[160px]">{d[dataKey] as string}</span>
            </div>
            <span className="font-semibold text-gray-900 ml-2">
              {Math.round(((d.sessions as number) / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard principal ────────────────────────────────────────────────────

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      if (!res.ok) {
        if (json.error === "not_configured") {
          setError("not_configured");
        } else {
          setError(json.error || "Erreur inconnue");
        }
        return;
      }
      setData(json);
    } catch {
      setError("Impossible de contacter l'API Analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── États de chargement / erreur ──────────────────────────────────────

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <div className="w-10 h-10 border-4 border-basque-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Chargement des statistiques…</p>
      </div>
    );
  }

  if (error === "not_configured") {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex gap-3 items-start">
          <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-amber-800 mb-2">⚙️ Configuration requise — 2 étapes rapides</p>
            <div className="text-sm text-amber-700 space-y-3">
              <div>
                <p className="font-medium mb-1">Étape 1 — Trouver ton ID de propriété GA4 :</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Va sur <a href="https://analytics.google.com" target="_blank" rel="noreferrer" className="underline">analytics.google.com</a></li>
                  <li>Clique sur ⚙️ Admin (en bas à gauche)</li>
                  <li>Dans &quot;Propriété&quot;, clique sur &quot;Paramètres de la propriété&quot;</li>
                  <li>Copie le numéro &quot;ID de propriété&quot; (ex: <code className="bg-amber-100 px-1 rounded">123456789</code>)</li>
                </ol>
              </div>
              <div>
                <p className="font-medium mb-1">Étape 2 — Ajouter sur Vercel :</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Vercel → ton projet → Settings → Environment Variables</li>
                  <li>Ajouter : <code className="bg-amber-100 px-1 rounded">GOOGLE_ANALYTICS_PROPERTY_ID</code> = le numéro copié</li>
                  <li>Redéployer</li>
                </ol>
              </div>
              <div>
                <p className="font-medium mb-1">Étape 3 — Autoriser le service account :</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Dans GA4 → Admin → Gestion des accès à la propriété</li>
                  <li>Ajouter : <code className="bg-amber-100 px-1 rounded text-xs">amalur-calendar@forward-liberty-493207-a0.iam.gserviceaccount.com</code></li>
                  <li>Rôle : Lecteur</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3">
        <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
        <div className="flex-1">
          <p className="text-red-700 font-medium">Erreur Analytics</p>
          <p className="text-red-500 text-sm mt-0.5">{error}</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-medium"
        >
          <RefreshCw size={14} /> Réessayer
        </button>
      </div>
    );
  }

  const { overview, daily, pages, sources, devices, countries } = data;

  // ── Affichage principal ───────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Bandeau filtre admin */}
      <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
        <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
        ✅ Tes visites en tant qu&apos;admin sont <strong>exclues</strong> des statistiques
      </div>

      {/* Cartes stats globales */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Users}
          label="Visiteurs uniques"
          value={overview.users.toLocaleString("fr-FR")}
          sub="30 derniers jours"
          color="bg-red-50 text-basque-red"
        />
        <StatCard
          icon={TrendingUp}
          label="Sessions"
          value={overview.sessions.toLocaleString("fr-FR")}
          sub="visites totales"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={Eye}
          label="Pages vues"
          value={overview.pageViews.toLocaleString("fr-FR")}
          sub="pages consultées"
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          icon={Clock}
          label="Durée moy."
          value={formatDuration(overview.avgDuration)}
          sub="par session"
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={Globe}
          label="Taux rebond"
          value={`${overview.bounceRate}%`}
          sub={overview.bounceRate < 50 ? "✅ Excellent" : overview.bounceRate < 70 ? "👍 Correct" : "⚠️ À améliorer"}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Graphique visiteurs 30 jours */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <SectionTitle>Évolution des visiteurs</SectionTitle>
            <p className="text-xs text-gray-400 -mt-3">30 derniers jours</p>
          </div>
          <button
            onClick={load}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Actualiser"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={daily} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C41E3A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#C41E3A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1565a8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1565a8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#C41E3A"
              strokeWidth={2.5}
              fill="url(#gradUsers)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="sessions"
              stroke="#1565a8"
              strokeWidth={2}
              fill="url(#gradSessions)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              strokeDasharray="4 2"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-3 justify-center">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-4 h-0.5 bg-basque-red rounded" />
            Visiteurs uniques
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className="w-4 h-0.5 bg-blue-600 rounded border-dashed" style={{ borderTop: "2px dashed #1565a8", background: "none" }} />
            Sessions
          </div>
        </div>
      </div>

      {/* Pages + Pays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Pages les plus visitées */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <SectionTitle>Pages les plus visitées</SectionTitle>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={pages.map(p => ({ ...p, page: cleanPage(p.page) }))}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="page"
                width={130}
                tick={{ fontSize: 11, fill: "#374151" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(val) => [val, "vues"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
              />
              <Bar dataKey="views" fill="#C41E3A" radius={[0, 6, 6, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pays */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <SectionTitle>Visiteurs par pays</SectionTitle>
          <div className="space-y-3 mt-2">
            {countries.map((c, i) => {
              const max = countries[0]?.sessions || 1;
              const pct = Math.round((c.sessions / max) * 100);
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-36 truncate flex-shrink-0">{c.country}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: PALETTE[i % PALETTE.length],
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-8 text-right">{c.sessions}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sources + Appareils */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <SectionTitle>Sources de trafic</SectionTitle>
          <DonutChart data={sources} dataKey="source" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-1">
            <SectionTitle>Appareils utilisés</SectionTitle>
          </div>
          <div className="flex items-center gap-4 mb-4">
            {devices.map((d, i) => {
              const icon = d.device.includes("Mobile") ? Smartphone : Monitor;
              const IconComp = icon;
              return (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <IconComp size={13} style={{ color: PALETTE[i] }} />
                  <span style={{ color: PALETTE[i] }}>{d.device}</span>
                </div>
              );
            })}
          </div>
          <DonutChart data={devices} dataKey="device" />
        </div>
      </div>

    </div>
  );
}
