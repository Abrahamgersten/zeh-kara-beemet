// לקוח HTTP לשער ה-Apps Script של גיליון "מנויים - זה קרה באמת" (ראו Docs/AppsScript.gs + Docs/SheetSetup.md).
// נוצר ע"י רוני המתכנת, 2026-09-22.
//
// דפוס "no-op עדין": אם הסודות עוד לא הוגדרו (הפריסה החד-פעמית של ה-Apps
// Script טרם בוצעה ע"י אברהם - שלב שרק הוא יכול לבצע, ראו SheetSetup.md) -
// הפונקציה הזו רק רושמת ביומן וחוזרת בשקט, בלי לזרוק. שום דבר ביצירת/עדכון
// מנוי לא תלוי בסנכרון לגיליון - הוא שכבת תצוגה בלבד.

export interface SubscriberSheetRow {
  email: string;
  plan_status: string | null;
  price_tier: string | null;
  provider: string | null;
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  current_period_end: string | null;
  auth_user_id: string | null;
  first_payment_at: string | null;
  last_event_at: string | null;
}

function isConfigured(): boolean {
  return Boolean(Deno.env.get("SHEETS_WEBAPP_URL") && Deno.env.get("SHEETS_WEBAPP_SECRET"));
}

export async function upsertSubscriberRow(row: SubscriberSheetRow): Promise<void> {
  const url = Deno.env.get("SHEETS_WEBAPP_URL");
  const secret = Deno.env.get("SHEETS_WEBAPP_SECRET");
  if (!url || !secret) {
    console.log("[sheetsGateway] SHEETS_WEBAPP_URL/SECRET not set yet - skipping sheet sync (no-op). See Docs/SheetSetup.md.");
    return;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, action: "upsert_subscriber", data: row }),
    });
    const body = await res.text();
    if (!res.ok) {
      console.error(`[sheetsGateway] upsert failed: HTTP ${res.status} - ${body}`);
      return;
    }
    let parsed: { ok?: boolean; error?: string };
    try {
      parsed = JSON.parse(body);
    } catch {
      console.error(`[sheetsGateway] upsert returned non-JSON: ${body}`);
      return;
    }
    if (!parsed.ok) {
      console.error(`[sheetsGateway] upsert error: ${parsed.error}`);
    }
  } catch (err) {
    // תקלת רשת/Apps Script לא צריכה להפיל את הקורא (payment-webhook/sheet-resync) -
    // הסנכרון הלילי (sheet-resync) הוא רשת הביטחון שמתקנת את עצמה.
    console.error(`[sheetsGateway] upsert threw: ${err}`);
  }
}

export { isConfigured as isSheetSyncConfigured };
