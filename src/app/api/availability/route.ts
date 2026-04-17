import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const month = searchParams.get("month"); // format: "2026-04"

  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  // Si Google Calendar pas configuré → tout disponible
  if (!privateKey || !serviceEmail || !calendarId) {
    return NextResponse.json({ blockedTimes: [], blockedDates: [] });
  }

  try {
    const token = await getAccessToken(serviceEmail, privateKey);

    // === MODE MOIS : retourne les jours bloqués du mois ===
    if (month) {
      const [year, m] = month.split("-").map(Number);
      const startOfMonth = `${month}-01T00:00:00+02:00`;
      const lastDay = new Date(year, m, 0).getDate();
      const endOfMonth = `${month}-${lastDay}T23:59:59+02:00`;

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
          `timeMin=${encodeURIComponent(startOfMonth)}&` +
          `timeMax=${encodeURIComponent(endOfMonth)}&` +
          `singleEvents=true&orderBy=startTime`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) return NextResponse.json({ blockedDates: [] });

      const data = await response.json();
      const events = data.items || [];
      const blockedDates: string[] = [];

      // Pour chaque jour du mois, vérifie si tous les créneaux sont bloqués
      for (let day = 1; day <= lastDay; day++) {
        const dateStr = `${month}-${String(day).padStart(2, "0")}`;
        const allSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
        let blockedCount = 0;

        for (const slot of allSlots) {
          const slotStart = new Date(`${dateStr}T${slot}:00`);
          const slotEnd = new Date(slotStart.getTime() + 90 * 60 * 1000);

          for (const event of events) {
            if (event.start?.date && !event.start?.dateTime) {
              // Événement toute la journée (peut durer plusieurs jours)
              // En Google Calendar, end.date est EXCLUSIF (ex: du 10 au 15 → end.date = "2026-06-15")
              const eventStartDate = event.start.date;
              const eventEndDate = event.end?.date || event.start.date;
              if (dateStr >= eventStartDate && dateStr < eventEndDate) {
                blockedCount = allSlots.length;
                break;
              }
              // Cas événement sur un seul jour
              if (dateStr === eventStartDate) {
                blockedCount = allSlots.length;
                break;
              }
            } else if (event.start?.dateTime) {
              const eventStart = new Date(event.start.dateTime);
              const eventEnd = new Date(event.end.dateTime);
              if (slotStart < eventEnd && slotEnd > eventStart) {
                blockedCount++;
                break;
              }
            }
          }
        }

        if (blockedCount === allSlots.length) {
          blockedDates.push(dateStr);
        }
      }

      return NextResponse.json({ blockedDates });
    }

    // === MODE JOUR : retourne les créneaux bloqués d'un jour ===
    if (date) {
      const startOfDay = `${date}T00:00:00+02:00`;
      const endOfDay = `${date}T23:59:59+02:00`;

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
          `timeMin=${encodeURIComponent(startOfDay)}&` +
          `timeMax=${encodeURIComponent(endOfDay)}&` +
          `singleEvents=true&orderBy=startTime`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) return NextResponse.json({ blockedTimes: [] });

      const data = await response.json();
      const events = data.items || [];
      const allSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
      const blockedTimes: string[] = [];

      for (const slot of allSlots) {
        const slotStart = new Date(`${date}T${slot}:00`);
        const slotEnd = new Date(slotStart.getTime() + 90 * 60 * 1000);

        for (const event of events) {
          if (event.start?.date && !event.start?.dateTime) {
            if (event.start.date === date) { blockedTimes.push(slot); break; }
          } else if (event.start?.dateTime) {
            const eventStart = new Date(event.start.dateTime);
            const eventEnd = new Date(event.end.dateTime);
            if (slotStart < eventEnd && slotEnd > eventStart) {
              blockedTimes.push(slot); break;
            }
          }
        }
      }

      return NextResponse.json({ blockedTimes });
    }

    return NextResponse.json({ blockedTimes: [], blockedDates: [] });

  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json({ blockedTimes: [], blockedDates: [] });
  }
}

async function getAccessToken(serviceEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimSet = btoa(JSON.stringify({
    iss: serviceEmail,
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600, iat: now,
  }));

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

  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(signInput));
  const sig = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const jwt = `${signInput}.${sig}`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}
