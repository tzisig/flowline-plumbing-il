// Builds a progress file for the Master Website Build Checklist (websitBuildChecklist/website-build-checklist.html).
// The checklist keys each item by stage id + a djb2 hash of its text, so this script reads the
// stage definitions straight from the checklist HTML and computes the same keys.
//
// Run: npm run checklist  ->  writes websitBuildChecklist/flowline-plumbing-il-checklist.json
// Import it in the checklist page. The project id stays the same, so a new import updates the project.
//
// Status per item: 'done' (verified), 'na' (not relevant to this demo), or left out (open).
// Items are matched by a unique substring of their text; the script fails if a match is missing or ambiguous.

import { readFileSync, writeFileSync } from 'node:fs';

const CHECKLIST = new URL('../../../websitBuildChecklist/website-build-checklist.html', import.meta.url);
const OUT_FILE = new URL('../../../websitBuildChecklist/flowline-plumbing-il-checklist.json', import.meta.url);

const html = readFileSync(CHECKLIST, 'utf8');
const start = html.indexOf('var STAGES = [');
const end = html.indexOf('];', html.indexOf('id: "post30"'));
const STAGES = new Function(`return ${html.slice(start + 'var STAGES = '.length, end + 1)};`)();

const hash = (str) => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h.toString(36);
};

const DONE = 'done';
const NA = 'na';

const statuses = {
  scope: [
    ['היקף העבודה (Scope) הוגדר', DONE],
    ["רשימת עמודים ופיצ'רים ראשונית אושרה", DONE],
    ['תקציב ואבני דרך', NA],
    ['תהליך בקשות שינוי', NA],
    ['איש קשר מקבל החלטות', DONE],
    ['רשימת חומרים נדרשים נמסרה', NA],
    ['תאריך יעד למסירת חומרים', NA],
    ['סוכם עם הלקוח שעיכוב', NA],
    ['זכויות שימוש בתמונות', DONE],
    ['סוכם שחשבונות הדומיין', NA],
  ],
  client: [
    ['שם העסק והתחום הוגדרו', DONE],
    ['קהל יעד הוגדר', DONE],
    ['שירותים/מוצרים מרכזיים הוגדרו', DONE],
    ['מטרת האתר הוגדרה', DONE],
    ['אזורי פעילות הוגדרו', DONE],
    ['שפות האתר הוגדרו', DONE],
    ['דומיין ואתר קיים נבדקו', DONE],
    ['הוגדר אם זה אתר חדש', DONE],
    ['חובות רגולטוריות זוהו', DONE],
    ['Google Business Profile נבדק', DONE],
  ],
  research: [
    ['שירותים/מוצרים מרכזיים מופו', DONE],
    ['שאלות נפוצות והתנגדויות', DONE],
  ],
  arch: [
    ['Homepage מוגדרת', DONE],
    ['עמוד לכל שירות/מוצר משמעותי', DONE],
    ['About ו-Contact הוגדרו', DONE],
    ['Blog/Knowledge Center', NA],
    ['Landing pages מוצדקות', NA],
    ['עמודי פרטיות, תנאי שימוש, נגישות', DONE],
    ['הוחלט על מבנה URL עקבי', DONE],
    ['URL לכל עמוד הוגדר', DONE],
    ['Primary topic ו-Intent לכל עמוד', DONE],
    ['מבנה שפות ו-hreflang', NA],
    ['Internal linking ראשוני תוכנן', DONE],
    ['CTA לכל עמוד מרכזי הוגדר', DONE],
    ['רשימת העמודים הוזנה לטבלת', DONE],
    ['פרטי העסק (שם, טלפון, מייל, כתובת, שעות) מרוכזים', DONE],
  ],
  build: [
    ['העיצוב כולל נגישות מובנית', DONE],
    ['CMS, תבנית ותוספים הותקנו', DONE],
    ['הותקנו רק תוספים הכרחיים', DONE],
    ['שפת הדף (lang)', DONE],
    ['טקסט מעורב עברית/אנגלית', DONE],
    ['פונטים עבריים נבחרו', DONE],
    ['פריסה רספונסיבית נבנתה', DONE],
    ['הקוד מנוהל בגרסאות (Git)', DONE],
  ],
  content: [
    ['המידע החשוב מופיע מוקדם', DONE],
    ['FAQ נוסף רק כשיש ערך', DONE],
    ['כל עמוד שירות/מוצר מציין במפורש', DONE],
    ['לכל התמונות והתכנים יש זכויות שימוש', DONE],
    ['תאריך פרסום/עדכון מוצג', DONE],
    ['עמודי ערים או אזורים', DONE],
  ],
  onpage: [
    ['Title ייחודי', DONE],
    ['Meta description ייחודי', DONE],
    ['H1 ברור', DONE],
    ['H2/H3 בהיררכיה', DONE],
    ['URL נקי', DONE],
    ['Alt מתאים לתמונות', DONE],
    ['Internal links קיימים', DONE],
    ['Anchor text ברור', DONE],
    ['Canonical מוגדר', DONE],
    ['Open Graph ותמונת שיתוף', DONE],
    ['Schema מתאים נבחר', DONE],
    ['Organization/LocalBusiness', DONE],
    ['Schema תואם למידע', DONE],
  ],
  tech: [
    ['robots.txt הוגדר', DONE],
    ['עמוד 404 מותאם קיים ומחזיר קוד 404 אמיתי', DONE],
    ['Cache ו-CDN הוגדרו', DONE],
    ['XML sitemap נוצר', DONE],
    ['אין Broken links', DONE],
    ['אין עמודים לא רצויים לאינדוקס', DONE],
    ['hreflang הוגדר', NA],
    ['תמונות בפורמט WebP/AVIF', DONE],
    ['פונטים: נטענים רק המשקלים', DONE],
    ['CSS/JS נבדקו', DONE],
    ['Lazy loading לתמונות', DONE],
    ['Favicon קיים', DONE],
    ['אין עמודים יתומים', DONE],
    ['סט אייקונים מלא', DONE],
    ['פונטים מתארחים מקומית', DONE],
  ],
  a11y: [
    ['מצב Focus נראה בבירור', DONE],
    ['ניגודיות צבעים לפי WCAG AA', DONE],
    ['תמונות דקורטיביות מוגדרות עם Alt ריק', DONE],
    ['לכל שדה בטופס יש תווית', DONE],
    ['לקישורים ולכפתורים יש טקסט מובן', DONE],
    ['בדיקה אוטומטית (Lighthouse / axe)', DONE],
    ['הנגישות לא נשענת על תוסף', DONE],
  ],
  security: [
    ['CMS, תבנית ותוספים מעודכנים', NA],
    ['תוספים ותבניות שלא בשימוש הוסרו', NA],
    ['אימות דו-שלבי (2FA)', NA],
    ['סיסמאות חזקות וייחודיות', NA],
    ['ניסיונות התחברות מוגבלים', NA],
    ['הגנה מספאם בטפסים', DONE],
    ['כותרות אבטחה הוגדרו', DONE],
  ],
  legal: [
    ['מדיניות הפרטיות תואמת את המידע שהאתר אוסף', DONE],
    ['הטפסים אוספים רק מידע נחוץ', DONE],
    ['הסכמה לדיוור בתיבה נפרדת', NA],
    ['באנר עוגיות ו-Consent Mode', DONE],
    ['מחיר המוצג לצרכן הוא המחיר הכולל', DONE],
  ],
  conversion: [
    ['מטרת האתר ברורה מיד', DONE],
    ['CTA ברור', DONE],
    ['הודעת הצלחה נבדקה', DONE],
    ['פרמטרי UTM ומקור הפנייה', DONE],
    ['כשל בשליחת טופס מוצג למשתמש', DONE],
    ['דף תודה בכתובת נפרדת', DONE],
    ['סקריפטים של מדידה ופרסום נטענים רק אחרי הסכמת', DONE],
  ],
  google: [
    ['Sitemap מוכן לשליחה', DONE],
    ['Google Business Profile מעודכן', NA],
    ['מידע העסק עקבי וברור', DONE],
    ['שירותים/מוצרים מוגדרים מפורשות', DONE],
    ['אין מידע סותר בין עמודים', DONE],
    ['הוחלט אילו סורקי AI לאפשר', DONE],
  ],
};

// ---------------------------------------------------------------------------
// Stage tracking and notes
// ---------------------------------------------------------------------------

const track = {
  scope: 'in-progress', client: 'in-progress', research: 'in-progress', arch: 'in-progress',
  build: 'in-progress', content: 'in-progress', onpage: 'in-progress', tech: 'in-progress',
  a11y: 'in-progress', security: 'in-progress', legal: 'in-progress', conversion: 'in-progress',
  google: 'in-progress', gate: 'not-started', automation: 'not-started', handover: 'not-started',
  post72: 'not-started', post14: 'not-started', post30: 'not-started',
};

const notes = {
  scope: 'אתר דמו לתיק עבודות (site-portfolio/flowline-plumbing), חבילת "אתר מורחב" לחברת אינסטלציה עם מוקד: עמוד לכל שירות ולכל עיר, מפת זמני הגעה, בדיקת מד מים, מחשבון מחירים, עמוד חירום ויומן עבודות. תקציב, חוזה, חומרים ובעלות לקוח סומנו לא רלוונטי.',
  client: 'חברת אינסטלציה עם מוקד 24/7 ושמונה טכנאים, ראשון לציון והשפלה (6 ערים), עברית בלבד. כל הפרטים בדויים (טלפון דמה 050-000-0000, שם החברה והמנהל בדויים). אין Google Business Profile (דמו).',
  research: 'שירותים, תקלות נפוצות ושאלות לקוח מופו לפי התחום, עם תוכן מקומי לכל עיר. מילת מפתח לכל עמוד בשדה keyword בקונפיג. לא בוצע מחקר נפחי חיפוש.',
  arch: '28 עמודים: בית, אודות, מרכז שירותים + 6 שירותים, מרכז אזורים + 6 ערים, חירום, בדיקת מד מים, מחירון, עבודות אחרונות, המלצות, FAQ, צור קשר, תודה, אחריות ותנאי שירות, פרטיות, נגישות, 404. כל הנתונים ב-src/config/site.config.ts.',
  build: 'Astro 7 סטטי, ללא CMS. פונט Noto Sans Hebrew משתנה (רוחב ומשקל) מתארח מקומית. עיצוב: מפת קווים בסגנון רכבת, קו זרימה עם תחנות, אלמוג ודיו על אפור. פיצ\'רים: מפת זמני הגעה חיה לפי שעון ישראל ושעות עומס, סטטוס מוקד חי, בדיקת מד מים עם טיימר ומחשבון עלות, מחשבון מחירים, עמוד חירום. תמונות סטוק מ-Pexels (CREDITS.md).',
  content: 'כל התוכן דמו ומסומן בפס דמו בראש כל עמוד ובתגית קבועה. תוכן ייחודי לכל עיר (אוויר ים בבת ים, מגדלים ומשאבות בראשון מערב, שורשים ברחובות, בדק בית ביבנה). פתוח: הגהה ואישור לקוח.',
  onpage: 'נבדק אוטומטית (npm run audit): title ו-description ייחודיים, H1 אחד, canonical, JSON-LD תקין (Plumber, Service, FAQPage, HowTo, BreadcrumbList, Review, Person).',
  tech: 'Lighthouse נייד: ביצועים 94-99, נגישות 100, Best Practices 100. SEO 69 בגלל noindex מכוון. CLS 0, LCP 1.7-2.6 שניות. 0 קישורים שבורים ו-0 יתומים, ללא גלילה אופקית ב-375 ו-1440 פיקסלים.',
  a11y: 'axe (WCAG 2.1 AA + best practice): 0 הפרות ב-28 עמודים, במחשב ובנייד. Skip link, Focus, reduced-motion, מפה עם קישורים וטבלה טקסטואלית מקבילה, צבעי שירות תמיד עם שם.',
  security: 'אתר סטטי ללא ממשק ניהול. Honeypot בטופס, public/_headers עם HSTS, nosniff ו-X-Frame-Options.',
  legal: 'פרטיות (כולל תיקון 13), נגישות, ואחריות ותנאי שירות. מחירים כוללים מע"מ. פתוח: בדיקה משפטית.',
  conversion: 'חיוג למוקד בולט בכל עמוד ובפס תחתון במובייל, וואטסאפ עם הודעה מוכנה לפי שירות ועיר. טופס במצב דמו: ולידציה, UTM, הודעת כשל ודף תודה.',
  google: 'במצב דמו: noindex בכל העמודים, X-Robots-Tag ו-robots.txt חוסם. במצב חי robots.txt מאפשר GPTBot, PerplexityBot ו-Google-Extended. sitemap-index.xml נוצר אוטומטית.',
};

const pages = [
  ['דף הבית', '/'], ['אודות', '/about/'], ['שירותים (ריכוז)', '/services/'],
  ['פיצוץ צנרת וחירום', '/services/emergency-repairs/'], ['פתיחת סתימות', '/services/drain-cleaning/'],
  ['איתור נזילות', '/services/leak-detection/'], ['דודים', '/services/water-heaters/'],
  ['החלפת צנרת', '/services/repiping/'], ['משאבות וניקוז', '/services/pumps-drainage/'],
  ['אזורים (ריכוז)', '/areas/'], ['ראשון לציון', '/areas/rishon-lezion/'], ['חולון', '/areas/holon/'],
  ['בת ים', '/areas/bat-yam/'], ['נס ציונה', '/areas/ness-ziona/'], ['רחובות', '/areas/rehovot/'], ['יבנה', '/areas/yavne/'],
  ['חירום', '/emergency/'], ['בדיקת מד מים', '/leak-test/'], ['מחירון', '/prices/'], ['עבודות אחרונות', '/jobs/'],
  ['המלצות', '/reviews/'], ['שאלות נפוצות', '/faq/'], ['צור קשר', '/contact/'], ['דף תודה', '/thank-you/'],
  ['אחריות ותנאי שירות', '/warranty/'], ['מדיניות פרטיות', '/privacy/'], ['הצהרת נגישות', '/accessibility/'], ['עמוד 404', '/404'],
].map(([name, url]) => ({ name, url, content: true, design: true, seo: true, approval: false }));

// ---------------------------------------------------------------------------
// Build the file
// ---------------------------------------------------------------------------

const items = {};
const errors = [];
for (const [stageId, list] of Object.entries(statuses)) {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) { errors.push(`unknown stage ${stageId}`); continue; }
  const texts = stage.items.map((it) => (typeof it === 'string' ? it : it.t));
  for (const [needle, status] of list) {
    const hits = texts.filter((t) => t.includes(needle));
    if (hits.length !== 1) { errors.push(`${stageId}: "${needle}" matched ${hits.length} items`); continue; }
    items[`${stageId}.${hash(hits[0])}`] = status;
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const data = {
  client: 'דמו לתיק עבודות: פלואוליין, חברת אינסטלציה (ראשון לציון והשפלה)',
  siteName: 'פלואוליין - מוקד אינסטלציה',
  domain: 'flowline-plumbing-il.pages.dev (דמו, ללא דומיין פרטי)',
  owner: 'ציון',
  profile: 'corporate',
  projectKind: 'new',
  env: 'https://flowline-plumbing-il.pages.dev (Cloudflare Pages, noindex במצב דמו)',
  platform: 'Astro 7, אתר סטטי, ללא CMS. כל הנתונים המשתנים ב-src/config/site.config.ts',
  languages: 'עברית (RTL)',
  projectStatus: 'in-progress',
  docVersion: '3.0',
  startDate: '2026-09-29',
  updatedDate: today,
  // Demo project: dates are illustrative
  dueDate: '2026-10-13',
  materialsDate: '',
};
for (const [stage, status] of Object.entries(track)) data[`track.${stage}.status`] = status;
for (const [stage, note] of Object.entries(notes)) data[`stageNotes.${stage}`] = note;

const out = {
  format: 'websiteBuildChecklist',
  version: 3,
  projects: [{
    id: 'p-flowline-plumbing-il',
    name: data.siteName,
    state: { version: 3, savedAt: new Date().toISOString(), data, items, waiting: {}, pages },
  }],
};
writeFileSync(OUT_FILE, JSON.stringify(out, null, 2));

const counts = Object.values(items).reduce((a, s) => ((a[s] = (a[s] || 0) + 1), a), {});
console.log(`checklist written: ${counts.done || 0} done, ${counts.na || 0} n/a, ${pages.length} pages`);
