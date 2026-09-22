// מקבל webhook מספק הסליקה (עדיין לא נבחר - ראו הפרוטוקול), מעדכן/יוצר שורה
// בטבלת subscribers, ומדחיף את השינוי לגיליון הניהול (בשקט, אם עוד לא מחובר).
// נוצר ע"י רוני המתכנת, 2026-09-22.
//
// בכוונה נבנה גנרי, בשתי שכבות שקל להחליף בנפרד:
//   1) verifyProviderSignature() - שכבת האימות, תלוית-ספק, כרגע placeholder גנרי
//      (HMAC-SHA256 מול WEBHOOK_SECRET) - להחליף בשיטת האימות האמיתית של הספק
//      שייבחר (למשל Grow/Meshulam/Tranzila שולחים חתימה בכותרת אחרת).
//   2) adaptPayload() - ממפה את המטען הגולמי של הספק לצורה הפנימית האחידה -
//      זו הפונקציה היחידה שצריך לכתוב מחדש לכל ספק, שאר הקובץ לא זז.
//
// עד שנבחר ספק, ניתן לבדוק את כל שאר המערכת עם מטען-בדיקה גנרי (ראו הפרוטוקול,
// סעיף "אימות מקצה לקצה").

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { upsertSubscriberRow } from "../_shared/sheetsGateway.ts";

interface NormalizedEvent {
  email: string;
  plan_status: "active" | "past_due" | "canceled";
  price_tier?: string;
  provider?: string;
  provider_customer_id?: string;
  provider_subscription_id?: string;
  current_period_end?: string;
}

function verifyProviderSignature(_req: Request, _rawBody: string): boolean {
  // TODO (אחרי בחירת ספק): להחליף בשיטת האימות האמיתית שלו.
  // Placeholder גנרי: HMAC-SHA256 מול WEBHOOK_SECRET, בכותרת X-Webhook-Signature.
  // אם WEBHOOK_SECRET לא מוגדר - מאפשר הכל (כדי לא לחסום בדיקות עצמאיות לפני
  // שיש ספק אמיתי). ברגע שיש ספק - WEBHOOK_SECRET תמיד יהיה מוגדר בפרודקשן.
  const secret = Deno.env.get("WEBHOOK_SECRET");
  if (!secret) return true;
  const provided = _req.headers.get("x-webhook-signature") || "";
  return provided === secret; // TODO: להחליף בהשוואת HMAC אמיתית + timing-safe compare
}

/** ממפה מטען גולמי של ספק לצורה הפנימית האחידה. כרגע מקבל את הצורה הגנרית
 * (לבדיקות עצמאיות + כבסיס קל להתאמה). TODO: להחליף/להרחיב אחרי בחירת ספק. */
function adaptPayload(raw: Record<string, unknown>): NormalizedEvent | null {
  const email = String(raw.email || "").trim().toLowerCase();
  if (!email) return null;
  const planStatus = String(raw.plan_status || "active");
  if (!["active", "past_due", "canceled"].includes(planStatus)) return null;
  return {
    email,
    plan_status: planStatus as NormalizedEvent["plan_status"],
    price_tier: raw.price_tier ? String(raw.price_tier) : undefined,
    provider: raw.provider ? String(raw.provider) : undefined,
    provider_customer_id: raw.provider_customer_id ? String(raw.provider_customer_id) : undefined,
    provider_subscription_id: raw.provider_subscription_id ? String(raw.provider_subscription_id) : undefined,
    current_period_end: raw.current_period_end ? String(raw.current_period_end) : undefined,
  };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), { status: 405 });
  }

  const rawBody = await req.text();

  if (!verifyProviderSignature(req, rawBody)) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: "invalid JSON" }), { status: 400 });
  }

  const event = adaptPayload(raw);
  if (!event) {
    return new Response(JSON.stringify({ error: "unrecognized payload" }), { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("subscribers")
    .upsert(
      {
        email: event.email,
        plan_status: event.plan_status,
        price_tier: event.price_tier ?? null,
        provider: event.provider ?? null,
        provider_customer_id: event.provider_customer_id ?? null,
        provider_subscription_id: event.provider_subscription_id ?? null,
        current_period_end: event.current_period_end ?? null,
        last_event_at: now,
        last_webhook_payload: raw,
      },
      { onConflict: "email" },
    )
    .select("email, plan_status, price_tier, provider, provider_customer_id, provider_subscription_id, current_period_end, auth_user_id, first_payment_at, last_event_at")
    .single();

  if (error) {
    console.error(`[payment-webhook] upsert failed: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // דחיפה מיידית לגיליון (best-effort - no-op בשקט אם עוד לא מחובר, ראו sheetsGateway).
  // לא חוסמת את התשובה ל-webhook ולא מפילה אותו אם נכשלת.
  await upsertSubscriberRow(data);

  return new Response(JSON.stringify({ ok: true, subscriber: data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
