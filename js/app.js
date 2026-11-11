"use strict";

/* ---------------------------------------------------------------
   Content data
   ---------------------------------------------------------------
   כל קטגוריה מכילה episodes. הפרקים כאן הם תוכן לדוגמה בלבד
   (sample: true) - להמחשת המבנה. כדי להוסיף תוכן אמיתי: מחליפים
   title / description / image / audio באובייקט המתאים, ומורידים
   את sample: true.

   image: נתיב לתמונת שער, או null להצגת placeholder עם אייקון הקטגוריה.
   audio: נתיב לקובץ mp3, או null להצגת תווית "בקרוב".
   pdf: (אופציונלי) נתיב לקובץ PDF להורדה/הדפסה, או null אם עוד אין.
   pointsItemKey: (אופציונלי) מקשר את הפרק לפריט "דיווח" במערכת הנקודות
     (js/points.js) - כשקיים, מוצגת תחת הפרק תיבת דיווח-קריאה לכל ילד.
     חייב להיות זהה בדיוק לערך המקביל ב-en/js/app.js לאותו פרק.
--------------------------------------------------------------- */
const CATEGORIES = [
  {
    id: "tzadikim",
    name: "זה קרה באמת",
    icon: "🕯️",
    color: "#f0812c",
    type: "audio",
    tagline: "סיפורים מהחיים, מפי מספרים, על גדולי ישראל וצדיקי הדורות - אמונה, מידות טובות ואהבת ישראל.",
    episodes: [
      {
        title: "השיכור של כל נדרי",
        description: "סיפור אמיתי על האדמו\"ר הזקן, רבי שניאור זלמן מלאדי, ועל רבי שמואל - יהודי שעשה דבר יוצא דופן בערב יום כיפור כדי להציל משפחה יהודית מבית הסוהר, ולמה הרבי אמר שליבו כבר הגיע לשמחת תורה.",
        image: "assets/images/kol-nidrei-drunkard.jpeg",
        audio: "assets/audio/kol-nidrei-drunkard-sfx4.mp3",
      },
      {
        title: "חוב של הכרת הטוב",
        description: "סיפור אמיתי על רבי איסר זלמן מלצר, ראש ישיבת עץ חיים בירושלים - ועל הסיבה שבזקנתו טיפס במדרגות קשות לבר מצווה של משפחה פשוטה, כדי להודות להם על מתנה שלא ידעו שנתנו לו.",
        image: "assets/images/isser-zalman-gratitude.jpeg",
        audio: "assets/audio/isser-zalman-gratitude-sfx4.mp3",
      },
      {
        title: "הבן איש חי",
        description: "סיפור אמיתי על רבי יוסף חיים מבגדד, המכונה \"הבן איש חי\", ועל תלמיד סקרן שניסה יום אחד לרוץ במעלה המדרגות כדי לחזות באליהו הנביא - ומה הוא למד במקום זה על הדרך האמיתית להגיע לגדלות.",
        image: "assets/images/ben-ish-chai.jpeg",
        audio: "assets/audio/ben-ish-chai-sfx4.mp3",
      },
      {
        title: "טעות בחישוב",
        description: "סיפור אמיתי על החזון איש, רבי אברהם ישעיהו קרליץ, מגדולי פוסקי ההלכה בדור האחרון - ועל הלילה שתלמידו מצא אותו שוכב על הרצפה, ומה הוא סיפר לו שהשתבש.",
        image: "assets/images/chazon-ish-calculation.jpeg",
        audio: "assets/audio/chazon-ish-calculation-sfx4.mp3",
      },
      {
        title: "לכל אחד יש מה לתת",
        description: "סיפור אמיתי על רבי שמואל הלוי ווזנר, שביקר חולה סובל בבית החולים וסיפר לו סיפור מנעוריו - על חולה אחר שגילה שגם לו, כשנדמה שאין לו כלום לתת, עדיין יש מה לתת.",
        image: "assets/images/something-to-give.jpeg",
        audio: "assets/audio/something-to-give-sfx4.mp3",
      },
      {
        title: "מים במדבר",
        description: "סיפור אמיתי על הבעל שם טוב הקדוש ועל תלמיד צמא שלמד, באמצע המדבר, עד כמה ההשגחה העליונה רואה רחוק לפנינו.",
        image: "assets/images/baal-shem-tov-water.jpeg",
        audio: "assets/audio/baal-shem-tov-water-sfx4.mp3",
      },
      {
        title: "חלק בגן עדן",
        description: "סיפור אמיתי על רבי לוי יצחק מברדיטשוב, סנגורם של ישראל, ועל חולה שייסר אותו עברו - ועל המתנה היוצאת דופן שהרבי הציע לו ברגעיו האחרונים.",
        image: "assets/images/share-in-heaven.jpeg",
        audio: "assets/audio/share-in-heaven-sfx4.mp3",
      },
      {
        title: "הקצין המאמין",
        description: "סיפור אמיתי שסיפר קצין חילוני לרבי שלמה קרליבך במלחמת יום הכיפורים - על בקשתו האחרונה של חבר פצוע, ועל הרגע ששתי מילים שינו הכול.",
        image: "assets/images/believing-officer.jpeg",
        audio: "assets/audio/believing-officer-sfx4.mp3",
      },
      {
        title: "הבבא סלי מלמד על כבוד חכמים",
        description: "סיפור אמיתי על הבבא סלי, רבי ישראל אבוחצירא, ועל אדם שכתב ספר שבו חלק על האור החיים הקדוש - ומה קרה כשהגיע לביתו של הבבא סלי בנטיבות, ומה אפשר ללמוד מזה על היחס לדברי חכמים.",
        image: "assets/images/baba-sali-respect.jpeg",
        audio: "assets/audio/baba-sali-respect-sfx4.mp3",
      },
      {
        title: "ורחמיו על כל מעשיו",
        description: "סיפור אמיתי על האר\"י הקדוש ועל זוג טוב לב, מכניסי אורחים, שחיכו שנים לילדים - ועל דבר קטן מהעבר שהאר\"י עזר להם להבין.",
        image: "assets/images/ari-kindness-to-animals.jpeg",
        audio: "assets/audio/ari-kindness-to-animals-sfx4.mp3",
      },
      {
        title: "הבעל שם טוב והנער המאמין",
        description: "סיפור אמיתי על הבעל שם טוב ועל נער כפרי פשוט שלא ידע להתפלל ולא ללמוד תורה - ומה עשה כדי להראות כמה הוא אוהב את ה'.",
        image: "assets/images/besht-flute-boy.jpeg",
        audio: "assets/audio/besht-flute-boy-sfx4.mp3",
      },
      {
        title: "הרב מרדכי אליהו והחתול",
        description: "יום עמוס ומלא אנשים בבית הרב הראשי לישראל, ובדיוק כשהוא צריך לצאת - שאלה אחת ממתינה לו. לא שאלה הלכתית גדולה, אלא שאלה על חתול שלא אוכל. איך רואים גדלות אמיתית מתוך הדברים ה\"קטנים\"?",
        image: "assets/images/mordechai-eliyahu-cat.jpeg",
        audio: "assets/audio/mordechai-eliyahu-cat-sfx4.mp3",
      },
      {
        title: "השם לא חייב לנו כלום",
        description: "סיפור אמיתי שסיפרה אישה שחיכתה שנים רבות לילדים, ועל הברכה שקיבלה מגדול הדור - רבי שלמה זלמן אויערבך. מה הוא אמר לה שליווה אותה מאז בכל יום מחדש?",
        image: "assets/images/hashem-not-obligated.jpeg",
        audio: "assets/audio/hashem-not-obligated-sfx4.mp3",
      },
      {
        title: "כוחה של מצווה אחת",
        description: "סיפור אמיתי על הרבי מלובביץ' ועל ילדה שמיום היוולדה לא אמרה מילה. ההורים כבר התייאשו, עד שחבר שלח אותם אל הרבי, ומצווה אחת שהיא קיבלה על עצמה שינתה הכול.",
        image: "assets/images/power-of-one-mitzvah-rebbe.jpeg",
        audio: "assets/audio/power-of-one-mitzvah-sfx5.mp3",
      },
      {
        title: "כעמידה בפני מלך",
        description: "סיפור אמיתי על רבי דוד פיינשטיין, סבא רבא של רבי משה פיינשטיין, שעבד אצל איכר גוי והתפלל בכוונה כזאת, שאפילו יריית רובה מעל ראשו לא הוציאה אותו מהתפילה.",
        image: "assets/images/standing-before-a-king.jpeg",
        audio: "assets/audio/standing-before-a-king-sfx5.mp3",
      },
      {
        title: "כבוד תלמידי חכמים",
        description: "סיפור אמיתי על רבי שמואל סלנט, רבה של ירושלים, ועל נדבן עשיר מאמריקה שלא הבין למה הרב מכבד כל כך אברך עני בבגדים קרועים, עד שהציץ בלילה דרך החלון של ביתו.",
        image: "assets/images/honor-torah-scholars.jpeg",
        audio: "assets/audio/honor-torah-scholars-sfx4.mp3",
      },
    ],
  },
  {
    id: "serials",
    name: "סיפורים בהמשכים",
    icon: "📜",
    color: "#c98a2b",
    type: "audio",
    tagline: "סיפור אחד ארוך, פרק אחרי פרק. בוחרים סיפור, פותחים אותו, ומאזינים מההתחלה ועד הסוף.",
    // סיפורים בהמשכים (אברהם, 2026-11-11): serial = הפרקים מוצגים לפי הסדר שבו הם כתובים כאן (פרק 1 ראשון), וכל סיפור הוא
    // כרטיסייה שנפתחת בלחיצה, כמו הנישות של "יש לי מושג". סיפור חדש = שורה ב-niches (theme = העיצוב שלו ב-css) ופרקים עם niche שלו.
    serial: true,
    niches: [
      { id: "wondrous-map", name: "המפה המופלאה", icon: "🗺️", theme: "map", image: "assets/images/serials/wondrous-map.jpg", blurb: "מלך טוב לב, ילד סקרן בשם פרדינן, ומפה אחת ענקית שנעלמת ברגע אחד. משל של רבי נחמן מברסלב, בעשרה פרקים." },
    ],
    episodes: [
      {
        niche: "wondrous-map",
        eyebrow: "המפה המופלאה · פרק 1 מתוך 10",
        title: "פרק 1: המלך שהיה לו הכול (חוץ מדבר אחד)",
        description: "למלך טוב הלב יש ארמון, גנים ואוצרות, ורק דבר אחד חסר לו. הרופאים שמגיעים לעזור מביאים איתם עצות מוזרות מאוד, ושום דבר לא עובד.",
        image: "assets/images/wondrous-map-ch01.jpeg",
        audio: "assets/audio/wondrous-map-ch01-sfx4.mp3",
      },
      {
        niche: "wondrous-map",
        eyebrow: "המפה המופלאה · פרק 2 מתוך 10",
        title: "פרק 2: האורח שלא היה אמור להיכנס",
        description: "עני עייף ורעב עומד בשער הארמון, והשומרים רוצים לגרש אותו. המלך מחליט אחרת, והאורח נפרד ממנו בברכה שהמלך עוד לא יודע כמה היא שווה.",
        image: "assets/images/wondrous-map-ch02.jpeg",
        audio: "assets/audio/wondrous-map-ch02-sfx5.mp3",
      },
      {
        niche: "wondrous-map",
        eyebrow: "המפה המופלאה · פרק 3 מתוך 10",
        title: "פרק 3: פרדינן",
        description: "שמחה גדולה בארמון: למלך נולד בן, ושמו פרדינן. ילד סקרן ותמים שמשחק בקוביות על מדרגות כיסא המלכות ושואל שאלות על הכול.",
        image: "assets/images/wondrous-map-ch03.jpeg",
        audio: "assets/audio/wondrous-map-ch03-sfx4.mp3",
      },
      {
        niche: "wondrous-map",
        eyebrow: "המפה המופלאה · פרק 4 מתוך 10",
        title: "פרק 4: ממלכה בלי תמונה ברורה",
        description: "המלך יודע כמה זהב יש באוצר וכמה חיילים יש בצבא, אבל הוא לא יודע איך הממלכה שלו באמת נראית. ואיך מגינים על ממלכה כשלא יודעים איפה הנהר הצפוני?",
        image: "assets/images/wondrous-map-ch04.jpeg",
        audio: "assets/audio/wondrous-map-ch04-sfx5.mp3",
      },
      {
        niche: "wondrous-map",
        eyebrow: "המפה המופלאה · פרק 5 מתוך 10",
        title: "פרק 5: הרעיון המבריק",
        description: "היועץ הזקן, שכמעט אף פעם לא מדבר, קם ומציע רעיון אחד: מפה. שמונה שנים של מדידות בהרים ובנהרות, עד שהמפה הגדולה נתלית מאחורי כס המלכות.",
        image: "assets/images/wondrous-map-ch05.jpeg",
        audio: "assets/audio/wondrous-map-ch05-sfx5.mp3",
      },
      {
        niche: "wondrous-map",
        eyebrow: "המפה המופלאה · פרק 6 מתוך 10",
        title: "פרק 6: משחק קטן, בעיה גדולה",
        description: "שליח פורץ לאולם, המלך והשרים ממהרים לחדר המלחמה, ופרדינן נשאר לבד עם הצבעים שלו. הוא מחפש דף לצייר עליו, ואז מרים את הראש.",
        image: "assets/images/wondrous-map-ch06.jpeg",
        audio: "assets/audio/wondrous-map-ch06-sfx5.mp3",
      },
      {
        niche: "wondrous-map",
        eyebrow: "המפה המופלאה · פרק 7 מתוך 10",
        title: "פרק 7: המשחק שהסתבך",
        description: "פרדינן מצייר על הצד הריק של המפה אדם עם כובע גדול, ואחר כך עולה לו רעיון חדש: להכין ממנה פאזל. ובדיוק אז נשמעים צעדים במסדרון.",
        image: "assets/images/wondrous-map-ch07.jpeg",
        audio: "assets/audio/wondrous-map-ch07-sfx5.mp3",
      },
      {
        niche: "wondrous-map",
        eyebrow: "המפה המופלאה · פרק 8 מתוך 10",
        title: "פרק 8: איפה המפה?",
        description: "המלך חוזר וצריך את המפה מיד, אבל הקיר ריק, ועל הרצפה פזורות עשרות חתיכות קטנות. איך אפשר לחבר מפה שבה הכול נראה אותו דבר?",
        image: "assets/images/wondrous-map-ch08.jpeg",
        audio: "assets/audio/wondrous-map-ch08-sfx5.mp3",
      },
      {
        niche: "wondrous-map",
        eyebrow: "המפה המופלאה · פרק 9 מתוך 10",
        title: "פרק 9: הפתרון המפתיע",
        description: "המלך והיועצים יושבים בלי פתרון, ואז נשמעת דפיקה קלה בדלת. פרדינן נכנס עם יריעה מגולגלת ביד, וסוד קטן שמסתתר בצד השני שלה.",
        image: "assets/images/wondrous-map-ch09.jpeg",
        audio: "assets/audio/wondrous-map-ch09-sfx5.mp3",
      },
      {
        niche: "wondrous-map",
        eyebrow: "המפה המופלאה · פרק 10 מתוך 10",
        title: "פרק 10: איך מתקנים את העולם?",
        description: "מה הסיפור על המלך, על המפה ועל פרדינן מלמד אותנו? המשל והנמשל: איך מתקנים עולם שלם, ומאיפה מתחילים.",
        image: "assets/images/wondrous-map-ch10.jpeg",
        audio: "assets/audio/wondrous-map-ch10-sfx5.mp3",
      },
    ],
  },
  {
    id: "what-to-do",
    name: "יש לי מושג",
    icon: "🙋‍♂️",
    color: "#22bcc7",
    type: "audio",
    tagline: "שאלה הלכתית לילדים, עם התשובה - הכול מוקרא יחד בהקלטה אחת.",
    // נישות הלכתיות (אברהם, 2026-11-04: "כל פעם הולך להוסיף נישות הלכתיות שונות"): פרק עם niche: "<id>" מוצג תחת
    // הכותרת של הנישה; פרק בלי נישה, תחת "עוד שאלות". נישה חדשה = שורה כאן ו-niche בפרקים שלה.
    niches: [
      { id: "brachot", name: "ברכות", icon: "🍎", image: "assets/images/niches/brachot.jpg", blurb: "למה מברכים, על מה מברכים קודם, עיקר וטפל, מה מברכים על פיצה ומה עושים כשהשוקו נשפך. ובכל פרק אפשר לבדוק את עצמכם 📖" },
    ],
    episodes: [
      {
        title: "ברכת המזון",
        description: "ידעני והחברים גמרו לאכול כריכים בגינה ורצים לשחק כדורגל, אבל הרב קורא להם מהספסל: ומה עם ברכת המזון? למה מברכים אחרי האוכל, מי באמת נותן לנו את הלחם, ומה יש בארבע הברכות.",
        image: "assets/images/birkat-hamazon.jpeg",
        audio: "assets/audio/birkat-hamazon-sfx7.mp3",
        niche: "brachot",
        quiz: [
          {
            art: ["bread", "plate", "sparkles"],
            question: "מכמה ברכות מורכבת ברכת המזון?",
            options: ["משתי ברכות", "מארבע ברכות", "משבע ברכות", "תלוי כמה משולשי פיצה אכלתי 🍕"],
            answer: 1,
            funny: 3,
            explain: "ברכת הזן, ברכת הארץ, ברכת ירושלים, והטוב והמטיב.",
            audio: "assets/audio/quiz/birkat-hamazon-q1-ask-2.mp3",
            cues: [12.06, 14.75, 17.52, 20.29, 23.74],
            audioOk: "assets/audio/quiz/birkat-hamazon-q1-ok.mp3",
          },
          {
            art: ["synagogue", "bread", "cake"],
            question: "מה אנחנו מזכירים בברכה השלישית של ברכת המזון?",
            options: ["את ירושלים, ומתפללים על בנייתה", "ארץ ישראל", "את כל הברואים שהשם נותן להם מזון", "את הקינוח, שעוד לא הגיע 🍰"],
            answer: 0,
            funny: 3,
            explain: "הברכה השלישית היא ברכת ירושלים: מזכירים את ירושלים ומתפללים על בנייתה.",
            audio: "assets/audio/quiz/birkat-hamazon-q2-ask-2.mp3",
            cues: [11.61, 15.96, 18.49, 22.79, 25.46],
            audioOk: "assets/audio/quiz/birkat-hamazon-q2-ok.mp3",
          },
          {
            art: ["wheat", "bread", "sun"],
            question: "מי באמת נותן לנו את הלחם?",
            options: ["האופה שאפה אותו", "החקלאי שגידל את החיטה", "הטוסטר, כמובן 🍞", "השם יתברך"],
            answer: 3,
            funny: 2,
            explain: "הרבה אנשים עבדו בשביל הלחם, אבל את האדמה, הגשם והשמש נתן לנו השם.",
            audio: "assets/audio/quiz/birkat-hamazon-q3-ask-2.mp3",
            cues: [8.47, 11.43, 14.59, 17.18, 18.92],
            audioOk: "assets/audio/quiz/birkat-hamazon-q3-ok.mp3",
          },
        ],
      },
      {
        title: "פרשת השבוע",
        description: "למה קוראים בכל שבת פרשה אחרת בתורה, מה זה קשור אלינו אחרי אלפי שנים, ואיך אפשר להקשיב לקריאה ולשאול: מה הפרשה הזאת רוצה ללמד אותי?",
        image: "assets/images/parasha-of-the-week.jpeg",
        audio: "assets/audio/parasha-of-the-week-sfx5.mp3",
        hidden: true,   // אברהם, 2026-11-10: להסתיר לעת עתה, כי הוא פרק יחיד מחוץ לנישה. להחזרה: למחוק את השורה
      },
      {
        title: "למה מברכים?",
        description: "ידעני \"רק טועם\" פירור מעוגייה בקונדיטוריה, והרב רואה אותו. למה מברכים לפני שאוכלים, האם מברכים גם על פירור קטן, ואולי אפשר פשוט לברך \"שהכל\" על הכול?",
        image: "assets/images/why-we-bless.jpeg",
        audio: "assets/audio/why-we-bless-sfx7.mp3",
        niche: "brachot",
        quiz: [
          {
            art: ["cookie", "magnifier"],
            question: "כמה צריך לאכול כדי שנהיה חייבים לברך לפני האכילה?",
            options: ["לפחות פרוסה שלמה", "אפילו פירור אחד קטן", "רק כשממש ממש רעבים", "רק אם העוגייה ממש טעימה 🍪"],
            answer: 1,
            funny: 3,
            explain: "אין כמות קטנה מדי לברכה, אפילו גרגיר אחד.",
            audio: "assets/audio/quiz/why-we-bless-q1-ask-2.mp3",
            cues: [15.5, 18.8, 22.77, 26.76, 29.94],
            audioOk: "assets/audio/quiz/why-we-bless-q1-ok.mp3",
          },
          {
            art: ["candy", "cup", "lollipop"],
            question: "מישהו בירך בטעות 'שהכל' על מאכל שיש לו ברכה אחרת. מה הדין?",
            options: ["צריך לבקש סליחה מהמאכל 🙇", "חייב לברך שוב את הברכה הנכונה", "יצא ידי חובה, אבל רק בדיעבד", "אסור לו לאכול מהמאכל הזה לעולם"],
            answer: 2,
            funny: 0,
            explain: "יצא ידי חובה בדיעבד, אבל לכתחילה לומדים איזו ברכה מתאימה לכל מאכל.",
            audio: "assets/audio/quiz/why-we-bless-q2-ask-2.mp3",
            cues: [11.35, 16.28, 20.54, 24.76, 28.17],
            audioOk: "assets/audio/quiz/why-we-bless-q2-ok.mp3",
          },
          {
            art: ["cookie", "chocolate", "magnifier"],
            question: "נגיד שאנחנו לא יודעים איזו ברכה מברכים על מאכל, ניסינו לברר ולא הצלחנו. מה עושים?",
            options: ["אוכלים בלי ברכה", "מברכים את כל הברכות שאני מכיר, ליתר ביטחון", "מברכים 'שהכל נהיה בדברו'", "שואלים את המאכל מה הוא מעדיף שנברך עליו 🤔"],
            answer: 2,
            funny: 3,
            explain: "כשבאמת ניסינו לברר ולא הצלחנו, מברכים 'שהכל נהיה בדברו'. אבל עדיף לאכול אותו בתוך הסעודה, ששם בירכנו על הלחם.",
            audio: "assets/audio/quiz/why-we-bless-q3-ask-2.mp3",
            cues: [17.43, 20.82, 25.27, 28.21, 33.06],
            audioOk: "assets/audio/quiz/why-we-bless-q3-ok.mp3",
          },
        ],
      },
      {
        title: "כמה זמן מותר לחכות בין הברכה לאכילה?",
        description: "ידעני בירך על תפוח בהפסקה, ראה את הרב והתחיל לספר לו על הטיול השנתי. רק אז נזכר שעוד לא אכל אפילו ביס! מתי צריך לברך שוב, ומתי מותר להתעכב בין הברכה לאכילה.",
        image: "assets/images/bracha-to-eating-gap.jpeg",
        audio: "assets/audio/bracha-to-eating-gap-sfx7.mp3",
        niche: "brachot",
        quiz: [
          {
            art: ["apple", "speech"],
            question: "בירכתם על תפוח, ואז סיפרתם לחבר מה קרה בהפסקה. מה עושים לפני שאוכלים?",
            options: ["אוכלים בכל זאת, הברכה עדיין בתוקף", "מחכים חמש דקות ואז אוכלים", "מבקשים מהתפוח סליחה יפה 🍎", "מברכים שוב"],
            answer: 3,
            funny: 2,
            explain: "דיברנו על משהו שלא קשור לאכילה, ולכן מברכים שוב.",
            audio: "assets/audio/quiz/bracha-to-eating-gap-q1-ask-2.mp3",
            cues: [11.45, 16.18, 20.42, 24.64, 26.63],
            audioOk: "assets/audio/quiz/bracha-to-eating-gap-q1-ok.mp3",
          },
          {
            art: ["green-apple", "hourglass"],
            question: "בירכתם על תפוח וחיכיתם קצת בשקט, בלי לדבר. צריך לברך שוב?",
            options: ["לא, אין צורך לברך שוב", "כן, תמיד מברכים שוב", "רק אם התפוח התחיל להשתעמם 🍏", "רק אם עברה יותר מדקה"],
            answer: 0,
            funny: 2,
            explain: "אם לא דיברנו, אין צורך לברך שוב. אבל לכתחילה אוכלים מיד אחרי הברכה.",
            audio: "assets/audio/quiz/bracha-to-eating-gap-q2-ask-2.mp3",
            cues: [15.5, 18.94, 22.75, 26.3, 29.01],
            audioOk: "assets/audio/quiz/bracha-to-eating-gap-q2-ok.mp3",
          },
          {
            art: ["apple", "knife"],
            question: "אתם מחזיקים תפוח גדול ורוצים לחתוך אותו לפני שתאכלו אותו. מתי עדיף לברך?",
            options: ["אחרי שחותכים, על החתיכות", "באמצע החיתוך", "רק כשהתפוח מסכים שיחתכו אותו 🍎", "לפני שחותכים, על הפרי השלם"],
            answer: 3,
            funny: 2,
            explain: "עדיף לברך על הפרי השלם, וכך מכבדים יותר את הברכה. מותר לחתוך אחרי הברכה, כי זה חלק מהכנת האוכל.",
            audio: "assets/audio/quiz/bracha-to-eating-gap-q3-ask-2.mp3",
            cues: [15.59, 18.7, 21.57, 25.15, 28.57],
          },
        ],
      },
      {
        title: "מה מברכים על תרופות?",
        description: "ידעני חולה, והרב בא לבקר אותו. מברכים על תרופה? ועל המים ששותים כדי לבלוע אותה? ומה עושים כשנזכרים באמצע העוגייה ששכחנו לברך?",
        image: "assets/images/bracha-on-medicine.jpeg",
        audio: "assets/audio/bracha-on-medicine-sfx7.mp3",
        niche: "brachot",
        quiz: [
          {
            art: ["pill", "drop"],
            question: "שתיתם מים רק כדי לבלוע תרופה, ולא כי הייתם צמאים. האם מברכים על המים?",
            options: ["כן, על מים תמיד מברכים", "לא מברכים", "מברכים רק אם המים ממש קרים", "רק אם הכוס מחייכת אליי 🥤"],
            answer: 1,
            funny: 3,
            explain: "על מים ששותים רק כדי לבלוע תרופה לא מברכים, כי לא שותים אותם מצמא.",
            audio: "assets/audio/quiz/bracha-on-medicine-q1-ask-2.mp3",
            cues: [18.78, 22.14, 24.71, 28.83, 31.46],
            audioOk: "assets/audio/quiz/bracha-on-medicine-q1-ok.mp3",
          },
          {
            art: ["pill", "spoon", "strawberry"],
            question: "יש לי תרופה עם טעם טוב. מה מברכים עליה?",
            options: ["לא מברכים על תרופה אף פעם", "שהכל נהיה בדברו", "בורא פרי העץ", "שואלים את התרופה אם היא טעימה 😋"],
            answer: 1,
            funny: 3,
            explain: "על תרופה עם טעם טוב מברכים 'שהכל'. על תרופה שהטעם שלה לא טוב, לא מברכים.",
            audio: "assets/audio/quiz/bracha-on-medicine-q2-ask-2.mp3",
            cues: [7.58, 11.22, 14.03, 16.64, 20.18],
            audioOk: "assets/audio/quiz/bracha-on-medicine-q2-ok.mp3",
          },
          {
            art: ["cookie", "sandwich"],
            question: "נזכרתם באמצע האוכל ששכחתם לברך, והפה שלכם מלא. מה עושים?",
            options: ["מסמנים לאוכל לחכות רגע 🤫", "מברכים עם הפה מלא, העיקר לברך", "יורקים את הכול החוצה", "מזיזים את האוכל לצד של הפה, מברכים וממשיכים"],
            answer: 3,
            funny: 0,
            explain: "אסור לברך כשהפה מלא. מזיזים את האוכל לצד של הפה, מברכים, וממשיכים לאכול.",
            audio: "assets/audio/quiz/bracha-on-medicine-q3-ask-2.mp3",
            cues: [12.66, 16.22, 20.51, 23.59, 28.51],
            audioOk: "assets/audio/quiz/bracha-on-medicine-q3-ok.mp3",
          },
        ],
      },
      {
        title: "עיקר וטפל בברכות",
        description: "בקידוש של בר המצווה ידעני בונה מגדל טונה על קרקר אחד. צריך לברך גם על הקרקר? הרב מסביר מה זה עיקר וטפל, ולמה לא מברכים על המים ששותים אחרי פלפל חריף.",
        image: "assets/images/bracha-ikar-tafel.jpeg",
        audio: "assets/audio/bracha-ikar-tafel-sfx7.mp3",
        niche: "brachot",
        quiz: [
          {
            art: ["fish", "cracker", "can"],
            question: "אוכלים ממרח טונה על קרקר, ואת הקרקר אוכלים רק כדי שיהיה נוח לאכול את הטונה. על מה מברכים?",
            options: ["'מזונות' על הקרקר וגם 'שהכל' על הטונה", "רק 'שהכל' על הטונה", "רק 'מזונות' על הקרקר", "מברכים את הקרקר שיהיה חזק ולא יישבר 🍘"],
            answer: 1,
            funny: 3,
            explain: "הטונה היא העיקר והקרקר הוא הטפל, ולכן הברכה על הטונה פוטרת גם את הקרקר.",
            audio: "assets/audio/quiz/bracha-ikar-tafel-q1-ask-2.mp3",
            cues: [17.8, 22.66, 26.12, 29.24, 33.22],
            audioOk: "assets/audio/quiz/bracha-ikar-tafel-q1-ok.mp3",
          },
          {
            art: ["pepper", "fire", "drop"],
            question: "ילד אכל פלפל חריף, ושתה קצת מים רק כדי להקל על החריפות. מברכים על המים?",
            options: ["כן, על מים תמיד מברכים", "רק אם המים קרים מאוד", "לא, המים טפלים לפלפל", "מברכים על הפלפל שיירגע קצת 🌶️"],
            answer: 2,
            funny: 3,
            explain: "המים באו רק כדי להעביר את החריפות, ולכן הם טפלים לפלפל ואין צורך לברך עליהם. וגם לחם שאוכלים רק כדי להקל על החריפות, לא מברכים עליו.",
            audio: "assets/audio/quiz/bracha-ikar-tafel-q2-ask-2.mp3",
            cues: [14.31, 18.29, 21.72, 25.13, 28.86],
            audioOk: "assets/audio/quiz/bracha-ikar-tafel-q2-ok.mp3",
          },
          {
            art: ["can", "cracker"],
            question: "בירכתם 'שהכל' על הטונה, ורק אחר כך החלטתם להוסיף קרקר שלא חשבתם עליו קודם. מה עושים?",
            options: ["מברכים גם על הקרקר", "לא מברכים, הברכה על הטונה פוטרת הכול", "מוותרים ולא אוכלים את הטונה", "מוותרים על הקרקר"],
            answer: 0,
            funny: null,
            explain: "הטפל נפטר רק אם כבר בזמן הברכה התכוונו לאכול אותו עם העיקר, או שרגילים תמיד לאכול אותם יחד.",
            audio: "assets/audio/quiz/bracha-ikar-tafel-q3-ask-2.mp3",
            cues: [12.39, 15.63, 20.89, 24.41, 26.5],
            audioOk: "assets/audio/quiz/bracha-ikar-tafel-q3-ok.mp3",
          },
        ],
      },
      {
        title: "סדר קדימה בברכות",
        description: "ידעני מגיע לחנוכת הבית של הרב ומוצא צלחת ענקית: עוגיות, ענבים, תמרים, תפוחים ומלפפונים. על מה מברכים קודם? הסימן מגע\"ש, הפרי שהכי אוהבים ושבעת המינים.",
        image: "assets/images/bracha-precedence.jpeg",
        audio: "assets/audio/bracha-precedence-sfx9.mp3",
        niche: "brachot",
        quiz: [
          {
            art: ["cookie", "apple"],
            question: "על השולחן עוגייה ותפוח. על מה מברכים קודם?",
            options: ["על התפוח, כי הוא בריא יותר", "על העוגייה, כי 'מזונות' באה לפני 'העץ'", "על מה שהכי קרוב לצלחת שלי", "על מי שצועק הכי חזק 'תאכל אותי קודם!' 🍪"],
            answer: 1,
            funny: 3,
            explain: "לפי הסימן מגע\"ש: מזונות, גפן, עץ, אדמה ושהכל. לכן 'מזונות' לפני 'העץ'.",
            audio: "assets/audio/quiz/bracha-precedence-q1-ask-2.mp3",
            cues: [15.21, 18.44, 24.14, 27.29, 32.07],
            audioOk: "assets/audio/quiz/bracha-precedence-q1-ok.mp3",
          },
          {
            art: ["apple", "palm"],
            question: "לפניכם תפוח ותמר, ואתם אוהבים את שניהם באותה מידה. על איזה מהם מברכים?",
            options: ["על התמר, כי הוא משבעת המינים", "על התפוח, כי הוא גדול יותר", "מגרילים לפי ספירת גרעינים 🍎", "על מה שנחתך ראשון"],
            answer: 0,
            funny: 2,
            explain: "כשאוהבים את שניהם באותה מידה, מקדימים את הפרי משבעת המינים.",
            audio: "assets/audio/quiz/bracha-precedence-q2-ask-2.mp3",
            cues: [9.21, 12.82, 15.61, 19.71, 22.66],
            audioOk: "assets/audio/quiz/bracha-precedence-q2-ok.mp3",
          },
          {
            art: ["grapes", "palm"],
            question: "לפניכם ענבים ותמרים, ואתם אוהבים את שניהם באותה מידה. על איזה מהם מברכים?",
            options: ["על הענבים", "על מה שמתוק יותר", "על התמרים, כי הם קרובים יותר למילה 'ארץ'", "על מה שאחי עוד לא הספיק לחטוף 😋"],
            answer: 2,
            funny: 3,
            explain: "התמרים מוזכרים במקום השני אחרי 'ארץ' השנייה, והענבים במקום השלישי אחרי 'ארץ' הראשונה.",
            audio: "assets/audio/quiz/bracha-precedence-q3-ask-2.mp3",
            cues: [13.65, 15.71, 17.79, 21.49, 25.06],
            audioOk: "assets/audio/quiz/bracha-precedence-q3-ok.mp3",
          },
        ],
      },
      {
        title: "מה עושים כשהשוקו נשפך?",
        description: "ידעני בירך על כוס שוקו, והחתולה שפכה אותה. צריך לברך שוב על הכוס החדשה? ומה עושים עם תפוז שנפל על הרצפה מיד אחרי הברכה? שיחה בין ידעני לרב.",
        image: "assets/images/spilled-chocolate-milk.jpeg",
        audio: "assets/audio/spilled-chocolate-milk-sfx9.mp3",
        niche: "brachot",
        quiz: [
          {
            art: ["milk", "chocolate", "cat"],
            question: "בירכתם 'שהכל' על כוס שוקו, והיא נשפכה לפני ששתיתם. אמא הכינה כוס חדשה. מה עושים?",
            options: ["מברכים שוב על הכוס החדשה", "לא מברכים, הברכה הראשונה עדיין בתוקף", "מבקשים מהחתולה לברך הפעם במקומנו 🐱", "שותים בלי ברכה, כי כבר בירכנו היום"],
            answer: 0,
            funny: 2,
            explain: "הברכה הייתה על הכוס שנשפכה, ולכן על הכוס החדשה מברכים שוב.",
            audio: "assets/audio/quiz/spilled-chocolate-milk-q1-ask-2.mp3",
            cues: [16.17, 19.34, 24.86, 28.4, 32.63],
            audioOk: "assets/audio/quiz/spilled-chocolate-milk-q1-ok.mp3",
          },
          {
            art: ["milk", "cup"],
            question: "ומה אם הכוס השנייה כבר עמדה לפניכם כשבירכתם על הראשונה?",
            options: ["אז לא צריך לברך עליה", "צריך לברך עליה מחדש, כי בזמן הברכה לא התכוונתם לשתות ממנה", "מברכים רק חצי ברכה", "שותים את שתיהן ביחד, ליתר ביטחון 🥤"],
            answer: 1,
            funny: 3,
            explain: "בזמן הברכה התכוונתם לשתות רק מהכוס הראשונה, ולכן הברכה לא פוטרת את השנייה.",
            audio: "assets/audio/quiz/spilled-chocolate-milk-q2-ask-2.mp3",
            cues: [6.29, 8.74, 15.26, 18.16, 21.49],
            audioOk: "assets/audio/quiz/spilled-chocolate-milk-q2-ok.mp3",
          },
          {
            art: ["orange", "sparkles"],
            question: "בירכתם על תפוז, והוא נפל על הרצפה והתלכלך. מה עדיף לעשות?",
            options: ["חייבים לאכול את כולו, גם אם הוא מלוכלך", "לוותר עליו בלי לחשוב פעמיים", "אם אפשר, לטעום ממנו מעט, כדי שהברכה לא תהיה לבטלה", "להגיד לתפוז 'לא נורא, זה קורה לכולם' 🍊"],
            answer: 2,
            funny: 3,
            explain: "לא חייבים להכריח את עצמנו לאכול מאכל שלא טעים לנו, אבל אם אפשר, עדיף לטעום ממנו מעט, כדי שהברכה לא תהיה לבטלה.",
            audio: "assets/audio/quiz/spilled-chocolate-milk-q3-ask-2.mp3",
            cues: [17.42, 22.0, 25.06, 31.41, 35.14],
            audioOk: "assets/audio/quiz/spilled-chocolate-milk-q3-ok.mp3",
          },
        ],
      },
      {
        title: "מה מברכים על פיצה?",
        description: "ידעני עולה אל הרב עם שאלה: נכון שעל משולש אחד מברכים מזונות ועל שניים המוציא? מה נוהגים בני ספרד ובני אשכנז, ולמה הכמות שאוכלים יכולה לשנות את הברכה.",
        image: "assets/images/bracha-on-pizza.jpeg",
        audio: "assets/audio/bracha-on-pizza-sfx8.mp3",
        niche: "brachot",
        quiz: [
          {
            art: ["pizza", "cheese"],
            question: "מה נוהגים בני ספרד לברך על משולש אחד של פיצה?",
            options: ["המוציא", "מזונות", "שהכל", "'בורא פרי הגבינה' 🍕"],
            answer: 0,
            funny: 3,
            explain: "בני ספרד נוהגים לברך המוציא אפילו על משולש אחד של פיצה.",
            audio: "assets/audio/quiz/bracha-on-pizza-q1-ask-2.mp3",
            cues: [10.33, 12.07, 13.68, 15.23, 16.87],
            audioOk: "assets/audio/quiz/bracha-on-pizza-q1-ok.mp3",
          },
          {
            art: ["pizza", "tap", "baguette"],
            question: "אשכנזי מתכוון לאכול שני משולשי פיצה או יותר. מה הוא מברך?",
            options: ["מזונות, כמו על משולש אחד", "נוטל ידיים ומברך המוציא", "מזונות פעמיים, פעם לכל משולש", "שואל את שליח הפיצה 🛵"],
            answer: 1,
            funny: 3,
            explain: "כשאוכלים כמות שאדם רגיל עושה ממנה ארוחה ושובע, המאפה נחשב כמו לחם: נוטלים ידיים ומברכים המוציא.",
            audio: "assets/audio/quiz/bracha-on-pizza-q2-ask-2.mp3",
            cues: [13.4, 16.54, 19.95, 23.99, 26.52],
            audioOk: "assets/audio/quiz/bracha-on-pizza-q2-ok.mp3",
          },
          {
            art: ["plate", "pizza", "clock"],
            question: "לפי מה קובעים כמה אוכל זו 'ארוחה של ממש'?",
            options: ["לפי גודל הקופסה של הפיצה", "לפי כמה שאני רגיל לאכול", "לפי כמה הבטן שלי מקרקרת 😋", "לפי כמה שאדם ממוצע אוכל בארוחת צהריים או ערב כדי לשבוע"],
            answer: 3,
            funny: 2,
            explain: "לא לפי מה שכל אחד רגיל לאכול, אלא לפי הכמות שאדם ממוצע אוכל בארוחה כדי לשבוע.",
            audio: "assets/audio/quiz/bracha-on-pizza-q3-ask-2.mp3",
            cues: [10.32, 13.34, 15.7, 18.79, 24.22],
            audioOk: "assets/audio/quiz/bracha-on-pizza-q3-ok.mp3",
          },
        ],
      },
    ],
  },
  {
    id: "wonders",
    name: "נפלאות הבריאה",
    icon: "🦋",
    color: "#4caf6d",
    type: "audio",
    tagline: "סיורים קוליים בעולם הטבע - בעלי חיים, צמחים ותופעות מדהימות, שמראות איך הכול נברא בחוכמה.",
    episodes: [
      {
        title: "העטלף המופלא",
        description: "איך עטלף מצליח לעוף בלילה, בחשכה מוחלטת, בלי להתנגש בשום דבר? גלו את הסוד המדהים של היונק היחיד בעולם שיכול לעוף.",
        images: ["assets/images/amazing-bat-main.jpeg", "assets/images/amazing-bat.jpeg"],
        audio: "assets/audio/amazing-bat-sfx7.mp3",
      },
      {
        title: "הברווזן",
        description: "בעל חיים עם פרווה של יונק, מקור של ברווז וקרומי שחייה - שמטיל ביצים! הכירו את הברווזן, אחד מבעלי החיים המוזרים והמפתיעים ביותר בעולם.",
        images: ["assets/images/platypus-main.jpeg", "assets/images/platypus.jpeg"],
        audio: "assets/audio/platypus-sfx7.mp3",
      },
      {
        title: "הבונה החכם",
        description: "יצור שכורת עצים שלמים בשיניים שלו, ובונה לעצמו בית בתוך המים. למה דווקא שם? הכירו את הבונה, אחד הבנאים המוכשרים ביותר בטבע.",
        image: "assets/images/wise-builder.jpeg",
        audio: "assets/audio/wise-builder-sfx7.mp3",
      },
      {
        title: "צפרדעי החצים המורעלים",
        description: "צפרדעים קטנטנות, צבעוניות ומבריקות, שנחשבות לבעלי החיים הארסיים ביותר בעולם. למה קוראים להן צפרדעי החצים, ואיך הן הופכות לרעילות כשהן בכלל לא נולדות כך?",
        image: "assets/images/poison-dart-frogs.jpeg",
        audio: "assets/audio/poison-dart-frogs-sfx7.mp3",
      },
      {
        title: "ברלה ברלה צא החוצה",
        description: "חלזונות הים הם לא כמו החלזונות שבגינה: יש ביניהם בכל צבעי הקשת, כאלה שמשנים צורה וזוהרים בחושך, ואפילו כאלה שמצמיחים לעצמם גוף חדש מהראש בלבד!",
        image: "assets/images/berele-come-out.jpeg",
        audio: "assets/audio/berele-come-out-sfx7.mp3",
      },
    ],
  },
  {
    id: "parasha-what",
    name: "מה בפרשה",
    icon: "📜",
    color: "#3aa8e0",
    type: "audio",
    tagline: "סיפור פרשת השבוע בשפה פשוטה וברורה - פרק קצר שאפשר להקשיב לו בדרך לבית הספר.",
    episodes: [
      {
        title: "פרשת בראשית",
        parasha: "בראשית",
        description: "ששת ימי הבריאה, אדם וחווה בגן עדן וסיפור קין והבל - והמסר הגדול של הפרשה על היכולת לבחור בכל יום מחדש.",
        image: "assets/images/parasha-bereishit.jpeg",
        audio: "assets/audio/parasha-bereishit-sfx4.mp3",
      },
      {
        title: "פרשת נח",
        parasha: "נח",
        description: "המבול שכיסה את העולם, תיבת נח ובעלי החיים שנכנסו זוג-זוג, ועד מגדל בבל - ומסר חשוב: גם כשכולם סביבנו הולכים בכיוון מסוים, אנחנו יכולים לבחור בדרך שלנו.",
        image: "assets/images/parasha-noach.jpeg",
        audio: "assets/audio/parasha-noach-sfx4.mp3",
      },
      {
        title: "פרשת לך לך",
        parasha: "לך לך",
        description: "אברהם אבינו עוזב את ביתו ואת כל מה שמכיר, יוצא למסע אל ארץ לא נודעת, ועומד במבחנים קשים - ובסופם זוכה לברית מיוחדת עם השם. מסע של אמונה שמתחיל בשתי מילים: לך לך.",
        image: "assets/images/parasha-lechlecha.jpeg",
        audio: "assets/audio/parasha-lechlecha-sfx4.mp3",
      },
      {
        title: "פרשת וירא",
        parasha: "וירא",
        description: "אברהם אבינו מכניס אורחים בפתח האוהל, מתפלל על סדום, שמח בלידת יצחק ועומד בניסיון העקדה - ומה אנחנו לומדים ממסירות הנפש שלו.",
        image: "assets/images/parasha-vayera.jpeg",
        audio: "assets/audio/parasha-vayera-sfx4.mp3",
      },
      {
        title: "פרשת חיי שרה",
        parasha: "חיי שרה",
        description: "שרה אמנו נפטרת, אברהם אבינו קונה את מערת המכפלה ושולח את אליעזר עבדו לחרן למצוא אישה ליצחק. מה קרה ליד באר המים, ומה אנחנו לומדים מרבקה אמנו, שלא חיכתה שיבקשו ממנה לעזור.",
        image: "assets/images/parasha-chayei-sarah.jpeg",
        audio: "assets/audio/parasha-chayei-sarah-sfx5.mp3",
      },
      {
        title: "פרשת תולדות",
        parasha: "תולדות",
        description: "יעקב ועשו נולדים, ומהר מאוד מתברר כמה הם שונים. נזיד העדשים ומכירת הבכורה, הברכות שיעקב מקבל מיצחק אביו, והבריחה הגדולה לחרן.",
        image: "assets/images/parasha-toldot.jpeg",
        audio: "assets/audio/parasha-toldot-sfx4.mp3",
      },
      {
        title: "פרשת ויצא",
        parasha: "ויצא",
        description: "יעקב בורח מעשו ויוצא לחרן. חלום הסולם, שבע שנים בשביל רחל ותרמית לבן, י\"ב השבטים, הצאן הנקודים והטלואים, והבריחה הביתה עם לבן שרודף אחריו.",
        image: "assets/images/parasha-vayetze.jpeg",
        audio: "assets/audio/parasha-vayetze-sfx4.mp3",
      },
    ],
  },
  {
    id: "parasha-idea",
    name: "רעיון בפרשה",
    icon: "💡",
    color: "#f2c230",
    type: "audio",
    tagline: "רעיון אחד, עמוק ומעשי, שיוצא היישר מתוך פרשת השבוע.",
    episodes: [
      {
        title: "רעיון לפרשת בראשית",
        parasha: "בראשית",
        description: "מה זה אומר שהאדם נברא \"בצלם אלוקים\"? ולמה לכל יהודי, גם הפשוט ביותר, יש כוח עצום להשפיע לטובה על כל העולם - כי כולנו בני מלך.",
        image: "assets/images/parasha-idea-bereishit.jpeg",
        audio: "assets/audio/parasha-idea-bereishit-sfx4.mp3",
        pdf: "assets/pdf/parasha-idea-bereishit.pdf",
        pointsItemKey: "parasha-report-weekly",
      },
      {
        title: "רעיון לפרשת נח",
        parasha: "נח",
        description: "למה גם בעלי החיים נשטפו במבול, הרי אין להם בחירה בין טוב לרע? רעיון עמוק על הכוח העצום שיש לבחירות שלנו להשפיע - לטובה ולרעה - על כל מה שסביבנו.",
        image: "assets/images/parasha-idea-noach.jpeg",
        audio: "assets/audio/parasha-idea-noach-sfx4.mp3",
        pdf: "assets/pdf/parasha-idea-noach.pdf",
        pointsItemKey: "parasha-report-weekly",
      },
      {
        title: "רעיון לפרשת לך לך",
        parasha: "לך לך",
        description: "אברהם אבינו ולוט עומדים שניהם בפני בחירה. אחד בוחר לפי מה שנראה טוב ונוח, והשני בוחר לפי מה שנכון. איזו בחירה אנחנו עושים בעצמנו, כל יום מחדש?",
        image: "assets/images/parasha-idea-lechlecha.jpeg",
        audio: "assets/audio/parasha-idea-lechlecha-sfx4.mp3",
        pdf: "assets/pdf/parasha-idea-lechlecha.pdf",
        pointsItemKey: "parasha-report-weekly",
      },
      {
        title: "רעיון לפרשת וירא",
        parasha: "וירא",
        description: "למה אברהם אבינו מתחיל לבקש על חמישים צדיקים, ולא ישר על עשרה? רעיון על הדרך להגיע רחוק - צעד אחר צעד, עד שגם מה שנראה בלתי אפשרי נעשה אפשרי.",
        image: "assets/images/parasha-idea-vayera.jpeg",
        audio: "assets/audio/parasha-idea-vayera-sfx4.mp3",
        pdf: "assets/pdf/parasha-idea-vayera.pdf",
        pointsItemKey: "parasha-report-weekly",
      },
      {
        title: "רעיון לפרשת חיי שרה",
        parasha: "חיי שרה",
        description: "למה ליצחק אסור לצאת מארץ ישראל, ויעקב בנו כן יורד לחרן? רעיון על התפקיד האישי של כל אחד מאיתנו - ולמה לא כדאי לחיות כמו שאחרים חיים.",
        image: "assets/images/parasha-idea-chayei-sarah.jpeg",
        audio: "assets/audio/parasha-idea-chayei-sarah-sfx5.mp3",
        pdf: "assets/pdf/parasha-idea-chayei-sarah.pdf",
        pointsItemKey: "parasha-report-weekly",
      },
      {
        title: "רעיון לפרשת ויצא",
        parasha: "ויצא",
        description: "למה דווקא יעקב, איש האמת, פוגש כל חייו שקרים ורמאויות? רעיון על הניסיונות שלנו - ולמה דווקא במקום שהכי קשה לנו, שם אנחנו מגלים כמה כוח יש בתוכנו.",
        image: "assets/images/parasha-idea-vayetze.jpeg",
        audio: "assets/audio/parasha-idea-vayetze-sfx4.mp3",
        pdf: "assets/pdf/parasha-idea-vayetze.pdf",
        pointsItemKey: "parasha-report-weekly",
      },
    ],
  },
  {
    id: "enlightenment",
    name: "אור בהשכלה",
    icon: "📚",
    color: "#9b6fd1",
    type: "audio",
    tagline: "ידע כללי ומדע, מוגשים בטוב טעם, כדי להרחיב אופקים בלי לאבד את הזהות.",
    episodes: [
      {
        title: "המצאת הכתב",
        description: "איך שמרו בני האדם על הידע שלהם לפני שהומצא הכתב? מסע מרתק מכתב היתדות של בבל והכתב המצרי הקדום, ועד למקלדת ולמסך של היום.",
        image: "assets/images/invention-of-writing.jpeg",
        audio: "assets/audio/invention-of-writing-sfx4.mp3",
      },
      {
        title: "מסע אל מעמקי האוקינוס",
        description: "צוללת יורדת אל תוך האוקיינוס, האור נעלם וההרפתקה רק מתחילה - הכירו את דג החכאי עם הפנס המסתורי, תולעי-הענק שחיות ליד הרי געש תת-ימיים, ואת המדוזה הענקית עם הזרועות שמגיעות ל-30 מטר.",
        image: "assets/images/ocean-depths-journey.jpeg",
        audio: "assets/audio/ocean-depths-journey-sfx4.mp3",
      },
      {
        title: "איך הטלפון מעביר קולות?",
        description: "מדברים עם חבר בצד השני של העולם, והוא שומע אותנו תוך רגע. המסע המופלא של הקול שלנו: גלי קול, מיקרופון, אותות חשמליים, גלי רדיו ורמקול.",
        image: "assets/images/how-phone-carries-voices.jpeg",
        audio: "assets/audio/how-phone-carries-voices-sfx5.mp3",
      },
      {
        title: "סיפורו של הפלסטיק",
        description: "איך נולד הפלסטיק, למה הוא כבש את העולם, ומה הבעיה הגדולה שהתגלתה אחר כך? מסע מהנפט שבעומק האדמה ועד פח המיחזור, ומה כל אחד מאיתנו יכול לעשות.",
        image: "assets/images/story-of-plastic.jpeg",
        audio: "assets/audio/story-of-plastic-sfx4.mp3",
      },
      {
        title: "מי הזיז את השעון?",
        description: "למה אנחנו מזיזים את השעון פעמיים בשנה? מהנרות של בנג'מין פרנקלין, דרך מלחמת העולם הראשונה ועד שעון הקיץ בישראל - הסיפור של שעה אחת שזזה.",
        image: "assets/images/who-moved-the-clock.jpeg",
        audio: "assets/audio/who-moved-the-clock-sfx5.mp3",
      },
    ],
  },
  {
    id: "spot-diff",
    name: "מצא את ההבדלים",
    icon: "🔍",
    color: "#f26d7d",
    type: "spot-diff",
    tagline: "משחק תמונות - השוו בין שתי התמונות ומצאו את כל ההבדלים ביניהן.",
    episodes: [
      {
        title: "גן העדן",
        parasha: "בראשית",
        description: "ציור של פרשת בראשית: גן העדן עם עץ התפוחים, הנהר והדגים, החיות, השמש, הירח והכוכבים. השוו בין שתי התמונות ומצאו את 10 ההבדלים. לחצו על \"הצג פתרון\" כדי לראות איפה הם מסתתרים.",
        imageA: "assets/images/spot-diff-bereishit-color-a.jpg",
        imageB: "assets/images/spot-diff-bereishit-color-b.jpg",
        coloringPage: "assets/images/coloring/bereishit.jpg",
        diffCount: 10,
        spots: [
          { x: 91.8, y: 24.9 },
          { x: 54.2, y: 86.1 },
          { x: 6.8, y: 32.6 },
          { x: 50.8, y: 12.8 },
          { x: 63.5, y: 63.3 },
          { x: 91.5, y: 65.3 },
          { x: 33.6, y: 8.2 },
          { x: 61.6, y: 54.7 },
          { x: 43.8, y: 78.4 },
          { x: 24.4, y: 23.3 },
        ],
      },
      {
        title: "תיבת נח והקשת",
        parasha: "נח",
        description: "ציור של פרשת נח: החיות יורדות מהתיבה אל היבשה, וקשת בשמיים. השוו בין שתי התמונות ומצאו את 10 ההבדלים. לחצו על \"הצג פתרון\" כדי לראות איפה הם מסתתרים.",
        imageA: "assets/images/spot-diff-noach-color-a.jpg",
        imageB: "assets/images/spot-diff-noach-color-b.jpg",
        coloringPage: "assets/images/coloring/noach.jpg",
        diffCount: 10,
        spots: [
          { x: 14.4, y: 32.1 },
          { x: 57.5, y: 57.3 },
          { x: 18.2, y: 57.1 },
          { x: 61.7, y: 78.7 },
          { x: 71.0, y: 13.6 },
          { x: 74.0, y: 90.3 },
          { x: 39.8, y: 54.6 },
          { x: 67.2, y: 28.8 },
          { x: 15.5, y: 87.6 },
          { x: 37.0, y: 79.0 },
        ],
      },
      {
        title: "שיירת לך לך",
        parasha: "לך לך",
        description: "ציור של פרשת לך לך: שיירת גמלים בדרך לארץ כנען, אוהלים, באר ומזבח, וכוכבים בשמיים. השוו בין שתי התמונות ומצאו את 10 ההבדלים. לחצו על \"הצג פתרון\" כדי לראות איפה הם מסתתרים.",
        imageA: "assets/images/spot-diff-lechlecha-color-a.jpg",
        imageB: "assets/images/spot-diff-lechlecha-color-b.jpg",
        coloringPage: "assets/images/coloring/lechlecha.jpg",
        diffCount: 10,
        spots: [
          { x: 79.1, y: 18.9 },
          { x: 50.8, y: 67.3 },
          { x: 32.6, y: 62.1 },
          { x: 87.1, y: 55.3 },
          { x: 11.1, y: 72.3 },
          { x: 74.6, y: 76.5 },
          { x: 42.0, y: 17.9 },
          { x: 94.5, y: 6.1 },
          { x: 33.6, y: 93.8 },
          { x: 54.6, y: 51.5 },
        ],
      },
      {
        title: "האוהל של אברהם אבינו",
        parasha: "וירא",
        description: "ציור של פרשת וירא: האוהל של אברהם אבינו, הפתוח לכל הצדדים, מתחת לעץ האשל, שולחן ערוך לאורחים, באר, חמור עם עצים והאיל שנאחז בסבך. השוו בין שתי התמונות ומצאו את 10 ההבדלים. לחצו על \"הצג פתרון\" כדי לראות איפה הם מסתתרים.",
        imageA: "assets/images/spot-diff-vayera-color-a.jpg",
        imageB: "assets/images/spot-diff-vayera-color-b.jpg",
        coloringPage: "assets/images/coloring/vayera.jpg",
        diffCount: 10,
        spots: [
          { x: 4.7, y: 83.0 },
          { x: 83.3, y: 79.1 },
          { x: 93.1, y: 20.4 },
          { x: 62.6, y: 54.7 },
          { x: 79.2, y: 42.2 },
          { x: 91.5, y: 10.6 },
          { x: 68.3, y: 31.0 },
          { x: 55.5, y: 85.5 },
          { x: 75.4, y: 78.6 },
          { x: 66.1, y: 8.5 },
        ],
      },
      {
        title: "הבאר שליד העיר",
        parasha: "חיי שרה",
        description: "ציור של פרשת חיי שרה: הבאר שליד העיר, גמלים שנחים ושותים מהשוקת, כד מים ותיבה עם צמידים, עצי דקל, ובשדה שעל הגבעה מערה. השוו בין שתי התמונות ומצאו את 10 ההבדלים. לחצו על \"הצג פתרון\" כדי לראות איפה הם מסתתרים.",
        imageA: "assets/images/spot-diff-chayei-sarah-color-a.jpg",
        imageB: "assets/images/spot-diff-chayei-sarah-color-b.jpg",
        coloringPage: "assets/images/coloring/chayei-sarah.jpg",
        diffCount: 10,
        spots: [
          { x: 16.4, y: 52.2 },
          { x: 80.0, y: 30.2 },
          { x: 54.9, y: 53.5 },
          { x: 3.8, y: 29.0 },
          { x: 96.6, y: 60.6 },
          { x: 9.5, y: 22.0 },
          { x: 58.8, y: 74.5 },
          { x: 38.7, y: 15.4 },
          { x: 79.8, y: 10.4 },
          { x: 47.1, y: 88.3 },
        ],
      },
      {
        title: "הבאר של הרועים",
        parasha: "ויצא",
        description: "ציור של פרשת ויצא: הבאר שהאבן הגדולה על פיה, צאן נקודים וטלואים ליד השוקת, מקלות מקולפים, אוהלי הרועים, ועל הגבעה גל אבנים עם מצבה וכד שמן. השוו בין שתי התמונות ומצאו את 10 ההבדלים. לחצו על \"הצג פתרון\" כדי לראות איפה הם מסתתרים.",
        imageA: "assets/images/spot-diff-vayetze-color-a.jpg",
        imageB: "assets/images/spot-diff-vayetze-color-b.jpg",
        coloringPage: "assets/images/coloring/vayetze.jpg",
        diffCount: 10,
        spots: [
          { x: 11.0, y: 64.0 },
          { x: 77.5, y: 72.0 },
          { x: 42.8, y: 45.5 },
          { x: 22.1, y: 6.6 },
          { x: 50.9, y: 36.9 },
          { x: 76.2, y: 26.8 },
          { x: 28.5, y: 12.8 },
          { x: 37.1, y: 78.6 },
          { x: 73.5, y: 13.7 },
          { x: 53.4, y: 79.3 },
        ],
      },
      {
        title: "האוהל והשדה",
        parasha: "תולדות",
        description: "ציור של פרשת תולדות: האוהל של יעקב ונזיד העדשים על האש, השדה של יצחק עם אלומות החיטה, בארות המים, שני גדיי עזים, ועל העץ הקשת והאשפה של עשו הצייד. השוו בין שתי התמונות ומצאו את 10 ההבדלים. לחצו על \"הצג פתרון\" כדי לראות איפה הם מסתתרים.",
        imageA: "assets/images/spot-diff-toldot-color-a.jpg",
        imageB: "assets/images/spot-diff-toldot-color-b.jpg",
        coloringPage: "assets/images/coloring/toldot.jpg",
        diffCount: 10,
        spots: [
          { x: 10.7, y: 6.1 },
          { x: 93.0, y: 32.5 },
          { x: 25.6, y: 61.5 },
          { x: 50.5, y: 70.5 },
          { x: 43.2, y: 28.0 },
          { x: 14.6, y: 38.1 },
          { x: 83.1, y: 26.4 },
          { x: 50.1, y: 45.8 },
          { x: 82.3, y: 80.5 },
          { x: 57.2, y: 6.0 },
        ],
      },
    ],
  },
  {
    id: "healthy-to-know",
    name: "בריא לדעת",
    icon: "🍎",
    color: "#7cb342",
    type: "audio",
    tagline: "כל מה שכדאי לדעת על הגוף, על התזונה ועל הבריאות - בשפה פשוטה וברורה, כדי לגדול בריאים וחזקים.",
    episodes: [
      {
        title: "חשיבות ארוחת הבוקר",
        description: "למה כדאי לא לדלג על ארוחת הבוקר? איך היא נותנת לגוף ולמוח דלק לכל היום, מה כוללת ארוחת בוקר מאוזנת, ואתגר קטן לשבוע הקרוב.",
        image: "assets/images/healthy-breakfast.jpeg",
        audio: "assets/audio/healthy-breakfast-sfx4.mp3",
      },
      {
        title: "יתרונות הקריאה",
        description: "קריאה מחזקת את המוח, מפתחת דמיון, מרגיעה ואפילו עוזרת להירדם. למה כדאי לקחת ספר בכל יום, ומה אפשר לגלות בין הדפים.",
        image: "assets/images/benefits-of-reading.jpeg",
        audio: "assets/audio/benefits-of-reading-sfx4.mp3",
      },
      {
        title: "בריאות השיניים - למה זה כל כך חשוב?",
        description: "למה חשוב כל כך לצחצח שיניים? מה עושים החיידקים שבפה, איך השיניים משפיעות על הבריאות של כל הגוף, ואילו הרגלים קטנים שומרים על חיוך בריא לאורך שנים.",
        image: "assets/images/teeth-health.jpeg",
        audio: "assets/audio/teeth-health-sfx4.mp3",
      },
      {
        title: "איך חברים עוזרים לנו להיות בריאים?",
        description: "האם ידעתם שחברים טובים עוזרים לנו להיות בריאים, בנפש ובגוף? למה חבר טוב משנה יום לא מוצלח, איך חברות מעודדת אותנו לזוז ולשחק בחוץ, ומה עושים כשרוצים להכיר חברים חדשים.",
        image: "assets/images/friends-keep-us-healthy.jpeg",
        audio: "assets/audio/friends-keep-us-healthy-sfx4.mp3",
      },
    ],
  },
  {
    id: "jokes",
    name: "מלתא דבדיחותא",
    icon: "😂",
    color: "#ffa000",
    type: "audio",
    tagline: "בדיחה טובה לכל המשפחה, עם חיוך גדול בסוף.",
    episodes: [
      {
        title: "הדלת במדבר · השכנה מנופפת · טוב בלישון",
        description: "",
        image: "assets/images/jokes/joke-22.jpg",
        audio: "assets/audio/jokes/joke-22-sfx2.mp3",
        video: "assets/video/jokes/joke-22-sfx2.mp4",
      },
      {
        title: "הרעמים של חנה וברטה · דוד עזר למנחם",
        description: "",
        image: "assets/images/jokes/joke-21.jpg",
        audio: "assets/audio/jokes/joke-21-sfx2.mp3",
        video: "assets/video/jokes/joke-21-sfx2.mp4",
      },
      {
        title: "רק שאלה אחת · הידד לך מרגרינה? · המורה אף פעם לא טועה",
        description: "",
        image: "assets/images/jokes/joke-20.jpg",
        audio: "assets/audio/jokes/joke-20-sfx2.mp3",
        video: "assets/video/jokes/joke-20-sfx2.mp4",
      },
      {
        title: "הרשל'ה והעז · מדבר עם אדם חכם",
        description: "",
        image: "assets/images/jokes/joke-19.jpg",
        audio: "assets/audio/jokes/joke-19-sfx2.mp3",
        video: "assets/video/jokes/joke-19-sfx2.mp4",
      },
      {
        title: "האוזן של ברל · הנחש הקטן",
        description: "",
        image: "assets/images/jokes/joke-18.jpg",
        audio: "assets/audio/jokes/joke-18-sfx2.mp3",
        video: "assets/video/jokes/joke-18-sfx2.mp4",
      },
      {
        title: "משה לא רוצה לקום · קור כלבים",
        description: "",
        image: "assets/images/jokes/joke-17.jpg",
        audio: "assets/audio/jokes/joke-17-sfx2.mp3",
        video: "assets/video/jokes/joke-17-sfx2.mp4",
      },
      {
        title: "בן שמונה, נקודה · דלקת ריאות",
        description: "",
        image: "assets/images/jokes/joke-16.jpg",
        audio: "assets/audio/jokes/joke-16-sfx3.mp3",
        video: "assets/video/jokes/joke-16-sfx3.mp4",
      },
      {
        title: "הפינגווין והשוטר · מה מזג האוויר?",
        description: "",
        image: "assets/images/jokes/joke-15.jpg",
        audio: "assets/audio/jokes/joke-15-sfx3.mp3",
        video: "assets/video/jokes/joke-15-sfx3.mp4",
      },
      {
        title: "שתי כוסות ליד המיטה · הפאזל של הגאונה",
        description: "",
        image: "assets/images/jokes/joke-14.jpg",
        audio: "assets/audio/jokes/joke-14-sfx2.mp3",
        video: "assets/video/jokes/joke-14-sfx2.mp4",
      },
      {
        title: "הפרה הלבנה והפרה השחורה",
        description: "",
        image: "assets/images/jokes/joke-13.jpg",
        audio: "assets/audio/jokes/joke-13-sfx3.mp3",
        video: "assets/video/jokes/joke-13-sfx3.mp4",
      },
      {
        title: "שמעון והזאבים",
        description: "",
        image: "assets/images/jokes/joke-12.jpg",
        audio: "assets/audio/jokes/joke-12-sfx2.mp3",
        video: "assets/video/jokes/joke-12-sfx2.mp4",
      },
      {
        title: "שמונים פלפלים חריפים",
        description: "",
        image: "assets/images/jokes/joke-11.jpg",
        audio: "assets/audio/jokes/joke-11-sfx2.mp3",
        video: "assets/video/jokes/joke-11-sfx2.mp4",
      },
      {
        title: "כרטיסיית ילדים · הנהג שכולם רוצים · זקן וגנב",
        description: "",
        image: "assets/images/jokes/joke-10.jpg",
        audio: "assets/audio/jokes/joke-10.mp3",
        video: "assets/video/jokes/joke-10.mp4",
      },
      {
        title: "האבק בסלון · המחלה של הפרות · נמלות במעלית",
        description: "",
        image: "assets/images/jokes/joke-09.jpg",
        audio: "assets/audio/jokes/joke-09.mp3",
        video: "assets/video/jokes/joke-09.mp4",
      },
      {
        title: "המזגן של הקמצן · השכנים בשתיים בלילה",
        description: "",
        image: "assets/images/jokes/joke-08.jpg",
        audio: "assets/audio/jokes/joke-08.mp3",
        video: "assets/video/jokes/joke-08.mp4",
      },
      {
        title: "שני כיסים · מאז שהייתי גור",
        description: "",
        image: "assets/images/jokes/joke-07.jpg",
        audio: "assets/audio/jokes/joke-07.mp3",
        video: "assets/video/jokes/joke-07.mp4",
      },
      {
        title: "החתול השחור · הזריקה · הנמלה שלקחה ברצינות",
        description: "",
        image: "assets/images/jokes/joke-05.jpg",
        audio: "assets/audio/jokes/joke-05.mp3",
        video: "assets/video/jokes/joke-05.mp4",
      },
      {
        title: "הדיאטה של הרופא · הווייז והחילזון",
        description: "",
        image: "assets/images/jokes/joke-04.jpg",
        audio: "assets/audio/jokes/joke-04.mp3",
        video: "assets/video/jokes/joke-04.mp4",
      },
      {
        title: "הרשלי והמאפייה",
        description: "",
        image: "assets/images/jokes/joke-03.jpg",
        audio: "assets/audio/jokes/joke-03-sfx2.mp3",
        video: "assets/video/jokes/joke-03-sfx2.mp4",
      },
      {
        title: "הפרה שלומדת שפה · האבא הכי נמוך",
        description: "",
        image: "assets/images/jokes/joke-02.jpg",
        audio: "assets/audio/jokes/joke-02.mp3",
        video: "assets/video/jokes/joke-02.mp4",
      },
      {
        title: "אלפי מנשה",
        description: "",
        image: "assets/images/jokes/joke-01.jpg",
        audio: "assets/audio/jokes/joke-01-sfx2.mp3",
        video: "assets/video/jokes/joke-01-sfx2.mp4",
      },
    ],
  },
];

// פרק עם hidden: true לא מוצג באתר (דף הסיפור שלו ב-s/ נשאר, כדי שקישורים שכבר נשלחו ימשיכו לעבוד)
CATEGORIES.forEach((cat) => { cat.episodes = cat.episodes.filter((ep) => !ep.hidden); });

/* ---------------------------------------------------------------
   Utilities
--------------------------------------------------------------- */
function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function safeStorage() {
  try {
    const k = "__zkb_test__";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return localStorage;
  } catch (e) {
    return null;
  }
}
const storage = safeStorage();

function safeSessionStorage() {
  try {
    const k = "__zkb_test__";
    sessionStorage.setItem(k, "1");
    sessionStorage.removeItem(k);
    return sessionStorage;
  } catch (e) {
    return null;
  }
}
const sessionStore = safeSessionStorage();

/* ---------------------------------------------------------------
   Render: category quick-nav grid
--------------------------------------------------------------- */
function renderCatNav() {
  const grid = document.getElementById("cat-nav-grid");
  grid.innerHTML = CATEGORIES.map(
    (cat) => `
    <a class="cat-pill" href="#cat-${cat.id}">
      <span class="cat-pill__icon" aria-hidden="true" style="background:${cat.color}">${cat.icon}</span>
      <span>
        <span class="cat-pill__title">${cat.name}</span>
        <p class="cat-pill__desc">${cat.episodes.length} תכנים</p>
      </span>
    </a>`
  ).join("");
}

/* ---------------------------------------------------------------
   Render: episode / content cards per type
--------------------------------------------------------------- */
function mediaHTML(cat, ep, idx) {
  const badge = ep.sample ? `<span class="content-card__badge">תוכן לדוגמה</span>` : "";
  // ep.images: [main, thumb] - שני איורים לפרק (בהשראת "אי היהלומים"): הראשי מוצג גדול, השני כתמונה קטנה
  // שמחליפה מקום עם הראשי בלחיצה. ep.image (יחיד) ממשיך לעבוד בדיוק כמו קודם - זה רק תוספת אופציונלית.
  const [main, thumb] = ep.images || (ep.image ? [ep.image] : []);
  if (main) {
    const thumbHTML = thumb
      ? `<button class="content-card__thumb" type="button" data-swap aria-label="החלף לתמונה השנייה">
           <img src="${thumb}" alt="${ep.title}" loading="lazy">
         </button>`
      : "";
    return `
      <div class="content-card__media">
        ${badge}
        <img class="content-card__main-img" src="${main}" alt="${ep.title}" loading="lazy" data-full="${main}">
        ${thumbHTML}
      </div>`;
  }
  return `
      <div class="content-card__media">
        ${badge}
        <div class="cover-placeholder" style="background: linear-gradient(150deg, color-mix(in srgb, ${cat.color} 65%, white), ${cat.color})"><span aria-hidden="true">${cat.icon}</span></div>
      </div>`;
}

// "נגן ברצף" (רוני, 2026-10-08 - בדוי קודם ואושר ב"אי היהלומים", מועבר לכאן):
// בדיוק כמו שם, אבל כל שרשרת מוגבלת למדור שבו היא התחילה (אברהם: "לא יהיה
// רצף של האזנות בין מדור למדור אלא לאפשר רצף של האזנה באותו המדור") - audioIdx/
// audioTotal הם המיקום/הכמות של הפרק בתוך *פרקי האודיו של המדור הזה בלבד*
// (לא כל פרקי המדור - חלקם עשויים להיות "תעלה בקרוב" בלי אודיו כלל).
const CONTINUOUS_CHEVRON_SVG = `<svg class="continuous-dd__chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;

function continuousSelectHTML(ep, audioIdx, audioTotal) {
  const remaining = audioTotal - audioIdx; // פרקי-אודיו מכאן ועד סוף המדור, כולל זה
  if (remaining <= 1) return ""; // הפרק האחרון במדור - אין לאן להמשיך
  const fixedOptions = [2, 3, 5].filter((n) => n < remaining);
  const choices = [{ value: "1", label: "פרק זה בלבד" }]
    .concat(fixedOptions.map((n) => ({ value: String(n), label: `${n} פרקים` })))
    .concat([{ value: "all", label: `כל ${remaining} הפרקים מכאן` }]);
  const items = choices
    .map(
      (c, i) =>
        `<li class="continuous-dd__option${i === 0 ? " is-selected" : ""}" role="option" data-value="${c.value}" aria-selected="${i === 0}" tabindex="-1">${c.label}</li>`
    )
    .join("");
  return `
      <div class="player-continuous">
        <span class="player-continuous__text">נגן ברצף:</span>
        <div class="continuous-dd" data-value="1">
          <button type="button" class="continuous-dd__btn" aria-haspopup="listbox" aria-expanded="false">
            <span class="continuous-dd__value">פרק זה בלבד</span>
            ${CONTINUOUS_CHEVRON_SVG}
          </button>
          <ul class="continuous-dd__list" role="listbox" aria-label="כמה פרקים לנגן ברצף במדור, מתחילים מ${ep.title}" hidden>${items}</ul>
        </div>
      </div>`;
}

function playerHTML(ep, audioIdx, audioTotal) {
  if (ep.audio) {
    return `
      <div class="player-wrap">
        <div class="player" data-src="${ep.audio}">
          <button class="player__btn" type="button" aria-label="הפעל הקראה">▶</button>
          <div class="player__body">
            <input class="player__seek" type="range" min="0" max="100" value="0" step="0.1" aria-label="התקדמות ההקראה">
            <div class="player__times">
              <span class="player__current">0:00</span>
              <span class="player__duration">--:--</span>
            </div>
          </div>
        </div>
        ${continuousSelectHTML(ep, audioIdx, audioTotal)}
      </div>`;
  }
  return `
      <div class="player player--soon">
        <span class="player__soon-icon" aria-hidden="true">🎙️</span>
        <span class="player__soon-label">ההקלטה תעלה בקרוב</span>
      </div>`;
}

// כרטיס "דבר תורה" להדפסה + דיווח-קריאה לכל ילד (מערכת הנקודות, js/points.js) -
// מוצג רק כשלפרק יש pointsItemKey. תיבת הדיווח עצמה נבנית ע"י points.js (לא כאן -
// app.js לא מודע ל-Supabase), רק ה-div הריק עם data-report-item-key מוזרק כאן.
function pdfReportHTML(ep) {
  if (!ep.pointsItemKey) return "";
  const dl = ep.pdf
    ? `<a class="btn btn--outline content-card__pdf-btn" href="${ep.pdf}" target="_blank" download>📄 הורידו את דף "דבר תורה" להדפסה</a>`
    : `<span class="player player--soon"><span class="player__soon-icon" aria-hidden="true">🖨️</span><span class="player__soon-label">דף ה-PDF יעלה בקרוב</span></span>`;
  return `
    <div class="content-card__pdf">
      ${dl}
      <div class="content-card__report" data-report-item-key="${ep.pointsItemKey}"></div>
    </div>`;
}

function audioCardHTML(cat, ep, idx, audioIdx, audioTotal) {
  const reverseClass = idx % 2 === 1 ? " content-card--reverse" : "";
  return `
  <article class="content-card${reverseClass}">
    ${mediaHTML(cat, ep, idx)}
    <div class="content-card__body">
      <span class="content-card__eyebrow">${ep.eyebrow || cat.name}</span>
      <h3 class="content-card__title">${ep.title}</h3>
      ${ep.description ? `<p class="content-card__desc"><strong>על הפרק: </strong>${ep.description}</p>` : ""}
      ${playerHTML(ep, audioIdx, audioTotal)}
      ${ep.quiz ? `<div class="content-card__quiz"><button class="btn btn--primary content-card__quiz-btn" type="button" data-quiz-slug="${storySlug(ep.audio)}">📖 בדוק את עצמך</button></div>` : ""}
      ${shareButtonHTML(cat, ep)}
      ${pdfReportHTML(ep)}
    </div>
  </article>`;
}

function spotDiffCardHTML(cat, ep, idx) {
  const badge = ep.sample ? `<span class="content-card__badge--inline">תוכן לדוגמה</span>` : "";
  const markers = (ep.spots || [])
    .map((p) => `<span class="spot-card__marker" style="left:${p.x}%; top:${p.y}%"></span>`)
    .join("");
  return `
  <article class="content-card content-card--full spot-card" data-cat-name="${cat.name}">
    <div class="content-card__body">
      <div class="content-card__head-row">
        <span class="content-card__eyebrow">${ep.parasha ? `פרשת ${ep.parasha}` : cat.name}</span>
        ${badge}
      </div>
      <h3 class="content-card__title">${ep.title}</h3>
      <p class="content-card__desc">${ep.description}</p>
      <div class="spot-card__images">
        <div class="spot-card__item">
          <span class="spot-card__label">תמונה א</span>
          <div class="spot-card__frame">
          <img src="${ep.imageA}" alt="תמונה א להשוואה">
          ${markers}
          </div>
        </div>
        <div class="spot-card__item">
          <span class="spot-card__label">תמונה ב</span>
          <div class="spot-card__frame">
          <img src="${ep.imageB}" alt="תמונה ב להשוואה">
          ${markers}
          </div>
        </div>
      </div>
      <div class="spot-card__actions">
        <button class="btn btn--primary" type="button" data-spot-toggle>הצג פתרון (${ep.diffCount} הבדלים)</button>
        ${ep.coloringPage ? `<a class="btn btn--outline spot-card__coloring" href="${ep.coloringPage}" download="דף צביעה - ${ep.parasha ? `פרשת ${ep.parasha}` : ep.title}.jpg">🖍️ הורדת דף צביעה</a>` : ""}
      </div>
    </div>
  </article>`;
}

/* ---------------------------------------------------------------
   "שיתוף" on every recording card (Avraham, 2026-10-18): shares this one recording the way the weekly WhatsApp
   message does - the teaser, a listening link to its own page (s/<slug>/) and the group invitation. The text is
   the story page's own (s/index.json -> shareText, written by tools/build_story_pages.mjs from ברלה's files).
   Android: with the episode's picture as a file. iPhone: text only (WhatsApp there drops the text of a shared
   file, and the invitation would be lost). Computer: WhatsApp with the message ready.
--------------------------------------------------------------- */
const STORY_PAGE_BASE = "https://abrahamgersten.github.io/zeh-kara-beemet/s/";

function storySlug(audioPath) {
  const name = audioPath.split("/").pop();
  return name.includes("-sfx") ? name.slice(0, name.lastIndexOf("-sfx")) : name.replace(/\.[^.]+$/, "");
}

function shareButtonHTML(cat, ep) {
  if (!ep.audio) return "";
  const label = cat.id === "tzadikim" ? "שיתוף הסיפור" : cat.serial ? "שיתוף הפרק" : cat.id === "jokes" ? "שיתוף הבדיחה" : "שיתוף ההקלטה";
  // a joke is shared as a video (its picture with its recording, Avraham 2026-11-03): data-share-video
  const video = ep.video ? ` data-share-video="${ep.video}"` : "";
  return `
      <div class="content-card__share">
        <button class="btn btn--outline content-card__share-btn" type="button" data-share-slug="${storySlug(ep.audio)}" data-share-kind="${cat.id === "tzadikim" || cat.serial ? "story" : "recording"}"${video} aria-label="שיתוף בוואטסאפ: ${ep.title}">📤 ${label}</button>
      </div>`;
}

/* The jokes (Avraham, 2026-11-03): the share invitation at the end of a joke only once in 10 jokes played to the end on this
   device (the same count on the joke pages, js/story.js). Without storage (private browsing) the invitation is not shown. */
function zkbJokeInviteDue() {
  try {
    const n = (parseInt(localStorage.getItem("zkb_jokes_finished") || "0", 10) || 0) + 1;
    localStorage.setItem("zkb_jokes_finished", String(n));
    return n % 10 === 0;
  } catch (e) {
    return false;
  }
}

function setupStoryShare() {
  const host = document.getElementById("category-sections");
  if (!host) return;
  let texts = null;
  let statuses = {}; // stories that can also be shared to WhatsApp status (tools/status_shares.json, js/share-sheet.js)
  // Where people share to status from (Avraham, 2026-10-28: the app, the story pages or the bot - bots.html): the app's
  // share sheet is counted like the story pages (log_story_event, js/story.js) under the campaign "app" - "popup" = the
  // invitation after an episode offered the status, "status" = they pressed "share to status". Its status text links
  // with c=app-status, so arrivals from statuses shared in the app are counted apart from the story pages' site-status.
  const STATUS_COUNTER = "https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/log_story_event";
  const STATUS_KEY = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz";
  const STATUS_LANG = document.documentElement.lang === "en" ? "en" : "he";
  const appStatus = (slug) => (statuses[slug] ? { ...statuses[slug], text: statuses[slug].text.replace(/([?&]c=)site-status/g, "$1app-status") } : null);
  function statusVisitor() {
    try {
      let v = localStorage.getItem("zkb_story_visitor"); // the same browser number as the story pages (js/story.js)
      if (!v) {
        v = typeof crypto.randomUUID === "function" ? crypto.randomUUID()
          : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
        localStorage.setItem("zkb_story_visitor", v);
      }
      return v;
    } catch (e) {
      return null;
    }
  }
  function trackStatus(slug, event) {
    // only on the live site, and not Avraham's tests (&t=1, migration 0019)
    if (location.hostname !== "abrahamgersten.github.io" || new URLSearchParams(location.search).get("t") === "1") return;
    try {
      fetch(STATUS_COUNTER, {
        method: "POST",
        keepalive: true,
        headers: { apikey: STATUS_KEY, Authorization: "Bearer " + STATUS_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ p_slug: slug, p_lang: STATUS_LANG, p_event: event, p_visitor: statusVisitor(), p_campaign: "app" }),
      }).catch(() => {});
    } catch (e) {
      // never affects the app
    }
  }
  fetch("s/index.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      const stories = (j && j.stories) || [];
      texts = j ? Object.fromEntries(stories.map((s) => [s.slug, s.shareText])) : null;
      statuses = Object.fromEntries(stories.filter((s) => s.status).map((s) => [s.slug, s.status]));
    })
    .catch(() => {});
  const isApple = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  function pictureFile(card, slug) {
    const img = card && card.querySelector(".content-card__main-img");
    if (!img || isApple || typeof navigator.canShare !== "function" || typeof File !== "function") return Promise.resolve(null);
    const load = fetch(img.currentSrc || img.src)
      .then((r) => (r.ok ? r.blob() : null))
      .then((blob) => {
        if (!blob) return null;
        const type = blob.type || "image/jpeg";
        const file = new File([blob], slug + (type === "image/png" ? ".png" : ".jpg"), { type });
        return navigator.canShare({ files: [file] }) ? file : null;
      })
      .catch(() => null);
    // the picture is already on screen (and cached); if it is slow, share the text without it
    return Promise.race([load, new Promise((res) => setTimeout(() => res(null), 1500))]);
  }

  // "check yourself" (Avraham, 2026-11-04): the question of the episode, from its card or at its end; after a right
  // answer the dialog offers to share the recording, so the end-of-episode share stays one tap away
  const quizzes = {};
  // up to three questions an episode (2026-11-05): quiz is a list; one question alone still works
  CATEGORIES.forEach((c) => c.episodes.forEach((ep) => { if (ep.quiz && ep.audio) quizzes[storySlug(ep.audio)] = [].concat(ep.quiz); }));
  window.zkbOpenQuiz = (card, autoplay) => {
    const btn = card && card.querySelector("[data-quiz-slug]");
    if (!btn || !window.ZkbQuiz) return;
    const titleEl = card.querySelector(".content-card__title");
    const share = card.querySelector("[data-share-slug]");
    window.ZkbQuiz.open({ title: titleEl ? titleEl.textContent : "", quiz: quizzes[btn.dataset.quizSlug], autoplay,
      onShare: share ? () => share.click() : null });
  };
  host.addEventListener("click", (e) => {
    const q = e.target.closest("[data-quiz-slug]");
    if (q) window.zkbOpenQuiz(q.closest(".content-card"), true);
  });

  // with a status picture: ask first - as a message (below) or to status (js/share-sheet.js)
  host.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-share-slug]");
    if (!btn) return;
    const slug = btn.dataset.shareSlug;
    const card = btn.closest(".content-card");
    if (statuses[slug] && window.ZkbShareSheet) {
      const titleEl = card && card.querySelector(".content-card__title");
      window.ZkbShareSheet.choose({ title: titleEl ? titleEl.textContent : "", slug, status: appStatus(slug), track: (ev) => trackStatus(slug, ev), onMessage: () => shareAsMessage(card, slug) });
      return;
    }
    shareAsMessage(card, slug);
  });

  // the popup at the end of an episode (called by the player): the same two choices, after EVERY playback - Avraham,
  // 2026-10-21: "I want it to pop up after every listen" (no once-per-load, no skipping what was already shared)
  window.zkbInviteShare = (playerEl) => {
    const card = playerEl && playerEl.closest(".content-card");
    const btn = card && card.querySelector("[data-share-slug]");
    if (!btn || !window.ZkbShareSheet) return;
    if (card.closest("#cat-jokes") && !zkbJokeInviteDue()) return; // a joke: once in 10 jokes
    if (card.querySelector("[data-quiz-slug]") && window.zkbOpenQuiz) { // Avraham, 2026-11-04: the "check yourself" question
      window.zkbOpenQuiz(card, false);
      return;
    }
    const slug = btn.dataset.shareSlug;
    const titleEl = card.querySelector(".content-card__title");
    if (statuses[slug]) trackStatus(slug, "popup");
    window.ZkbShareSheet.invite({ title: titleEl ? titleEl.textContent : "", slug, status: appStatus(slug), track: (ev) => trackStatus(slug, ev),
      isStory: btn.dataset.shareKind !== "recording", onMessage: () => shareAsMessage(card, slug) });
  };

  async function shareAsMessage(card, slug) {
    const title = card && card.querySelector(".content-card__title") ? card.querySelector(".content-card__title").textContent : "";
    const text = (texts && texts[slug]) || `${title} - זה קרה באמת\n${STORY_PAGE_BASE}${slug}/`;
    const videoBtn = card && card.querySelector("[data-share-video]");
    if (videoBtn && window.ZkbShareSheet && window.ZkbShareSheet.shareVideo) {
      // a joke: the video with his text (js/share-sheet.js). A computer cannot attach it: the text and a listening link.
      const img = card.querySelector(".content-card__main-img");
      window.ZkbShareSheet.shareVideo({ title, slug, video: videoBtn.dataset.shareVideo, poster: img ? img.currentSrc || img.src : "", text,
        onFallback: () => window.open("https://wa.me/?text=" + encodeURIComponent(`${text}\n\nלהאזנה לבדיחה: ${STORY_PAGE_BASE}${slug}/`), "_blank", "noopener") });
      return;
    }
    const whatsappUrl = "https://wa.me/?text=" + encodeURIComponent(text);
    if (typeof navigator.share !== "function") {
      window.open(whatsappUrl, "_blank", "noopener");
      return;
    }
    const file = await pictureFile(card, slug);
    for (const data of file ? [{ files: [file], text }, { text }] : [{ text }]) {
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return; // closed the share menu
      }
    }
    location.href = whatsappUrl;
  }
}

/* ---------------------------------------------------------------
   "חדש מאז הביקור האחרון" (Avraham, 2026-10-23): a small tag on a recording this browser has not seen before - for a
   week, or until it is played (js/progress.js, ZkbNew). The first visit tags nothing.
--------------------------------------------------------------- */
function setupNewTags() {
  if (!window.ZkbNew) return;
  const lang = document.documentElement.lang === "en" ? "en" : "he";
  const buttons = Array.from(document.querySelectorAll("[data-share-slug]"));
  const fresh = window.ZkbNew.check(lang, buttons.map((b) => b.dataset.shareSlug));
  buttons.forEach((b) => {
    if (!fresh.has(b.dataset.shareSlug)) return;
    const media = b.closest(".content-card")?.querySelector(".content-card__media");
    if (media && !media.querySelector(".content-card__new")) {
      media.insertAdjacentHTML("beforeend", '<span class="content-card__new">חדש</span>');
    }
  });
}

/* #ep-<slug> (the link of a "new story" notification): open that episode's card and bring it into view */
function setupEpisodeLink() {
  const go = () => {
    const m = /^#ep-([a-z0-9-]+)$/.exec(location.hash);
    if (!m) return;
    const btn = document.querySelector(`[data-share-slug="${m[1]}"]`);
    const card = btn && btn.closest(".content-card");
    if (!card) return;
    openNiche(card.closest(".niche__body"));
    card.hidden = false;
    card.removeAttribute("data-overflow-card");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("content-card--flash");
    setTimeout(() => card.classList.remove("content-card--flash"), 2600);
    // pictures above it that finish loading push it down: put it back in view once they have
    setTimeout(() => {
      const r = card.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) card.scrollIntoView({ block: "center" });
    }, 1600);
  };
  setTimeout(go, 300);
  window.addEventListener("hashchange", go);
}

const INITIAL_VISIBLE_EPISODES = 4;
const PARASHA_CATEGORY_IDS = ["parasha-what", "parasha-idea", "spot-diff"];

function renderCategorySections() {
  const host = document.getElementById("category-sections");
  host.innerHTML = CATEGORIES.map((cat) => {
    // הפרק שנוסף אחרון מוצג ראשון, בלי קשר לסדר בו הוא נוסף למערך הנתונים.
    // a serial story (cat.serial, "סיפורים בהמשכים", Avraham 2026-11-11) is listed from chapter 1 on, as written
    let episodesNewestFirst = cat.serial ? [...cat.episodes] : [...cat.episodes].reverse();
    // מדורי הפרשה: הפרשה של השבת הקרובה בראש, ואחריה הבאות בתור (js/parasha-order.js).
    if (PARASHA_CATEGORY_IDS.includes(cat.id) && typeof orderEpisodesByParasha === "function") {
      episodesNewestFirst = orderEpisodesByParasha(episodesNewestFirst);
    }
    const hasSample = cat.episodes.some((ep) => ep.sample);
    const overflowCount = Math.max(0, episodesNewestFirst.length - INITIAL_VISIBLE_EPISODES);
    // רק פרקים עם אודיו בפועל נספרים לצורך "נגן ברצף" - פרק "תעלה בקרוב" לא בר-המשך.
    const audioEpisodes = episodesNewestFirst.filter((ep) => ep.audio);

    const groups = nicheGroups(cat, episodesNewestFirst);
    if (groups) return nicheSectionHTML(cat, groups);
    const cardsHTML = episodesNewestFirst
      .map((ep, idx) => {
        const hiddenAttr = idx >= INITIAL_VISIBLE_EPISODES ? ' hidden data-overflow-card="true"' : "";
        const audioIdx = ep.audio ? audioEpisodes.indexOf(ep) : -1;
        const card = cat.type === "spot-diff" ? spotDiffCardHTML(cat, ep, idx) : audioCardHTML(cat, ep, idx, audioIdx, audioEpisodes.length);
        return card.replace("<article ", `<article${hiddenAttr} `);
      })
      .join("");

    const noteHTML = hasSample
      ? `<span class="category-section__note">🧩 התכנים שלהלן הם דוגמה למבנה בלבד - הם יוחלפו בהקלטות ובתכנים אמיתיים</span>`
      : "";
    const showMoreHTML = overflowCount > 0
      ? `<button class="btn btn--ghost category-section__more" type="button" data-show-more="cat-${cat.id}">הצג עוד פרקים</button>`
      : "";

    return `
    <section class="category-section" id="cat-${cat.id}">
      <div class="category-section__inner">
        <div class="category-section__head">
          <span class="category-section__icon" aria-hidden="true" style="background:${cat.color}">${cat.icon}</span>
          <h2 class="category-section__title">${cat.name}</h2>
        </div>
        <p class="category-section__tagline">${cat.tagline}</p>
        ${noteHTML}
        <div class="cards-list">${cardsHTML}</div>
        ${showMoreHTML}
      </div>
    </section>`;
  }).join("");
}

/* Halachic niches inside a category (Avraham, 2026-11-04): each niche is a folder of its own (2026-11-05: "a tab or a
   library of its own, and when you tap it the episodes of that topic come in"), with its own "show more"; the episodes
   without a niche follow, open, under "עוד שאלות". "Play in a row" goes in this order and opens a folder it plays from. */
function nicheGroups(cat, episodes) {
  if (!cat.niches || !cat.niches.length) return null;
  const groups = cat.niches
    .map((n) => ({ ...n, episodes: episodes.filter((ep) => ep.niche === n.id) }))
    .filter((g) => g.episodes.length);
  const rest = episodes.filter((ep) => !cat.niches.some((n) => n.id === ep.niche));
  if (rest.length) groups.push({ id: "other", name: "עוד שאלות", icon: "💡", episodes: rest });
  return groups;
}

function nicheSectionHTML(cat, groups) {
  const audioEpisodes = groups.flatMap((g) => g.episodes).filter((ep) => ep.audio);
  const groupsHTML = groups.map((g) => {
    const cards = g.episodes.map((ep, idx) => {
      // the chapters of a serial story are all shown once its folder is open
      const hiddenAttr = !cat.serial && idx >= INITIAL_VISIBLE_EPISODES ? ' hidden data-overflow-card="true"' : "";
      const audioIdx = ep.audio ? audioEpisodes.indexOf(ep) : -1;
      return audioCardHTML(cat, ep, idx, audioIdx, audioEpisodes.length).replace("<article ", `<article${hiddenAttr} `);
    }).join("");
    const more = !cat.serial && g.episodes.length > INITIAL_VISIBLE_EPISODES
      ? `<button class="btn btn--ghost category-section__more" type="button" data-show-more="cat-${cat.id}-${g.id}">הצג עוד פרקים</button>`
      : "";
    if (g.id === "other") {
      return `
        <div class="niche" id="cat-${cat.id}-${g.id}">
          <h3 class="niche__title"><span class="niche__icon" aria-hidden="true">${g.icon}</span>${g.name}</h3>
          <div class="cards-list">${cards}</div>
          ${more}
        </div>`;
    }
    const count = g.episodes.length === 1 ? "פרק אחד" : `${g.episodes.length} פרקים`;
    // the folder as an inviting tile (Avraham, 2026-11-05: "bigger and more inviting, maybe with a picture"); its picture is
    // one image of its own (niche.image: "one picture, made from the WhatsApp profile picture"), not a mosaic of the episodes
    const mosaic = g.image ? `<span class="niche__pic" aria-hidden="true"><img src="${g.image}" alt="" width="512" height="512" loading="lazy"></span>` : "";
    return `
        <div class="niche niche--folder${g.theme ? ` niche--${g.theme}` : ""}" id="cat-${cat.id}-${g.id}">
          <h3 class="niche__heading">
            <button class="niche__folder${g.image ? "" : " niche__folder--plain"}" type="button" aria-expanded="false" aria-controls="niche-body-${cat.id}-${g.id}" data-niche-toggle>
              ${mosaic}
              <span class="niche__text">
                <span class="niche__name"><span class="niche__icon" aria-hidden="true">${g.icon}</span>${g.name}</span>
                ${g.blurb ? `<span class="niche__blurb">${g.blurb}</span>` : ""}
                <span class="niche__count">${count}</span>
                ${cat.serial ? `<span class="niche__trail" aria-hidden="true">${g.episodes.map(() => "<i></i>").join("")}</span>` : ""}
                <span class="niche__cta"><span class="niche__cta-open">לפרקים</span><span class="niche__cta-close">סגירה</span><span class="niche__chevron" aria-hidden="true"></span></span>
              </span>
            </button>
          </h3>
          <div class="niche__body" id="niche-body-${cat.id}-${g.id}" hidden>
            <div class="cards-list">${cards}</div>
            ${more}
          </div>
        </div>`;
  }).join("");
  return `
    <section class="category-section" id="cat-${cat.id}">
      <div class="category-section__inner">
        <div class="category-section__head">
          <span class="category-section__icon" aria-hidden="true" style="background:${cat.color}">${cat.icon}</span>
          <h2 class="category-section__title">${cat.name}</h2>
        </div>
        <p class="category-section__tagline">${cat.tagline}</p>
        ${groupsHTML}
      </div>
    </section>`;
}

// opens (or with toggle, flips) the folder of a niche; used by its button, by "play in a row" and by #ep- links
function openNiche(body, toggle) {
  const btn = body && document.querySelector(`[aria-controls="${body.id}"]`);
  if (!btn) return;
  const open = toggle ? body.hidden : true;
  body.hidden = !open;
  btn.setAttribute("aria-expanded", String(open));
}

function setupShowMore() {
  const host = document.getElementById("category-sections");
  host.addEventListener("click", (e) => {
    const folder = e.target.closest("[data-niche-toggle]");
    if (folder) openNiche(document.getElementById(folder.getAttribute("aria-controls")), true);
  });
  host.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-show-more]");
    if (!btn) return;
    const section = document.getElementById(btn.dataset.showMore);
    section.querySelectorAll('[data-overflow-card="true"]').forEach((card) => {
      card.hidden = false;
    });
    btn.remove();
  });
}

/* ---------------------------------------------------------------
   Image lightbox
--------------------------------------------------------------- */
function setupMediaInteractions() {
  const host = document.getElementById("category-sections");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  host.addEventListener("click", (e) => {
    const swapBtn = e.target.closest("[data-swap]");
    if (swapBtn) {
      const media = swapBtn.closest(".content-card__media");
      const mainImg = media.querySelector(".content-card__main-img");
      const thumbImg = swapBtn.querySelector("img");
      const tmpSrc = mainImg.src;
      mainImg.style.opacity = "0";
      setTimeout(() => {
        mainImg.src = thumbImg.src;
        mainImg.dataset.full = thumbImg.src;
        thumbImg.src = tmpSrc;
        mainImg.style.opacity = "1";
      }, 120);
      return;
    }

    const mainImg = e.target.closest(".content-card__main-img");
    if (mainImg) {
      lightboxImg.src = mainImg.dataset.full || mainImg.src;
      lightboxImg.alt = mainImg.alt;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    }
  });

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

/* ---------------------------------------------------------------
   Spot-the-difference reveal
--------------------------------------------------------------- */
function setupSpotDiff() {
  const host = document.getElementById("category-sections");
  host.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-spot-toggle]");
    if (!btn) return;
    const card = btn.closest(".spot-card");
    const solved = card.classList.toggle("is-solved");
    btn.textContent = solved
      ? "הסתר פתרון"
      : `הצג פתרון (${card.querySelectorAll(".spot-card__item:first-child .spot-card__marker").length} הבדלים)`;
    if (solved) {
      // the eyebrow shows the parasha (2026-10-21); the usage log keeps the category's own name
      const catEl = card.querySelector(".content-card__eyebrow");
      const titleEl = card.querySelector(".content-card__title");
      window.zkbLogEvent && window.zkbLogEvent("spot_diff_solved", card.dataset.catName || (catEl ? catEl.textContent : null), titleEl ? titleEl.textContent : null);
    }
  });
}

/* ---------------------------------------------------------------
   מעקב-שימוש קליל (ראו js/analytics.js) - קליק על צ'יפ קטגוריה בניווט
   המהיר. לא-חוסם, לא נוגע בניווט (href="#cat-..." ממשיך לעבוד רגיל).
--------------------------------------------------------------- */
function setupCatNavTracking() {
  const grid = document.getElementById("cat-nav-grid");
  if (!grid) return;
  grid.addEventListener("click", (e) => {
    const pill = e.target.closest(".cat-pill");
    if (!pill) return;
    const titleEl = pill.querySelector(".cat-pill__title");
    window.zkbLogEvent && window.zkbLogEvent("category_nav_click", titleEl ? titleEl.textContent : null, null);
  });
}

/* ---------------------------------------------------------------
   Audio players
--------------------------------------------------------------- */
// תפריט נפתח מותאם-אישית ל"נגן ברצף" - זהה במלואו לגרסה שאושרה ונבדקה
// ב"אי היהלומים" (כולל שני תיקונים שאברהם ביקש שם): רשימת ה-<select> הפתוחה
// היא chrome של מערכת ההפעלה שאי-אפשר לעצב, אז זה כפתור+רשימה-צפה שנבנו
// מאפס; וכל כרטיס (.content-card) הוא overflow:hidden (כדי לחתוך את התמונה
// לפי הפינות המעוגלות), שהיה חותך גם רשימה שנפתחת קרוב לתחתית הכרטיס - לכן
// כל רשימה עוברת ל-<body> וממוקמת לפי מיקום הכפתור בפועל על המסך (fixed).
function setupContinuousDropdowns() {
  const entries = Array.from(document.querySelectorAll(".continuous-dd")).map((dd) => {
    const btn = dd.querySelector(".continuous-dd__btn");
    const list = dd.querySelector(".continuous-dd__list");
    document.body.appendChild(list);
    return { dd, btn, list, options: Array.from(list.querySelectorAll(".continuous-dd__option")) };
  });
  const isRtl = document.documentElement.dir === "rtl";

  function positionList(entry) {
    const r = entry.btn.getBoundingClientRect();
    entry.list.style.top = `${r.bottom + 6}px`;
    entry.list.style.minWidth = `${r.width}px`;
    if (isRtl) {
      entry.list.style.right = `${window.innerWidth - r.right}px`;
      entry.list.style.left = "auto";
    } else {
      entry.list.style.left = `${r.left}px`;
      entry.list.style.right = "auto";
    }
  }
  function closeDropdown(entry) {
    entry.list.hidden = true;
    entry.btn.setAttribute("aria-expanded", "false");
  }
  function closeAll(except) {
    entries.forEach((entry) => { if (entry !== except) closeDropdown(entry); });
  }
  function openDropdown(entry) {
    closeAll(entry);
    positionList(entry);
    entry.list.hidden = false;
    entry.btn.setAttribute("aria-expanded", "true");
  }
  function selectOption(entry, li) {
    const valueEl = entry.btn.querySelector(".continuous-dd__value");
    entry.options.forEach((o) => {
      o.classList.toggle("is-selected", o === li);
      o.setAttribute("aria-selected", o === li ? "true" : "false");
    });
    entry.dd.dataset.value = li.dataset.value;
    valueEl.textContent = li.textContent;
  }

  entries.forEach((entry) => {
    const { btn, options } = entry;

    btn.addEventListener("click", () => {
      if (entry.list.hidden) {
        openDropdown(entry);
        (options.find((o) => o.classList.contains("is-selected")) || options[0]).focus();
      } else {
        closeDropdown(entry);
      }
    });
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDropdown(entry);
        (options.find((o) => o.classList.contains("is-selected")) || options[0]).focus();
      }
    });

    options.forEach((li, i) => {
      li.addEventListener("click", () => { selectOption(entry, li); closeDropdown(entry); btn.focus(); });
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectOption(entry, li);
          closeDropdown(entry);
          btn.focus();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          (options[i + 1] || options[0]).focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          (options[i - 1] || options[options.length - 1]).focus();
        } else if (e.key === "Escape") {
          e.preventDefault();
          closeDropdown(entry);
          btn.focus();
        } else if (e.key === "Tab") {
          closeDropdown(entry);
        }
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".continuous-dd") && !e.target.closest(".continuous-dd__list")) closeAll();
  });
  window.addEventListener("scroll", () => closeAll(), { passive: true, capture: true });
  window.addEventListener("resize", () => closeAll());
}

function setupPlayers() {
  const players = Array.from(document.querySelectorAll(".player:not(.player--soon)"));
  // "Play in a row" stays inside the section it started in (Avraham, 2026-10-08) - each episode knows its section's
  // list. Since 2026-10-15 (Avraham: "it plays 2 or 3 in a row and then stops, even if I asked for more" - on this
  // site and on "אי היהלומים"):
  // 1. Only the page's own pause button cancels the chain. Before, any pause cancelled it - a WhatsApp notification
  //    sound, a phone call or the lock screen pauses the media for a moment, the episode carries on, and at its end
  //    the chain was already gone (reproduced: one such pause stopped a 4-episode chain after the first).
  // 2. One media element plays every episode (like a podcast app). With a separate element per episode, a phone
  //    with the screen locked may refuse to start the next one without a tap; switching the file on the element
  //    that is already playing is allowed.
  const audio = new Audio();
  audio.preload = "none";
  // the "check yourself" question (js/quiz.js) stops the episode while it is read, and a chain with it
  window.zkbPauseMain = () => {
    continuousPlan = null;
    if (!audio.paused) audio.pause();
  };
  let active = null; // the episode whose file is loaded in the shared element
  let pendingSeek = 0; // where to start an episode that was resumed or scrubbed before its file loaded
  let continuousPlan = null; // { remaining } while a chain is in progress

  const sectionLists = new Map();
  const episodes = players.map((el) => {
    const section = el.closest(".category-section");
    if (!sectionLists.has(section)) sectionLists.set(section, []);
    const list = sectionLists.get(section);
    const ep = {
      el,
      list,
      pos: 0,
      posInList: list.length,
      src: el.dataset.src,
      btn: el.querySelector(".player__btn"),
      seek: el.querySelector(".player__seek"),
      current: el.querySelector(".player__current"),
      duration: el.querySelector(".player__duration"),
      dd: el.closest(".player-wrap")?.querySelector(".continuous-dd"),
      playLabel: el.querySelector(".player__btn").getAttribute("aria-label"),
      seeking: false,
      loggedPlay: false,
      slug: storySlug(el.dataset.src),
      session: null, // this playback, for the drop-off chart (js/progress.js)
      savedAt: -1,
    };
    list.push(ep);
    return ep;
  });

  // "continue where you stopped" (Avraham, 2026-10-23): the bar and the time show the saved place, and play starts there
  const lang = document.documentElement.lang === "en" ? "en" : "he";
  if (window.ZkbResume) {
    episodes.forEach((ep) => {
      const saved = window.ZkbResume.get(lang, ep.slug);
      if (!saved) return;
      ep.pos = saved.t;
      ep.seek.max = saved.d;
      ep.seek.value = saved.t;
      ep.current.textContent = formatTime(saved.t);
      ep.duration.textContent = formatTime(saved.d);
      ep.el.classList.add("player--resume");
      showPlaying(ep, false);
    });
  }
  function savePlace(ep, force) {
    if (!window.ZkbResume || !ep || !(audio.duration > 0)) return;
    if (!force && Math.abs(audio.currentTime - ep.savedAt) < 5) return;
    ep.savedAt = audio.currentTime;
    window.ZkbResume.set(lang, ep.slug, audio.currentTime, audio.duration);
  }
  function closeSession(ep) {
    if (ep && ep.session) {
      ep.session.flush();
      ep.session = null;
    }
  }
  // leaving the page (or locking it away): keep the place, send the last listening point
  const leave = () => {
    if (!active) return;
    savePlace(active, true);
    if (active.session) active.session.flush();
  };
  window.addEventListener("pagehide", leave);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") leave();
  });

  function showPlaying(ep, playing) {
    ep.btn.textContent = playing ? "⏸" : "▶";
    ep.btn.classList.toggle("is-playing", playing);
    ep.btn.setAttribute("aria-label", playing ? "השהה" : ep.pos > 0 ? "המשך הקראה" : ep.playLabel);
  }

  function load(ep) {
    if (active === ep) return;
    if (active) {
      active.pos = audio.currentTime || active.pos;
      showPlaying(active, false);
      savePlace(active, true);
      closeSession(active);
    }
    active = ep;
    pendingSeek = ep.pos;
    audio.src = ep.src;
  }

  function start(ep) {
    load(ep);
    audio.play().catch(() => showPlaying(ep, false));
  }

  function setMediaSession(ep) {
    if (!("mediaSession" in navigator) || typeof MediaMetadata !== "function") return;
    const card = ep.el.closest(".content-card");
    const img = card?.querySelector(".content-card__main-img");
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: card?.querySelector(".content-card__title")?.textContent || document.title,
        artist: card?.querySelector(".content-card__eyebrow")?.textContent || "זה קרה באמת",
        artwork: img ? [{ src: img.currentSrc || img.src }] : [],
      });
    } catch (e) {
      // lock-screen details are a nicety only
    }
  }

  audio.addEventListener("loadedmetadata", () => {
    if (!active) return;
    active.seek.max = audio.duration || 0;
    active.duration.textContent = formatTime(audio.duration);
    if (pendingSeek > 0 && pendingSeek < audio.duration) audio.currentTime = pendingSeek;
    pendingSeek = 0;
  });
  audio.addEventListener("timeupdate", () => {
    if (!active || active.seeking) return;
    active.seek.value = audio.currentTime;
    active.current.textContent = formatTime(audio.currentTime);
    savePlace(active, false);
    if (active.session) active.session.time(audio.currentTime, audio.duration);
  });
  audio.addEventListener("play", () => {
    if (!active) return;
    showPlaying(active, true);
    setMediaSession(active);
    if (!active.session && window.ZkbListen) active.session = window.ZkbListen.session(active.slug, lang, "site");
    if (window.ZkbNew) window.ZkbNew.seen(lang, active.slug);
    openNiche(active.el.closest(".niche__body")); // "play in a row" reached an episode inside a closed folder
    // a joke that is playing: its share video starts downloading now, so "share" opens the menu right away
    const videoBtn = active.el.closest(".content-card")?.querySelector("[data-share-video]");
    if (videoBtn && window.ZkbShareSheet && window.ZkbShareSheet.warmVideo) window.ZkbShareSheet.warmVideo(videoBtn.dataset.shareVideo, videoBtn.dataset.shareSlug);
    const newTag = active.el.closest(".content-card")?.querySelector(".content-card__new");
    if (newTag) newTag.remove();
    // usage tracking (non-blocking, see js/analytics.js) - only on the first play of an episode in a page load
    if (!active.loggedPlay) {
      active.loggedPlay = true;
      const card = active.el.closest(".content-card");
      const catEl = card && card.querySelector(".content-card__eyebrow");
      const titleEl = card && card.querySelector(".content-card__title");
      window.zkbLogEvent && window.zkbLogEvent("audio_play", catEl ? catEl.textContent : null, titleEl ? titleEl.textContent : null);
    }
  });
  audio.addEventListener("pause", () => {
    // no plan change here: this also fires for pauses the user did not make (notifications, calls, lock screen)
    if (active && !audio.ended) {
      active.pos = audio.currentTime;
      showPlaying(active, false);
      savePlace(active, true);
      if (active.session) active.session.flush();
    }
  });
  audio.addEventListener("ended", () => {
    if (!active) return;
    const ep = active;
    ep.pos = 0;
    ep.savedAt = -1;
    ep.el.classList.remove("player--resume");
    if (ep.session) {
      ep.session.end();
      ep.session = null;
    }
    if (window.ZkbResume) window.ZkbResume.clear(lang, ep.slug);
    showPlaying(ep, false);
    ep.seek.value = 0;
    ep.current.textContent = "0:00";
    continueChainFrom(ep);
    // at the end of every episode: "enjoyed it? share it" - as a message or to status (Avraham, 2026-10-21);
    // a continuing chain keeps playing underneath
    if (window.zkbInviteShare) window.zkbInviteShare(ep.el);
  });

  episodes.forEach((ep) => {
    ep.btn.addEventListener("click", () => {
      if (active === ep && !audio.paused) {
        continuousPlan = null; // the user's own pause: the chain stops here
        audio.pause();
        return;
      }
      // the gift link (js/gift.js, Avraham 2026-11-10): one episode, chosen once a day - no chain, and the gift decides
      if (window.ZkbGift && window.ZkbGift.active()) {
        continuousPlan = null;
        const titleEl = ep.el.closest(".content-card")?.querySelector(".content-card__title");
        window.ZkbGift.play({
          slug: ep.slug,
          title: titleEl ? titleEl.textContent : "",
          start: () => start(ep),
          stop: () => { if (active === ep) audio.pause(); },
        });
        return;
      }
      const choice = ep.dd ? ep.dd.dataset.value : "1";
      continuousPlan = choice === "1" ? null : { remaining: choice === "all" ? Infinity : Number(choice) - 1 };
      start(ep);
    });

    ep.seek.addEventListener("input", () => {
      ep.seeking = true;
      ep.current.textContent = formatTime(Number(ep.seek.value));
    });
    ep.seek.addEventListener("change", () => {
      const t = Number(ep.seek.value);
      if (active === ep && audio.readyState > 0) audio.currentTime = t;
      else if (active === ep) pendingSeek = t;
      else ep.pos = t;
      ep.seeking = false;
    });
  });

  function continueChainFrom(ep) {
    if (window.ZkbGift && window.ZkbGift.active()) continuousPlan = null; // the gift is one episode
    if (!continuousPlan || continuousPlan.remaining <= 0) { continuousPlan = null; return; }
    const next = ep.list[ep.posInList + 1];
    if (!next) { continuousPlan = null; return; }
    continuousPlan.remaining -= 1;
    // if the next episode is still under "show more", reveal it - otherwise the audio plays with no card on screen
    const hiddenCard = next.el.closest(".content-card[hidden]");
    if (hiddenCard) { hiddenCard.hidden = false; hiddenCard.removeAttribute("data-overflow-card"); }
    next.pos = 0;
    start(next);
    (next.el.closest(".content-card") || next.el).scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/* ---------------------------------------------------------------
   Hero: כוכבים מנצנצים (כמו ב"אי היהלומים") + ירח שמופיע מדי פעם
--------------------------------------------------------------- */
function setupSparkles() {
  const wrap = document.querySelector(".hero__sparkles");
  if (!wrap) return;
  // הכמות לפי שטח ההירו, לא מספר קבוע: ב"אי היהלומים" יש 16 כוכבים על ~830,000 פיקסלים רבועים
  // (כוכב לכל ~52,000). ההירו כאן נמוך יותר, אז מספר קבוע נראה צפוף יותר - כאן כוכב לכל ~55,000, בין 8 ל-14.
  const box = wrap.getBoundingClientRect();
  const count = Math.max(8, Math.min(14, Math.round((box.width * box.height) / 55000)));
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = Math.random() > 0.5 ? "✦" : "✧";
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.fontSize = `${7 + Math.random() * 12}px`;
    s.style.animationDelay = `${Math.random() * 3.6}s`;
    s.style.animationDuration = `${3 + Math.random() * 2.5}s`;
    wrap.appendChild(s);
  }
}

function setupMoon() {
  const wrap = document.querySelector(".hero__sparkles");
  if (!wrap) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function showMoon() {
    // לא יוצרים ירח בטאב מוסתר (האנימציה לא רצה שם והצומת היה נשאר תלוי)
    if (!document.hidden) {
      const size = 34 + Math.random() * 22;
      const moon = document.createElement("span");
      moon.className = "hero__moon";
      moon.style.width = moon.style.height = `${size}px`;
      // שוליים בלבד (שליש שמאלי/ימני) ורצועה עליונה - כדי שהירח לא יסתיר את הכותרת והטקסט במרכז
      moon.style.left = `${Math.random() < 0.5 ? 4 + Math.random() * 20 : 74 + Math.random() * 18}%`;
      moon.style.top = `${3 + Math.random() * 9}%`;
      // סהר = צל פנימי מוסט על עיגול שקוף; העובי יחסי לגודל כדי שכל הירחים ייראו אותו דבר
      moon.style.boxShadow = `inset -${(size * 0.3).toFixed(1)}px -${(size * 0.07).toFixed(1)}px 0 0 #fff1c2`;
      moon.addEventListener("animationend", () => moon.remove());
      wrap.appendChild(moon);
    }
    setTimeout(showMoon, 22000 + Math.random() * 26000);
  }
  setTimeout(showMoon, 4000 + Math.random() * 4000);
}

/* ---------------------------------------------------------------
   Scroll reveal
--------------------------------------------------------------- */
function setupScrollReveal() {
  const cards = document.querySelectorAll(".content-card");
  if (!("IntersectionObserver" in window)) {
    cards.forEach((c) => c.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );
  cards.forEach((c) => io.observe(c));
}

/* ---------------------------------------------------------------
   Mobile "install the app" banner (PWA)
--------------------------------------------------------------- */
function setupInstallBanner() {
  const banner = document.getElementById("install-banner");
  const actionBtn = document.getElementById("install-banner-action");
  const closeBtn = document.getElementById("install-banner-close");
  const subEl = document.getElementById("install-banner-sub");

  const ua = navigator.userAgent || "";
  const isIOS =
    /iPhone|iPad|iPod/.test(ua) ||
    (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const isMobileUA = isIOS || isAndroid || /Mobi/i.test(ua);

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  // 2026-09-23: היה localStorage (זכירה לצמיתות, גם אם האפליקציה הוסרה
  // מהמכשיר) - לבקשת אברהם הוחלף ל-sessionStorage: סגירה משתיקה רק את
  // הביקור הנוכחי, לא לצמיתות - כך שאם האפליקציה עדיין לא מותקנת, הרצועה
  // תופיע שוב בביקור הבא (ולא רק אם ננקה ידנית את האחסון).
  const dismissKey = "zkb-install-dismissed";
  const alreadyDismissedThisVisit = sessionStore && sessionStore.getItem(dismissKey) === "1";

  if (!isMobileUA || isStandalone || alreadyDismissedThisVisit) return;

  let deferredPrompt = null;

  function showBanner() {
    banner.hidden = false;
  }

  function hideBanner() {
    banner.hidden = true;
  }

  function dismiss() {
    hideBanner();
    if (sessionStore) sessionStore.setItem(dismissKey, "1");
    closeInstructions();
  }

  closeBtn.addEventListener("click", dismiss);

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    subEl.textContent = "גשו לכל התכנים בלחיצה אחת, ישר מהמסך הראשי";
    showBanner();
  });

  window.addEventListener("appinstalled", () => {
    dismiss();
  });

  const instructions = document.createElement("div");
  instructions.className = "install-steps";
  instructions.innerHTML = isIOS
    ? `<button class="install-steps__close" type="button" aria-label="סגירה">✕</button>
       <h3>איך מתקינים באייפון?</h3>
       <ol>
         <li>הקישו על כפתור השיתוף ⬆️ בסרגל הכלים של Safari</li>
         <li>גללו ובחרו "הוסף למסך הבית" (Add to Home Screen)</li>
         <li>הקישו "הוספה" - וזהו, האפליקציה מוכנה!</li>
       </ol>`
    : `<button class="install-steps__close" type="button" aria-label="סגירה">✕</button>
       <h3>איך מתקינים?</h3>
       <ol>
         <li>פתחו את התפריט (שלוש הנקודות) בדפדפן</li>
         <li>בחרו "התקן אפליקציה" או "הוסף למסך הבית"</li>
         <li>אשרו - וזהו, האפליקציה מוכנה!</li>
       </ol>`;
  document.body.appendChild(instructions);

  function openInstructions() {
    instructions.classList.add("is-open");
  }
  function closeInstructions() {
    instructions.classList.remove("is-open");
  }
  instructions.querySelector(".install-steps__close").addEventListener("click", closeInstructions);

  actionBtn.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice.catch(() => null);
      deferredPrompt = null;
      if (choice && choice.outcome === "accepted") dismiss();
    } else {
      openInstructions();
    }
  });

  if (isIOS) {
    subEl.textContent = "הוסיפו למסך הבית וקבלו אפליקציה אמיתית לטלפון";
    showBanner();
  } else {
    setTimeout(() => {
      if (!deferredPrompt && banner.hidden) {
        subEl.textContent = "הוסיפו את האפליקציה למסך הבית שלכם";
        showBanner();
      }
    }, 2500);
  }
}

/* ---------------------------------------------------------------
   Service worker
--------------------------------------------------------------- */
function setupServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
}

/* ---------------------------------------------------------------
   מרווח דביק אמיתי בראש הדף (--banner-h, --header-h) - .install-banner
   ו-.site-header שתיהן position:sticky/top:0; כששתיהן קיימות (הרצועה
   מוצגת) הן היו נערמות זו על זו באותו top:0 ומכסות זו את זו, כי אף אחת לא
   "יודעת" כמה מקום השנייה תופסת. --banner-h (0 כשהרצועה מוסתרת) הוא ה-top
   שה-header מקבל בפועל (ב-css: .site-header{top:var(--banner-h)}) כדי לשבת
   מתחתיה ולא עליה; --header-h הוא סכום שתיהן - המרווח הכולל התפוס למעלה,
   שקישורי-העוגן (נחיתה על מדור, "על הפרויקט", "כל הקטגוריות") מתחשבים בו
   (css: scroll-margin-top: calc(var(--header-h) + 10px)). גם גובה ה-header
   עצמו משתנה (שורה אחת בדסקטופ מול שתיים כשה-nav עובר לשורה נוספת במסכים
   צרים) - ResizeObserver על שני האלמנטים מתעדכן אוטומטית בכל שינוי כזה
   (כולל הופעה/היעלמות של הרצועה - ראו גם ה-MutationObserver על [hidden]
   כגיבוי, ליתר ביטחון בין דפדפנים).
--------------------------------------------------------------- */
function setupHeaderOffsetTracking() {
  const banner = document.getElementById("install-banner");
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => {
    const bannerH = banner && !banner.hidden ? Math.ceil(banner.getBoundingClientRect().height) : 0;
    const headerH = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--banner-h", `${bannerH}px`);
    document.documentElement.style.setProperty("--header-h", `${bannerH + headerH}px`);
  };
  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(update);
    ro.observe(header);
    if (banner) ro.observe(banner);
  }
  if (banner && typeof MutationObserver !== "undefined") {
    new MutationObserver(update).observe(banner, { attributes: true, attributeFilter: ["hidden"] });
  }
  update();
}

/* ---------------------------------------------------------------
   תיקון-נחיתה אחרי טעינת גופנים (נוסף 2026-09-28) - הסיבה האמיתית ל"קליק על
   קטגוריה נוחת קצת מעל היעד" שנשארה גם אחרי תיקוני ה-sticky: הגופנים
   (Suez One/Heebo, נטענים עם display=swap) מוחלפים מגופן-גיבוי לגופן האמיתי
   *אחרי* שהדף כבר נבנה - ומדדתי בפועל שזה משנה את הגובה הכולל של הדף בכ-250
   פיקסל (המון כותרות עם Suez One, כל אחת קצת שונה בגובה מהגיבוי). אם
   המשתמש לוחץ על קטגוריה **לפני** שההחלפה הזאת הושלמה (סביר בביקור ראשון/
   רשת איטית - בביקור חוזר הגופנים כבר בקאש והבעיה לא קיימת בכלל), הדפדפן
   מחשב את מיקום הגלילה לפי הפריסה הקצרה-יותר של גופן-הגיבוי; ברגע שהגופן
   מוחלף בפועל כל מה שמעל היעד "תופח", והיעד זז מטה בלי שהגלילה עוקבת אחריו -
   בדיוק "נוחת על הקטגוריה שמעל". התיקון: ברגע שהגופנים באמת התייצבו
   (document.fonts.ready) - אם עדיין יש #hash בכתובת שמצביע על אלמנט קיים,
   מיישרים אליו מחדש (scrollIntoView מכבד scroll-margin-top כמו ניווט-עוגן
   רגיל). גם ב-window load (אחרי כל התמונות) כרשת-ביטחון נוספת, זולה וכללית.
--------------------------------------------------------------- */
function setupHashCorrection() {
  const resnap = () => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) el.scrollIntoView({ block: "start" });
  };
  // 2026-09-28, סבב שני: תיקון-יישור בודד שתלוי ב-document.fonts.ready לא הספיק
  // בפועל (אושש: אנדרואיד כרום, "רק בלחיצה הראשונה אחרי רענון") - הפונטים
  // יכולים להתייצב *לפני* שהמשתמש בכלל הספיק ללחוץ על קטגוריה, ואז ה-promise
  // החד-פעמי כבר "נשרף" בלי טעם (מצא hash ריק) ואין יותר מי שיתקן את הלחיצה
  // שבאה אחר כך. הפתרון החזק יותר: **כל** לחיצה על קישור-עוגן (או hashchange
  // ישיר) מפעילה כמה תיקונים עוקבים ומדורגים בזמן (לא רק אחד), כך שלא משנה
  // מתי בדיוק הפונט/תמונה/כל דבר אחר שמזיז תוכן מתייצב ביחס ללחיצה - אחד
  // מהתיקונים המדורגים תמיד יתפוס את המצב הסופי.
  let timers = [];
  const scheduleCorrections = () => {
    timers.forEach(clearTimeout);
    timers = [100, 400, 900, 1600].map((ms) => setTimeout(resnap, ms));
  };
  document.addEventListener("click", (e) => {
    if (e.target.closest('a[href^="#"]')) scheduleCorrections();
  });
  window.addEventListener("hashchange", scheduleCorrections);
  if (location.hash) scheduleCorrections(); // קישור ישיר עם #hash כבר בכתובת (לא דרך לחיצה)
}

/* ---------------------------------------------------------------
   Init
--------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderCatNav();
  renderCategorySections();
  setupMediaInteractions();
  setupSpotDiff();
  setupShowMore();
  setupContinuousDropdowns();
  setupPlayers();
  setupNewTags();
  setupEpisodeLink();
  setupStoryShare();
  setupCatNavTracking();
  setupSparkles();
  setupMoon();
  setupScrollReveal();
  setupInstallBanner();
  setupHeaderOffsetTracking();
  setupHashCorrection();
  setupServiceWorker();
});
