// מעקב-שימוש קליל בתוכן האתר, ל"תובנות ושימוש" ב-admin.html (שלב ב').
// לא-חוסם, נכשל בשקט תמיד - זה ערוץ-רקע ואסור שישפיע על מה שהמשתמש רואה
// או חווה. אושר ע"י אברהם 2026-09-24 בתנאי מפורש שלא לשנות את האתר/החוויה.
// נוצר ע"י רוני המתכנת, 2026-09-24. ראו הפרוטוקול: "רוני המתכנת\Docs\
// פרוטוקול מערכת הרשמה ותשלום - זה קרה באמת.md".

import { getSupabaseClient } from "./auth.js";

export function logContentEvent(eventType, categoryLabel, episodeLabel) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    supabase
      .rpc("log_content_event", {
        p_event_type: eventType,
        p_category_label: categoryLabel || null,
        p_episode_label: episodeLabel || null,
      })
      .then(
        () => {},
        () => {}
      );
  } catch (e) {
    // נכשל בשקט - לעולם לא משפיע על הזרימה הנראית למשתמש.
  }
}

// js/app.js (ולא en/js/app.js) נטען כ-script רגיל, לא כמודול ES - לא יכול
// לייבא את הפונקציה ישירות, אז נחשפת דרך window (נקודת-חיבור יחידה, לא
// נוגעת בשום דבר אחר). קריאה תמיד עם window.zkbLogEvent?.(...) בצד הקורא.
window.zkbLogEvent = logContentEvent;
