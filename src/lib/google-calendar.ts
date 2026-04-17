// Google Calendar API integration
// Permet de créer des événements dans Google Calendar à chaque réservation
// Compatible avec la synchronisation GYG/Viator via un calendrier partagé

interface CalendarEvent {
  tourName: string;
  date: string;
  time: string;
  duration: number; // minutes
  customerName: string;
  customerEmail: string;
  adults: number;
  teens: number;
  children: number;
  language: string;
  amount: number;
}

export async function createCalendarEvent(event: CalendarEvent) {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!privateKey || !serviceEmail || !calendarId) {
    console.warn("Google Calendar not configured — skipping event creation");
    return null;
  }

  try {
    // Get access token using service account JWT
    const token = await getAccessToken(serviceEmail, privateKey);

    const startDateTime = `${event.date}T${event.time}:00`;
    const endDate = new Date(`${event.date}T${event.time}:00`);
    endDate.setMinutes(endDate.getMinutes() + event.duration);
    const endDateTime = endDate.toISOString().slice(0, 19);

    const totalPeople = event.adults + event.teens + event.children;

    const calendarEvent = {
      summary: `🎯 ${event.tourName} — ${totalPeople} pers.`,
      description: [
        `Tour: ${event.tourName}`,
        `Client: ${event.customerName}`,
        `Email: ${event.customerEmail}`,
        `Adultes: ${event.adults}`,
        event.teens > 0 ? `Ados: ${event.teens}` : "",
        event.children > 0 ? `Enfants: ${event.children}` : "",
        `Langue: ${event.language}`,
        `Montant: ${(event.amount / 100).toFixed(2)}€`,
        ``,
        `Réservation via amalurtours.com`,
      ]
        .filter(Boolean)
        .join("\n"),
      start: {
        dateTime: startDateTime,
        timeZone: "Europe/Paris",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "Europe/Paris",
      },
      colorId: "11", // Red for Amalur Tours
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 60 },
          { method: "popup", minutes: 1440 }, // 24h before
        ],
      },
    };

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(calendarEvent),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Google Calendar API error:", error);
      return null;
    }

    const result = await response.json();
    console.log("Calendar event created:", result.id);
    return result;
  } catch (error) {
    console.error("Failed to create calendar event:", error);
    return null;
  }
}

async function getAccessToken(
  serviceEmail: string,
  privateKey: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Create JWT header and claim set
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimSet = btoa(
    JSON.stringify({
      iss: serviceEmail,
      scope: "https://www.googleapis.com/auth/calendar",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );

  const signInput = `${header}.${claimSet}`;

  // Sign with private key using Web Crypto API
  const keyData = privateKey
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");

  const binaryKey = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signInput),
  );

  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const jwt = `${signInput}.${sig}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

// Check if a date/time is blocked in Google Calendar
export async function isTimeSlotBlocked(
  date: string,
  time: string,
): Promise<boolean> {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!privateKey || !serviceEmail || !calendarId) {
    return false;
  }

  try {
    const token = await getAccessToken(serviceEmail, privateKey);

    const startDateTime = `${date}T${time}:00+02:00`;
    const endDateTime = `${date}T${time}:01+02:00`;

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
        `timeMin=${encodeURIComponent(startDateTime)}&` +
        `timeMax=${encodeURIComponent(endDateTime)}&` +
        `singleEvents=true`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data = await response.json();
    return (data.items?.length || 0) > 0;
  } catch {
    return false;
  }
}
