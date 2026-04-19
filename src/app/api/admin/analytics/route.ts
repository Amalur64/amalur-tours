import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const GA4_API = "https://analyticsdata.googleapis.com/v1beta/properties";

// ─── Authentification Google via Service Account ───────────────────────────

async function getAnalyticsToken(): Promise<string> {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  if (!privateKey || !serviceEmail) throw new Error("Google credentials missing");

  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const claimSet = btoa(JSON.stringify({
    iss: serviceEmail,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  })).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const signInput = `${header}.${claimSet}`;
  const keyData = privateKey
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const binaryKey = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8", binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false, ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(signInput)
  );
  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const jwt = `${signInput}.${sig}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) throw new Error("Failed to get access token");
  return tokenData.access_token;
}

// ─── Helper rapport GA4 ────────────────────────────────────────────────────

async function runReport(token: string, propertyId: string, body: object) {
  const res = await fetch(`${GA4_API}/${propertyId}:runReport`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GA4 API error: ${err}`);
  }
  return res.json();
}

// ─── Route GET ─────────────────────────────────────────────────────────────

export async function GET() {
  // Vérification auth admin
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
  if (!propertyId || propertyId === "REPLACE_ME") {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const token = await getAnalyticsToken();
    const dateRange = { startDate: "30daysAgo", endDate: "today" };

    const [dailyRes, pagesRes, sourcesRes, devicesRes, overviewRes, countriesRes] =
      await Promise.all([
        // Visiteurs jour par jour
        runReport(token, propertyId, {
          dateRanges: [dateRange],
          metrics: [{ name: "activeUsers" }, { name: "sessions" }],
          dimensions: [{ name: "date" }],
          orderBys: [{ dimension: { dimensionName: "date" } }],
        }),
        // Pages les plus visitées
        runReport(token, propertyId, {
          dateRanges: [dateRange],
          metrics: [{ name: "screenPageViews" }],
          dimensions: [{ name: "pagePath" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 8,
        }),
        // Sources de trafic
        runReport(token, propertyId, {
          dateRanges: [dateRange],
          metrics: [{ name: "sessions" }],
          dimensions: [{ name: "sessionDefaultChannelGroup" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        }),
        // Appareils
        runReport(token, propertyId, {
          dateRanges: [dateRange],
          metrics: [{ name: "sessions" }],
          dimensions: [{ name: "deviceCategory" }],
        }),
        // Vue d'ensemble
        runReport(token, propertyId, {
          dateRanges: [dateRange],
          metrics: [
            { name: "activeUsers" },
            { name: "sessions" },
            { name: "bounceRate" },
            { name: "averageSessionDuration" },
            { name: "screenPageViews" },
          ],
        }),
        // Pays
        runReport(token, propertyId, {
          dateRanges: [dateRange],
          metrics: [{ name: "sessions" }],
          dimensions: [{ name: "country" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 6,
        }),
      ]);

    // Formatage dates YYYYMMDD → JJ/MM
    const daily = (dailyRes.rows || []).map((row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => {
      const d = row.dimensionValues[0].value;
      return {
        dateLabel: `${d.slice(6, 8)}/${d.slice(4, 6)}`,
        users: parseInt(row.metricValues[0].value || "0"),
        sessions: parseInt(row.metricValues[1].value || "0"),
      };
    });

    // Pages — nettoyage des chemins
    const pages = (pagesRes.rows || []).map((row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
      page: row.dimensionValues[0].value || "/",
      views: parseInt(row.metricValues[0].value || "0"),
    }));

    // Sources
    const sourceLabels: Record<string, string> = {
      "Organic Search": "Google",
      "Direct": "Direct",
      "Organic Social": "Réseaux sociaux",
      "Referral": "Liens externes",
      "Email": "Email",
      "Paid Search": "Publicité",
      "(none)": "Autre",
    };
    const sources = (sourcesRes.rows || []).map((row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
      source: sourceLabels[row.dimensionValues[0].value] || row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value || "0"),
    }));

    // Appareils
    const deviceLabels: Record<string, string> = {
      mobile: "📱 Mobile",
      desktop: "💻 Ordinateur",
      tablet: "📟 Tablette",
    };
    const devices = (devicesRes.rows || []).map((row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
      device: deviceLabels[row.dimensionValues[0].value] || row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value || "0"),
    }));

    // Vue d'ensemble
    const ov = overviewRes.rows?.[0]?.metricValues || [];
    const overview = {
      users: parseInt(ov[0]?.value || "0"),
      sessions: parseInt(ov[1]?.value || "0"),
      bounceRate: Math.round(parseFloat(ov[2]?.value || "0") * 100),
      avgDuration: Math.round(parseFloat(ov[3]?.value || "0")),
      pageViews: parseInt(ov[4]?.value || "0"),
    };

    // Pays
    const countryFlags: Record<string, string> = {
      France: "🇫🇷", "United Kingdom": "🇬🇧", Spain: "🇪🇸",
      Germany: "🇩🇪", Netherlands: "🇳🇱", Belgium: "🇧🇪",
      "United States": "🇺🇸", Italy: "🇮🇹", Switzerland: "🇨🇭",
    };
    const countries = (countriesRes.rows || []).map((row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => {
      const name = row.dimensionValues[0].value;
      return {
        country: `${countryFlags[name] || "🌍"} ${name}`,
        sessions: parseInt(row.metricValues[0].value || "0"),
      };
    });

    return NextResponse.json({ daily, pages, sources, devices, overview, countries });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analytics error" },
      { status: 500 }
    );
  }
}
