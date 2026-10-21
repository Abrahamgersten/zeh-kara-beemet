"""Makes the WhatsApp-status picture of each story in tools/status_shares.json (Avraham, 2026-10-19), 1080x1920
(9:16, the status format):  Hebrew -> assets/images/status/<slug>.jpg,  English -> assets/images/status/en/<slug>.jpg

The picture is the story's illustration with its title, the hook from status_shares.json and the brand, in the
site's own fonts and colors. It is rendered by Chrome from an HTML template (Hebrew shaping and the site's
Google fonts come out right, unlike PIL). WhatsApp draws its own bar at the top of a status and the caption at
the bottom, so the content stays inside a safe area (about 190 px top, 330 px bottom); a long hook makes the
illustration a little smaller, and if it still does not fit the script stops and says so.
Avraham, 2026-10-19: nothing on the picture or in the caption says the listening is free.

Usage (from the site folder):  python tools/build_status_images.py [slug ...]
Then: node tools/build_story_pages.mjs (the pages link each picture with ?v=<its hash>, so a replaced picture
is fetched again in spite of the service worker's cache-first media cache).
"""
import base64, html, json, re, subprocess, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

SITE = Path(__file__).resolve().parents[1]
CHROME = r"C:\Users\abrah\AppData\Local\ms-playwright\chromium-1237\chrome-win64\chrome.exe"
CONF = json.loads((SITE / "tools" / "status_shares.json").read_text(encoding="utf-8"))
SAFE_TOP, SAFE_BOTTOM = 190, 330

LANGS = {
    "he": dict(app="js/app.js", root=SITE, out=SITE / "assets" / "images" / "status", dir="rtl",
               fonts="family=Suez+One&family=Heebo:wght@500;700;800", display='"Suez One", serif',
               brand="זה קרה באמת", pill="סיפור אמיתי לכל המשפחה", title_px=lambda t: 88 if len(t) <= 16 else 76),
    "en": dict(app="en/js/app.js", root=SITE / "en", out=SITE / "assets" / "images" / "status" / "en", dir="ltr",
               fonts="family=Fredoka:wght@600&family=Heebo:wght@500;700;800", display='"Fredoka", sans-serif',
               brand="It Really Happened", pill="A true story for the whole family", title_px=lambda t: 84 if len(t) <= 22 else 72),
}


CATALOG_JS = """
const fs = require("fs"), vm = require("vm");
const src = fs.readFileSync(process.argv[1], "utf8");
const a = src.indexOf("const CATEGORIES = ["), b = src.indexOf("\\n];", a);
const cats = vm.runInNewContext("(" + src.slice(a + "const CATEGORIES = ".length, b + 2) + ")", {});
const out = {};
for (const c of cats) for (const e of c.episodes || []) {
  if (!e.audio || e.sample) continue;
  const n = e.audio.split("/").pop();
  const slug = n.includes("-sfx") ? n.slice(0, n.lastIndexOf("-sfx")) : n.replace(/[.][^.]+$/, "");
  out[slug] = [e.title, (e.images || [e.image])[0]];
}
process.stdout.write(JSON.stringify(out));
"""


def catalog(lang):
    """title and (first) image, as a path on disk, of every episode of the language, by slug - read by node from the site's
    own CATEGORIES (the same rule as build_story_pages.mjs; an episode may have `images: [...]` instead of `image`)."""
    L = LANGS[lang]
    raw = subprocess.run(["node", "-e", CATALOG_JS, str(SITE / L["app"])], capture_output=True, text=True, encoding="utf-8", check=True).stdout
    return {slug: (title, (L["root"] / image).resolve()) for slug, (title, image) in json.loads(raw).items()}


def data_uri(path):
    mime = "image/png" if path.suffix == ".png" else "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


TEMPLATE = """<!DOCTYPE html>
<html lang="__LANG__" dir="__DIR__"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?__FONTS__&display=block" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1080px; height: 1920px; }
  body {
    font-family: "Heebo", sans-serif;
    color: #23343a;
    background:
      radial-gradient(1100px 700px at 50% 34%, rgba(255, 210, 143, 0.55), transparent 70%),
      linear-gradient(180deg, #fffdf6 0%, #fff5e2 45%, #ffe7bc 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: __TOP__px 76px __BOTTOM__px;
  }
  .brand { display: flex; align-items: center; gap: 18px; font-family: __DISPLAY__; font-size: 46px; color: #0b6b76; }
  .brand img { width: 74px; height: 74px; }
  h1 { font-family: __DISPLAY__; font-weight: 400; font-size: __TITLE_SIZE__px; line-height: 1.12; text-align: center;
       color: #23343a; margin-top: 26px; text-wrap: balance; }
  html[lang="en"] h1 { font-weight: 600; }
  .art { margin-top: 30px; width: __ART__px; height: __ART__px; border-radius: 44px; overflow: hidden; flex: none;
         box-shadow: 0 34px 70px -26px rgba(7, 34, 41, 0.55); border: 8px solid #fffdf6; }
  .art img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hook { margin-top: 34px; font-size: 42px; font-weight: 700; line-height: 1.42; text-align: center; text-wrap: balance; }
  .hook span { display: block; }
  .hook span + span { margin-top: 14px; color: #0a7681; font-weight: 800; }
  .pill { margin-top: 56px; background: #0f8793; color: #fffdf6; font-weight: 800; font-size: 40px;
          padding: 22px 48px; border-radius: 999px; box-shadow: 0 16px 34px -14px rgba(10, 110, 120, 0.7); }
</style></head>
<body>
  <div class="brand"><img src="__MARK__" alt=""><span>__BRAND__</span></div>
  <h1>__TITLE__</h1>
  <div class="art"><img src="__IMG__" alt=""></div>
  <p class="hook">__HOOK__</p>
  <div class="pill">__PILL__</div>
</body></html>"""


def main(only):
    mark = data_uri(SITE / "icons" / "brand-mark.png")
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)
        page = browser.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
        for lang, L in LANGS.items():
            cat = catalog(lang)
            L["out"].mkdir(parents=True, exist_ok=True)
            for slug, langs in CONF.items():
                if slug.startswith("_") or lang not in langs or (only and slug not in only):
                    continue
                if slug not in cat:
                    sys.exit(f"[{lang}] {slug}: not in {L['app']}")
                title, image = cat[slug]
                hook = "".join(f"<span>{html.escape(line)}</span>" for line in langs[lang]["hook"].split("\n"))
                for art in (720, 680, 640, 600):
                    doc = (TEMPLATE.replace("__LANG__", lang).replace("__DIR__", L["dir"]).replace("__FONTS__", L["fonts"])
                           .replace("__DISPLAY__", L["display"]).replace("__TOP__", str(SAFE_TOP)).replace("__BOTTOM__", str(SAFE_BOTTOM))
                           .replace("__MARK__", mark).replace("__BRAND__", html.escape(L["brand"]))
                           .replace("__TITLE_SIZE__", str(L["title_px"](title))).replace("__TITLE__", html.escape(title))
                           .replace("__ART__", str(art)).replace("__IMG__", data_uri(image))
                           .replace("__HOOK__", hook).replace("__PILL__", html.escape(langs[lang].get("pill", L["pill"]))))
                    page.set_content(doc, wait_until="networkidle")
                    page.evaluate("document.fonts.ready")
                    top = page.evaluate("document.querySelector('.brand').getBoundingClientRect().top")
                    bottom = page.evaluate("document.querySelector('.pill').getBoundingClientRect().bottom")
                    if top >= SAFE_TOP - 1 and bottom <= 1920 - SAFE_BOTTOM + 1:
                        break
                else:
                    sys.exit(f"[{lang}] {slug}: the content does not fit the safe area (top {top:.0f}, bottom {bottom:.0f}) - shorten the hook")
                dst = L["out"] / f"{slug}.jpg"
                page.screenshot(path=str(dst), type="jpeg", quality=86, full_page=False)
                print(f"[{lang}] wrote {dst.relative_to(SITE)} ({dst.stat().st_size // 1024} KB, art {art})")
        browser.close()


if __name__ == "__main__":
    main(set(sys.argv[1:]))
