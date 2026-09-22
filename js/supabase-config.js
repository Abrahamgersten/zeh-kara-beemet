// תצורת Supabase - נטען ע"י כל דף שצריך התחברות/מנוי (index.html, en/index.html,
// offer.html, en/offer.html, login.html, en/login.html).
// נוצר ע"י רוני המתכנת, 2026-09-22. ראו הפרוטוקול: "רוני המתכנת\Docs\פרוטוקול
// מערכת הרשמה ותשלום - זה קרה באמת.md".
//
// אלה לא סודות - ה-anon key מיועד לחשיפה בדפדפן (ההגנה האמיתית היא ב-RLS
// בצד השרת, לא בהסתרת המפתח הזה). בטוח לקומיט.
//
// ⚠️ ריק כרגע - למלא אחרי יצירת פרויקט Supabase (שלב 1 בסדר הבנייה בפרוטוקול).
// עד אז, כל דף שטוען את המודול הזה יציג הודעת "המערכת עדיין לא מחוברת".

export const SUPABASE_URL = ""; // למשל: "https://xxxxxxxx.supabase.co"
export const SUPABASE_ANON_KEY = ""; // המפתח הציבורי (anon), לא ה-service_role!

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
