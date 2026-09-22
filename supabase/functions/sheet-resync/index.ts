// סנכרון לילי מלא: קורא את כל טבלת subscribers ודוחף כל שורה לגיליון "מנויים
// - זה קרה באמת" (upsert לכל שורה). רשת ביטחון עצמית-מתקנת מעל הדחיפה המיידית
// שקורית ב-payment-webhook - מתקנת כל מה שהוחמץ (תקלת רשת חד-פעמית, תיקון ידני
// של שורה ב-Supabase שצריך לזרום לגיליון וכו').
// נוצר ע"י רוני המתכנת, 2026-09-22.
//
// מתוזמן ע"י Supabase Cron (pg_cron), אבל ניתן גם להפעיל ידנית (POST ריק,
// דרך ה-dashboard או curl) - שימושי לבדיקה מיד אחרי חיבור הגיליון בפעם הראשונה.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { isSheetSyncConfigured, upsertSubscriberRow } from "../_shared/sheetsGateway.ts";

Deno.serve(async (_req) => {
  if (!isSheetSyncConfigured()) {
    console.log("[sheet-resync] SHEETS_WEBAPP_URL/SECRET not set yet - nothing to do (no-op).");
    return new Response(JSON.stringify({ ok: true, skipped: "sheet not connected yet" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: rows, error } = await supabase
    .from("subscribers")
    .select("email, plan_status, price_tier, provider, provider_customer_id, provider_subscription_id, current_period_end, auth_user_id, first_payment_at, last_event_at");

  if (error) {
    console.error(`[sheet-resync] select failed: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  let synced = 0;
  for (const row of rows ?? []) {
    await upsertSubscriberRow(row);
    synced += 1;
  }

  console.log(`[sheet-resync] synced ${synced} subscriber row(s)`);
  return new Response(JSON.stringify({ ok: true, synced }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
