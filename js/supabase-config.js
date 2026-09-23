// תצורת Supabase - נטען ע"י כל דף שצריך התחברות/מנוי (index.html, en/index.html,
// offer.html, en/offer.html, login.html, en/login.html).
// נוצר ע"י רוני המתכנת, 2026-09-22. ראו הפרוטוקול: "רוני המתכנת\Docs\פרוטוקול
// מערכת הרשמה ותשלום - זה קרה באמת.md".
//
// אלה לא סודות - המפתח מיועד לחשיפה בדפדפן (ההגנה האמיתית היא ב-RLS
// בצד השרת, לא בהסתרת המפתח הזה). בטוח לקומיט.
//
// פרויקט: zeh-kara-beemet (Supabase), אזור West EU (Ireland). מולא 2026-09-23.
// שם המשתנה נשאר SUPABASE_ANON_KEY מסיבות היסטוריות בקוד - הערך עצמו הוא
// ה-"Publishable key" של Supabase (sb_publishable_...), התחליף הרשמי ל-anon
// key הישן (Supabase שינו את השם ב-2026) - אותו שימוש בדיוק.

export const SUPABASE_URL = "https://nuadpewhrhpdgznbbqbs.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz";

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
