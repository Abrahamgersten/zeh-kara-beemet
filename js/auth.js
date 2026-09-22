// מודול התחברות + זכאות משותף לכל הדפים (עברית ואנגלית כאחד - הלוגיקה
// לא תלוית-שפה, כל דף מעביר את הכתובות הרלוונטיות לו כפרמטרים).
// נוצר ע"י רוני המתכנת, 2026-09-22. ראו הפרוטוקול: "רוני המתכנת\Docs\פרוטוקול
// מערכת הרשמה ותשלום - זה קרה באמת.md".
//
// נטען כמודול ES (import), ישירות מה-CDN של Supabase - בלי שלב build, עקבי
// עם עקרון "אתר סטטי טהור" של האתר הזה.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./supabase-config.js";

let _client = null;

export function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;
  if (!_client) _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _client;
}

export { isSupabaseConfigured };

export async function getSession() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  supabase.auth.onAuthStateChange((_event, session) => callback(session));
}

export async function signInWithGoogle(redirectTo) {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: "not configured" };
  return supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
}

export async function signInWithMagicLink(email, redirectTo) {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: "not configured" };
  return supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
}

export async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}

/** קוראת claim_subscriber() (משייכת שורת subscribers תואמת-אימייל אם עוד לא
 * שויכה - לא עושה כלום אם אין התאמה), ואז מחזירה את שורת המנוי של המשתמש
 * המחובר (או null אם אין לו שורה כלל). */
export async function fetchEntitlement() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  await supabase.rpc("claim_subscriber");
  const { data } = await supabase.from("subscribers").select("plan_status, email").maybeSingle();
  return data || null;
}

export function isEntitled(row) {
  return Boolean(row && row.plan_status === "active");
}

/** מסירה את מסך-ה"טוען" (ראו class="auth-pending" ב-body של כל דף מוגן/ציבורי -
 * מונע הבזק תוכן לפני שהבדיקה הסתיימה). */
export function revealPage() {
  document.body.classList.remove("auth-pending");
}

/** שער לדף מוגן (index.html/en/index.html בלבד): מוודא session + מנוי פעיל,
 * אחרת מפנה. מריצים ראשון בדף, לפני שה-app.js הרגיל בונה את התוכן. */
export async function guardGatedPage({ loginUrl, offerUrl }) {
  if (!isSupabaseConfigured()) {
    // המערכת עוד לא הוקמה (שלב פיתוח/לפני מסירה) - לא חוסמים, רק חושפים.
    revealPage();
    return;
  }
  const session = await getSession();
  if (!session) {
    window.location.replace(loginUrl);
    return;
  }
  const row = await fetchEntitlement();
  if (!isEntitled(row)) {
    window.location.replace(offerUrl);
    return;
  }
  revealPage();
}
