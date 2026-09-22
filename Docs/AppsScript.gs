// ======= מנויים - זה קרה באמת — Sheet Sync Web App — נוצר ע"י רוני המתכנת, 2026-09-22 =======
// קוד זה מיועד להדבקה בעורך ה-Apps Script *הקשור לגיליון עצמו* (Extensions >
// Apps Script בתוך הגיליון "מנויים - זה קרה באמת") - לא סקריפט עצמאי. הוא רץ
// תחת ההרשאה של מי שיצר את הגיליון, וניגש אליו ישירות (SpreadsheetApp.getActive()),
// בלי Sheets API/OAuth נפרד - כך שאין דרישת חיוב (billing) על שום פרויקט ענן.
//
// זו תצוגת ניהול חד-כיוונית בלבד (מ-Supabase אל הגיליון) - לעולם לא כותבים
// כאן מנוי חדש/משנים סטטוס ידנית ומצפים שזה "יחזור" ל-Supabase. אם צריך לתקן
// שורה (למשל מקרה קצה של אימייל לא-תואם, ראו הפרוטוקול) - מתקנים ישירות
// בטבלת subscribers ב-Supabase, והגיליון יתעדכן לבד בסנכרון הלילי הבא.
//
// אחרי הדבקה: הרץ פעם אחת את setupSheet() (מהתפריט "מנויים" שנוסף לגיליון)
// כדי להכין את הלשונית. אחר כך:
// Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone)
// וראה Docs/SheetSetup.md להמשך.

var SECRET = 'REPLACE_ME_WITH_A_RANDOM_SECRET'; // לשנות לפני הפריסה! תואם ל-SHEETS_WEBAPP_SECRET ב-Supabase Edge Functions

var SHEET_NAME = 'מנויים';

var HEADERS = [
  'אימייל',
  'סטטוס מנוי',
  'שכבת מחיר',
  'ספק תשלום',
  'מזהה לקוח אצל הספק',
  'מזהה מנוי אצל הספק',
  'סוף תקופה נוכחית',
  'מקושר להתחברות',
  'תשלום ראשון',
  'עדכון אחרון',
];

var PLAN_STATUS_VALUES = ['active', 'past_due', 'canceled'];

// עמודות שחייבות להישמר כטקסט רגיל (לא להתפרש כתאריך/שעה פנימי של Sheets) -
// אותה תקלה ידועה שתועדה ותוקנה באפליקציות הקודמות (שבת אחים, מעוז חיים):
// ערך כמו "2026-10-22T00:00:00Z" שנכתב לתא בפורמט ברירת מחדל מומר אוטומטית
// לערך תאריך-שעה גולמי, ומאבד את הפורמט המקורי.
var TEXT_FORMAT_KEYWORDS = ['תאריך', 'סוף תקופה'];

function isTextFormatColumn_(header) {
  for (var i = 0; i < TEXT_FORMAT_KEYWORDS.length; i++) {
    if (header.indexOf(TEXT_FORMAT_KEYWORDS[i]) !== -1) return true;
  }
  return false;
}

// ===== תפריט + הקמה ראשונית =====

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('מנויים')
    .addItem('הקמה ראשונית (הרצה חד-פעמית)', 'setupSheet')
    .addToUi();
}

/** מכין את לשונית "מנויים": יוצר/ממחזר, כותרות, עיצוב, RTL, ולידציה.
 * בטוח להרצה חוזרת - אף פעם לא נוגע בנתונים אמיתיים קיימים. */
function setupSheet() {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  sheet.setRightToLeft(true); // עברית זורמת מימין לשמאל - גם כיוון העמודות עצמו

  var lastCol = sheet.getLastColumn();
  var existingHeaders = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var headersMatch =
    existingHeaders.length === HEADERS.length &&
    existingHeaders.every(function (h, idx) { return String(h).trim() === HEADERS[idx]; });
  var totalRows = sheet.getLastRow();

  var note;
  if (!headersMatch) {
    if (totalRows <= 1) {
      // בטוח לשכתב - אין שורות נתונים אמיתיות, לכל היותר כותרות ישנות/חלקיות.
      sheet.clear();
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.setFrozenRows(1);
      sheet.autoResizeColumns(1, HEADERS.length);
      note = 'לשונית "' + SHEET_NAME + '" הוכנה בהצלחה עם כל העמודות.';
    } else {
      // יש כבר נתונים אמיתיים עם כותרות לא-תואמות - לא נוגעים, רק מתריעים.
      SpreadsheetApp.getUi().alert(
        'לשונית "' + SHEET_NAME + '": יש בה ' + totalRows + ' שורות אבל הכותרות לא תואמות למבנה הנוכחי - ' +
        'לא נגעתי כדי לא לפגוע בנתונים. בדוק ידנית מול הרשימה ב-HEADERS.'
      );
      return;
    }
  } else {
    note = 'לשונית "' + SHEET_NAME + '" כבר תקינה - לא נגעתי בנתונים.';
  }

  sheet.setRowHeight(1, 32);
  sheet.setColumnWidth(HEADERS.indexOf('אימייל') + 1, 240);

  var maxRows = Math.max(sheet.getMaxRows(), 1000);
  for (var hc = 0; hc < HEADERS.length; hc++) {
    if (isTextFormatColumn_(HEADERS[hc])) {
      sheet.getRange(2, hc + 1, maxRows - 1, 1).setNumberFormat('@');
    }
  }

  var statusColIdx = HEADERS.indexOf('סטטוס מנוי') + 1;
  if (statusColIdx > 0) {
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(PLAN_STATUS_VALUES, true)
      .setAllowInvalid(true) // מאפשר ערך ריק/חופשי בלי חסימה, רק מציע רשימה
      .build();
    sheet.getRange(2, statusColIdx, maxRows - 1, 1).setDataValidation(rule);
  }

  try {
    var existingBandings = sheet.getBandings();
    for (var b = 0; b < existingBandings.length; b++) existingBandings[b].remove();
    var bandRange = sheet.getRange(1, 1, Math.max(sheet.getMaxRows(), 1000), HEADERS.length);
    bandRange.applyRowBanding(SpreadsheetApp.BandingTheme.TEAL, true, false);
  } catch (e) {
    // עיצוב לא קריטי - לא נכשלים על כך
  }

  SpreadsheetApp.getUi().alert(note);
}

// ===== לוגיקת upsert =====

/** מוצא שורה לפי אימייל (עמודה 1), 1-indexed, או 0 אם לא נמצאה. */
function findRowByEmail_(sheet, email) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  var emails = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var target = String(email).trim().toLowerCase();
  for (var i = 0; i < emails.length; i++) {
    if (String(emails[i][0]).trim().toLowerCase() === target) return i + 2;
  }
  return 0;
}

/** upsert שורה אחת לפי אימייל. data הוא אובייקט עם מפתחות שתואמים (חלקית או
 * מלאה) לשמות ה-HEADERS. שדות שלא נשלחו לא נדרסים בעדכון (רק ב-insert חדש). */
function upsertSubscriber_(data) {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('לשונית "' + SHEET_NAME + '" לא קיימת - הרץ קודם setupSheet()');

  var email = String(data.email || '').trim().toLowerCase();
  if (!email) throw new Error('email חסר');

  var row = findRowByEmail_(sheet, email);
  var rowValues = {
    'אימייל': email,
    'סטטוס מנוי': data.plan_status || '',
    'שכבת מחיר': data.price_tier || '',
    'ספק תשלום': data.provider || '',
    'מזהה לקוח אצל הספק': data.provider_customer_id || '',
    'מזהה מנוי אצל הספק': data.provider_subscription_id || '',
    'סוף תקופה נוכחית': data.current_period_end || '',
    'מקושר להתחברות': data.auth_user_id ? 'כן' : 'לא',
    'תשלום ראשון': data.first_payment_at || '',
    'עדכון אחרון': data.last_event_at || new Date().toISOString(),
  };

  if (row === 0) {
    row = sheet.getLastRow() + 1;
  }
  var values = HEADERS.map(function (h) { return rowValues[h] !== undefined ? rowValues[h] : ''; });
  sheet.getRange(row, 1, 1, HEADERS.length).setValues([values]);

  return { row: row, email: email };
}

/** מחזיר את כל השורות (לשימוש עתידי/דיבאג בלבד - הסנכרון הרגיל הוא upsert בודד). */
function dumpAll_() {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
}

// ===== HTTP entry points =====

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    var secret = (e && e.parameter && e.parameter.secret) || '';
    if (secret !== SECRET) return jsonOut_({ error: 'unauthorized' });
    var action = (e && e.parameter && e.parameter.action) || '';
    if (action === 'dump') return jsonOut_({ ok: true, rows: dumpAll_() });
    return jsonOut_({ error: 'unknown action' });
  } catch (err) {
    return jsonOut_({ error: String(err) });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.secret !== SECRET) return jsonOut_({ error: 'unauthorized' });
    if (body.action === 'upsert_subscriber') {
      var result = upsertSubscriber_(body.data || {});
      return jsonOut_({ ok: true, result: result });
    }
    return jsonOut_({ error: 'unknown action' });
  } catch (err) {
    return jsonOut_({ error: String(err) });
  }
}
