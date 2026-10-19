"""Makes the WhatsApp-status picture of each story in tools/status_shares.json (Avraham, 2026-10-19):
assets/images/status/<slug>.jpg, 1080x1920 (9:16, the status format).

The picture is the story's illustration with its title, the hook from status_shares.json and the brand, in the
site's own fonts and colors. It is rendered by Chrome from an HTML template (Hebrew shaping and the site's
Google fonts come out right, unlike PIL). WhatsApp draws its own bar at the top of a status and the caption at
the bottom, so the content stays inside a safe area (about 190 px top, 330 px bottom).

Usage (from the site folder):  python tools/build_status_images.py [slug ...]
The site's service worker keeps images cache-first: replacing a picture that is already live needs a
MEDIA_CACHE bump in sw.js (or a new file name).
"""
import base64, html, json, re, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

SITE = Path(__file__).resolve().parents[1]
CHROME = r"C:\Users\abrah\AppData\Local\ms-playwright\chromium-1237\chrome-win64\chrome.exe"
CONF = json.loads((SITE / "tools" / "status_shares.json").read_text(encoding="utf-8"))


def catalog_he():
    """title and image of every Hebrew episode, by slug (the same slug rule as build_story_pages.mjs)."""
    src = (SITE / "js" / "app.js").read_text(encoding="utf-8")
    out = {}
    for m in re.finditer(r'title: "((?:[^"\\]|\\.)*)",.*?image: "([^"]+)",\s*audio: "assets/audio/([a-z0-9-]+?)(?:-sfx\d+)?\.mp3"', src, re.S):
        out[m.group(3)] = (m.group(1).replace('\\"', '"'), m.group(2))
    return out


def data_uri(path):
    mime = "image/png" if path.suffix == ".png" else "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


TEMPLATE = """<!DOCTYPE html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Suez+One&family=Heebo:wght@500;700;800&display=block" rel="stylesheet">
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
    padding: 190px 76px 330px;
  }
  .brand { display: flex; align-items: center; gap: 18px; font-family: "Suez One", serif; font-size: 46px; color: #0b6b76; }
  .brand img { width: 74px; height: 74px; }
  h1 { font-family: "Suez One", serif; font-weight: 400; font-size: __TITLE_SIZE__px; line-height: 1.12; text-align: center;
       color: #23343a; margin-top: 26px; text-wrap: balance; }
  .art { margin-top: 30px; width: 720px; height: 720px; border-radius: 44px; overflow: hidden; flex: none;
         box-shadow: 0 34px 70px -26px rgba(7, 34, 41, 0.55); border: 8px solid #fffdf6; }
  .art img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hook { margin-top: 34px; font-size: 42px; font-weight: 700; line-height: 1.42; text-align: center; text-wrap: balance; }
  .hook span { display: block; }
  .hook span + span { margin-top: 14px; color: #0a7681; font-weight: 800; }
  .pill { margin-top: 56px; background: #0f8793; color: #fffdf6; font-weight: 800; font-size: 40px;
          padding: 22px 48px; border-radius: 999px; box-shadow: 0 16px 34px -14px rgba(10, 110, 120, 0.7); }
</style></head>
<body>
  <div class="brand"><img src="__MARK__" alt=""><span>זה קרה באמת</span></div>
  <h1>__TITLE__</h1>
  <div class="art"><img src="__ART__" alt=""></div>
  <p class="hook">__HOOK__</p>
  <div class="pill">סיפור אמיתי, להאזנה בחינם</div>
</body></html>"""


def main(only):
    cat = catalog_he()
    out_dir = SITE / "assets" / "images" / "status"
    out_dir.mkdir(parents=True, exist_ok=True)
    mark = data_uri(SITE / "icons" / "brand-mark.png")
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)
        page = browser.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
        for slug, langs in CONF.items():
            if slug.startswith("_") or "he" not in langs or (only and slug not in only):
                continue
            if slug not in cat:
                sys.exit(f"{slug}: not in js/app.js")
            title, image = cat[slug]
            hook = "".join(f"<span>{html.escape(line)}</span>" for line in langs["he"]["hook"].split("\n"))
            doc = (TEMPLATE.replace("__MARK__", mark).replace("__ART__", data_uri(SITE / image))
                   .replace("__TITLE_SIZE__", "88" if len(title) <= 16 else "76")
                   .replace("__TITLE__", html.escape(title)).replace("__HOOK__", hook))
            page.set_content(doc, wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            # nothing may spill out of the safe area (the pill sits on its bottom edge)
            bottom = page.evaluate("document.querySelector('.pill').getBoundingClientRect().bottom")
            overflow = page.evaluate("document.body.scrollHeight")
            if overflow > 1920 or bottom > 1920 - 330 + 1:
                sys.exit(f"{slug}: the content does not fit (pill bottom {bottom}, height {overflow}) - shorten the hook")
            dst = out_dir / f"{slug}.jpg"
            page.screenshot(path=str(dst), type="jpeg", quality=88, full_page=False)
            print(f"wrote {dst.relative_to(SITE)} ({dst.stat().st_size // 1024} KB)")
        browser.close()


if __name__ == "__main__":
    main(set(sys.argv[1:]))
