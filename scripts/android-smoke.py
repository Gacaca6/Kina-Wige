#!/usr/bin/env python3
"""Kina Wige — Android smoke test.

Runs inside the CI emulator (.github/workflows/android.yml) against the DEBUG
APK and fails the build if a parent or child would meet any of these:

  * a blank screen, the "update your WebView" message, or an unstyled page
  * setup that cannot be completed, or a back button that leaves it
  * headers sitting under the status bar
  * back on the child's home killing the app instead of backgrounding it
  * setup forgotten after the app is closed
  * the hidden grown-up door (hold the greeting 3 s) not reaching the gate
  * a video that does not actually play
  * a crash, or an uncaught JavaScript error

HOW IT DRIVES THE APP. Android's own screen reader (uiautomator) proved
unreliable on Android 12's WebView. So the page is driven through the
WebView's DevTools channel — available in debug builds only, never in the
Play release: real mouse input at the element's real position, the page's
real text, real computed styles, and the <video> element's own clock.
Everything that belongs to Android stays at the Android level: the hardware
back button, backgrounding, force-stop and relaunch, and screenshots.

Usage: android-smoke.py <app-debug.apk> <output-dir>
Needs: adb on PATH, `pip install websocket-client`.
"""

import json
import os
import re
import subprocess
import sys
import time
import urllib.request

import websocket  # websocket-client

PKG = "rw.kinawige.app"
ACTIVITY = f"{PKG}/.MainActivity"
PORT = 9222
APK = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else "smoke"
os.makedirs(OUT, exist_ok=True)

results: list[tuple[str, bool, str]] = []
shot_no = 0


# ── Android level ────────────────────────────────────────────────────────────

def adb(*args: str, check: bool = True, timeout: int = 120) -> str:
    r = subprocess.run(["adb", *args], capture_output=True, text=True, timeout=timeout)
    if check and r.returncode != 0:
        raise RuntimeError(f"adb {' '.join(args)} failed: {r.stderr.strip()}")
    return r.stdout


def shot(name: str) -> None:
    global shot_no
    shot_no += 1
    png = subprocess.run(["adb", "exec-out", "screencap", "-p"], capture_output=True, timeout=60).stdout
    with open(os.path.join(OUT, f"{shot_no:02d}-{name}.png"), "wb") as f:
        f.write(png)


def pid() -> str:
    return adb("shell", "pidof", PKG, check=False).strip()


def in_front() -> bool:
    acts = adb("shell", "dumpsys", "activity", "activities", check=False)
    return any(PKG in l for l in acts.splitlines() if "ResumedActivity" in l)


def launch() -> None:
    adb("shell", "am", "start", "-W", "-n", ACTIVITY)
    time.sleep(2)


def back() -> None:
    adb("shell", "input", "keyevent", "KEYCODE_BACK")
    time.sleep(1.8)


# ── Page level, over the WebView's DevTools channel ──────────────────────────

class Page:
    def __init__(self) -> None:
        self.ws = None
        self.pid = ""
        self.msg_id = 0

    def attach(self, timeout: float = 60) -> None:
        end = time.time() + timeout
        last = ""
        while time.time() < end:
            p = pid()
            if p:
                adb("forward", "--remove-all", check=False)
                adb("forward", f"tcp:{PORT}", f"localabstract:webview_devtools_remote_{p}", check=False)
                try:
                    with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/list", timeout=5) as r:
                        targets = json.load(r)
                    pages = [t for t in targets if t.get("type") == "page" and "localhost" in t.get("url", "")]
                    if pages:
                        self.ws = websocket.create_connection(
                            pages[0]["webSocketDebuggerUrl"], timeout=30, suppress_origin=True)
                        self.pid = p
                        return
                    last = f"no page target yet ({[t.get('url') for t in targets]})"
                except Exception as e:  # noqa: BLE001
                    last = str(e)
            time.sleep(1.5)
        raise RuntimeError(f"could not attach to the app's WebView: {last}")

    def _send(self, method: str, **params):
        if self.ws is None or pid() != self.pid:
            self.attach()
        self.msg_id += 1
        mid = self.msg_id
        self.ws.send(json.dumps({"id": mid, "method": method, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == mid:
                if "error" in msg:
                    raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})

    def send(self, method: str, **params):
        try:
            return self._send(method, **params)
        except (websocket.WebSocketException, ConnectionError, OSError):
            self.ws = None  # the process restarted; attach again once
            return self._send(method, **params)

    def js(self, expr: str):
        r = self.send("Runtime.evaluate", expression=expr, returnByValue=True, awaitPromise=True)
        if r.get("exceptionDetails"):
            raise RuntimeError(f"page script failed: {r['exceptionDetails'].get('text')}")
        return r.get("result", {}).get("value")

    # The smallest visible element whose text or aria-label matches, scrolled
    # into view, with its centre in CSS pixels.
    FIND = """((text, exact) => {
      const want = text.toLowerCase();
      let best = null;
      for (const el of document.querySelectorAll('button,[role=button],a,h1,h2,h3,p,span,div,li')) {
        const t = (el.innerText || '').trim().toLowerCase();
        const l = (el.getAttribute('aria-label') || '').toLowerCase();
        const hit = exact ? (t === want || l === want) : (t.includes(want) || l.includes(want));
        if (!hit) continue;
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        if (r.width < 1 || r.height < 1 || s.visibility === 'hidden' || s.display === 'none') continue;
        if (!best || r.width * r.height < best.a) best = { el, a: r.width * r.height };
      }
      if (!best) return null;
      best.el.scrollIntoView({ block: 'center' });
      const r = best.el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
    })"""

    def find(self, text: str, exact: bool = True):
        return self.js(f"{self.FIND}({json.dumps(text)}, {json.dumps(exact)})")

    def has_text(self, text: str) -> bool:
        return bool(self.js(f"document.body.innerText.toLowerCase().includes({json.dumps(text.lower())})"))

    def wait_text(self, text: str, timeout: float = 30) -> bool:
        end = time.time() + timeout
        while time.time() < end:
            try:
                if self.has_text(text):
                    return True
            except RuntimeError:
                pass
            time.sleep(1)
        return False

    def path(self) -> str:
        return self.js("location.pathname + location.search")

    def wait_path(self, prefix: str, timeout: float = 20) -> bool:
        end = time.time() + timeout
        while time.time() < end:
            try:
                if self.path().startswith(prefix):
                    return True
            except RuntimeError:
                pass
            time.sleep(0.8)
        return False

    def _mouse(self, kind: str, x: float, y: float) -> None:
        self.send("Input.dispatchMouseEvent", type=kind, x=x, y=y, button="left", clickCount=1)

    def click(self, text: str, exact: bool = True, timeout: float = 20) -> None:
        end = time.time() + timeout
        target = None
        while time.time() < end and not target:
            target = self.find(text, exact)
            if not target:
                time.sleep(1)
        if not target:
            shot("missing-" + re.sub(r"\W+", "-", text)[:30])
            raise AssertionError(f"not on screen: {text!r}")
        time.sleep(0.3)  # let scrollIntoView settle
        target = self.find(text, exact) or target
        self._mouse("mouseMoved", target["x"], target["y"])
        self._mouse("mousePressed", target["x"], target["y"])
        self._mouse("mouseReleased", target["x"], target["y"])
        time.sleep(1.2)

    def drag(self, points, step_s: float = 0.02) -> None:
        """A one-finger drag through a list of (x, y) CSS-pixel points."""
        (x0, y0) = points[0]
        self._mouse("mouseMoved", x0, y0)
        self._mouse("mousePressed", x0, y0)
        for (x, y) in points[1:]:
            self.send("Input.dispatchMouseEvent", type="mouseMoved", x=x, y=y, button="left", buttons=1)
            time.sleep(step_s)
        (x1, y1) = points[-1]
        self._mouse("mouseReleased", x1, y1)

    def stage(self, view: str):
        """Maps stage units of the game's SVG (by viewBox) to CSS pixels."""
        m = self.js(f"""(() => {{ const s = document.querySelector('svg[viewBox="{view}"]');
          if (!s) return null; const m = s.getScreenCTM(); return {{ a: m.a, d: m.d, e: m.e, f: m.f }}; }})()""")
        if not m:
            raise AssertionError(f"no game stage {view!r} on screen")
        return lambda x, y: (m["a"] * x + m["e"], m["d"] * y + m["f"])

    def hold(self, text: str, seconds: float = 3.6, timeout: float = 20) -> None:
        # Wait for it, like click(): right after a relaunch the screen may
        # still be appearing.
        end = time.time() + timeout
        target = None
        while time.time() < end and not target:
            target = self.find(text, exact=True)
            if not target:
                time.sleep(1)
        if not target:
            raise AssertionError(f"not on screen to hold: {text!r}")
        self._mouse("mousePressed", target["x"], target["y"])
        time.sleep(seconds)
        self._mouse("mouseReleased", target["x"], target["y"])
        time.sleep(1.5)


def check(name: str, ok, detail: str = "") -> bool:
    results.append((name, bool(ok), detail))
    print(("PASS  " if ok else "FAIL  ") + name + (f"  ({detail})" if detail else ""), flush=True)
    return bool(ok)


def step(name: str, fn) -> None:
    try:
        fn()
    except Exception as e:  # noqa: BLE001 — every failure must reach the report
        check(name, False, str(e)[:300])


# ─────────────────────────────────────────────────────────────────────────────

sdk = adb("shell", "getprop", "ro.build.version.sdk").strip()
release = adb("shell", "getprop", "ro.build.version.release").strip()
m = re.search(r"Current WebView package \(name, version\): \(([^,]+), ([^)]+)\)",
              adb("shell", "dumpsys", "webviewupdate", check=False))
webview = m.group(2).strip() if m else "unknown"
print(f"Android {release} (API {sdk}) · WebView {webview}", flush=True)

adb("install", "-r", "-g", APK, timeout=300)
adb("logcat", "-c")
launch()
page = Page()


def first_launch():
    page.attach(timeout=90)
    ok = page.wait_text("Ikinyarwanda", timeout=60)
    shot("first-launch-setup")
    check("first launch shows setup", ok)
    hidden = page.js("getComputedStyle(document.getElementById('kina-unsupported')).display === 'none'")
    check("old-engine fallback is not shown", hidden)
    style = page.js("""(() => {
      const b = [...document.querySelectorAll('button')].find(b => b.innerText.trim() === 'English');
      const s = getComputedStyle(b);
      return { w: Math.round(b.getBoundingClientRect().width), vw: innerWidth,
               radius: s.borderTopLeftRadius, font: s.fontFamily };
    })()""")
    check("page is styled (full-width rounded buttons, brand font)",
          style and style["w"] > 0.7 * style["vw"] and style["radius"] != "0px" and "Baloo" in style["font"],
          json.dumps(style))


def setup():
    page.click("English")
    check("language leads to the grown-up welcome", page.wait_text("Welcome, grown-up"))
    shot("setup-welcome")
    page.click("Next")
    check("next step: your child", page.wait_path("/welcome?step=2"))
    back()
    check("hardware back steps back through setup", page.wait_path("/welcome?step=1"))
    page.click("Next")
    page.click("Next")
    check("play-time step", page.wait_text("Play time"))
    shot("setup-play-time")
    page.click("Next")
    check("last step: child sees only their screens", page.wait_text("Your child sees only their screens"))
    shot("setup-lock")
    page.click("Let's play!")
    check("setup finishes on the child's home", page.wait_path("/home-path"))
    time.sleep(1)
    shot("child-home")


def safe_area():
    """The header must clear the status bar. Capacitor has two modes:
    WebView 140+ draws edge to edge and the page pads by the inset; older
    WebViews are placed BETWEEN the bars (the page sees zero inset, and the
    window colour fills the strips). Either is fine; text under the bar is not."""
    m = page.js("""(() => {
      const probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;top:0;padding-top:env(safe-area-inset-top,0px)';
      document.body.appendChild(probe);
      const env = parseFloat(getComputedStyle(probe).paddingTop) || 0;
      probe.remove();
      const injected = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top')) || 0;
      const g = document.querySelector('header p');
      return { injected, env, greetingTop: g ? Math.round(g.getBoundingClientRect().top) : -1,
               pageHeightPx: Math.round(innerHeight * devicePixelRatio) };
    })()""")
    screen_h = int(re.search(r"\d+x(\d+)", adb("shell", "wm", "size")).group(1))
    edge_to_edge = m["pageHeightPx"] >= screen_h - 4
    inset = max(m["injected"], m["env"])
    m.update(screenHeightPx=screen_h, mode="edge-to-edge" if edge_to_edge else "between the bars")
    ok = (inset >= 20 and m["greetingTop"] >= inset) if edge_to_edge else m["greetingTop"] >= 0
    check("header clears the status bar", ok, json.dumps(m))


def back_on_home():
    back()
    time.sleep(1)
    check("back on home keeps the app alive", bool(pid()))
    check("back on home moves the app to the background", not in_front())
    launch()
    check("reopening returns to the child's home, not setup", page.wait_path("/home-path"))


def survives_close():
    adb("shell", "am", "force-stop", PKG)
    time.sleep(1)
    launch()
    page.attach(timeout=60)
    check("after closing the app, setup is remembered", page.wait_path("/home-path", timeout=40))


def grown_up_door():
    page.hold("Grown-ups")
    check("holding the greeting opens the parent gate", page.wait_text("Grown-ups only"))
    shot("parent-gate")
    back()
    check("back from the gate returns to the child's home", page.wait_path("/home-path"))


def video():
    page.click("Episodes")
    check("episodes list", page.wait_text("Bayi Bayi Ingona"))
    shot("episodes")
    # Only the content scrolls: the header (the way back) and the tab bar must
    # not move, and the page itself must never scroll.
    fixed = page.js("""(async () => {
      const main = document.querySelector('main'), header = document.querySelector('header'), nav = document.querySelector('nav');
      const at = el => Math.round(el.getBoundingClientRect().top);
      const before = [at(header), at(nav)];
      main.scrollTop = 99999; window.scrollTo(0, 99999);
      await new Promise(r => setTimeout(r, 400));
      const after = [at(header), at(nav)];
      return { pageScrolls: document.scrollingElement.scrollHeight > innerHeight + 1, windowY: scrollY,
               headerAndNavStill: before.join() === after.join(),
               navAtBottom: Math.round(nav.getBoundingClientRect().bottom) === innerHeight };
    })()""")
    check("header and tab bar stay fixed; only the content scrolls",
          fixed and not fixed["pageScrolls"] and fixed["windowY"] == 0 and fixed["headerAndNavStill"] and fixed["navAtBottom"],
          json.dumps(fixed))
    page.js("document.querySelector('main').scrollTop = 0")
    page.click("Bayi Bayi Ingona", exact=False)
    check("episode opens", page.wait_path("/episode/"))
    page.click("Tap to play!")
    time.sleep(7)
    shot("video-playing")
    v = page.js("""(() => { const v = document.querySelector('video');
      return v ? { t: Math.round(v.currentTime * 10) / 10, paused: v.paused,
                   error: v.error && v.error.code, src: v.currentSrc } : null; })()""")
    check("the video is really playing (its clock is running)",
          v and v["t"] > 2 and not v["paused"] and not v["error"], json.dumps(v))


FS_STATE = """(() => {
  const v = document.querySelector('video'); if (!v) return null;
  const r = v.parentElement.getBoundingClientRect();
  return { landscape: innerWidth > innerHeight, w: innerWidth, h: innerHeight,
           boxFillsScreen: Math.round(r.width) === innerWidth && Math.round(r.height) === innerHeight,
           fit: getComputedStyle(v).objectFit, playing: !v.paused, path: location.pathname };
})()"""


def fullscreen():
    """Reported on a real phone: fullscreen zoomed the scene so far it was
    unusable. Fullscreen must turn to landscape and show the whole picture,
    and the back button must return to portrait on the same episode."""
    # Controls hide 3 s after playback starts; a tap on the picture brings them back.
    c = page.js("(() => { const r = document.querySelector('video').getBoundingClientRect();"
                " return { x: r.left + r.width / 2, y: r.top + r.height * 0.15 }; })()")
    page._mouse("mousePressed", c["x"], c["y"])
    page._mouse("mouseReleased", c["x"], c["y"])
    time.sleep(0.6)
    page.click("Fullscreen")
    time.sleep(3)
    shot("video-fullscreen")
    s = page.js(FS_STATE)
    check("fullscreen turns the screen to landscape", s and s["landscape"], json.dumps(s))
    check("fullscreen fills the screen with the whole picture (not zoomed)",
          s and s["boxFillsScreen"] and s["fit"] == "contain", json.dumps(s))
    check("the video keeps playing in fullscreen", s and s["playing"], json.dumps(s))
    # ONE press must be enough. (Hiding the system bars made Android show a
    # one-time notice that swallowed every back press — so the app no longer
    # hides them. See src/native/fullscreen.ts.)
    back()
    time.sleep(2)
    s = page.js(FS_STATE)
    shot("video-after-fullscreen")
    check("one back press leaves fullscreen: portrait again, still on the episode",
          s and not s["landscape"] and not s["boxFillsScreen"] and s["path"].startswith("/episode/"),
          json.dumps(s))

    # The on-screen way out must work too.
    c = page.js("(() => { const r = document.querySelector('video').getBoundingClientRect();"
                " return { x: r.left + r.width / 2, y: r.top + r.height * 0.15 }; })()")
    page._mouse("mousePressed", c["x"], c["y"])
    page._mouse("mouseReleased", c["x"], c["y"])
    time.sleep(0.6)
    page.click("Fullscreen")
    time.sleep(3)
    entered = page.js(FS_STATE)
    page._mouse("mousePressed", entered["w"] / 2, entered["h"] * 0.15)
    page._mouse("mouseReleased", entered["w"] / 2, entered["h"] * 0.15)
    time.sleep(0.6)
    page.click("Exit fullscreen")
    time.sleep(2.5)
    s = page.js(FS_STATE)
    check("the on-screen exit button leaves fullscreen too",
          entered and entered["landscape"] and s and not s["landscape"] and not s["boxFillsScreen"],
          json.dumps({"entered": entered, "after": s}))


GAME_TITLES = ["Wash Your Hands!", "Trace & Write", "Shapes & Colours", "Jigsaw Puzzles",
               "Find the Way", "Colouring", "Memory Match", "Count!"]


def to_games():
    """From the episode the video tests left open, to the games hub. (One back
    only: a back press on the child's home sends the app to the background.)"""
    if page.path().startswith("/episode/"):
        back()
        time.sleep(1.5)
    page.click("Games")
    check("games hub opens", page.wait_path("/games"))


def games_hub():
    to_games()
    time.sleep(1)
    missing = [t for t in GAME_TITLES if not page.find(t)]
    shot("games-hub")
    check("every game is on the games screen", not missing, ", ".join(missing))
    check("the sticker book is on the games screen", page.find("Open the sticker book"))


def wash_hands():
    """The rebuilt handwashing game, played through with real touches:
    tap the pedal, drag the soap, rub, hold the pedal, rub with the towel."""
    page.click("Wash Your Hands!")
    page.click("Play")
    time.sleep(1.5)
    at = page.stage("0 0 400 600")
    shot("karaba-start")
    x, y = at(225, 548)
    page._mouse("mousePressed", x, y)
    page._mouse("mouseReleased", x, y)
    time.sleep(2.6)
    sx, sy = at(334, 340)
    hx, hy = at(215, 395)
    page.drag([(sx, sy)] + [(sx + (hx - sx) * i / 12, sy + (hy - sy) * i / 12) for i in range(1, 13)])
    time.sleep(1.8)
    shot("karaba-soap")
    rub = [at(130 + (170 if i % 2 else 0), 360 + (i % 5) * 10) for i in range(90)]
    page.drag(rub, step_s=0.03)
    time.sleep(1.8)
    shot("karaba-scrubbed")
    x, y = at(225, 548)
    page._mouse("mousePressed", x, y)
    time.sleep(2.6)
    page._mouse("mouseReleased", x, y)
    time.sleep(1.6)
    tx, ty = at(70, 318)
    towel = [(tx, ty)] + [(tx + (hx - tx) * i / 10, ty + (hy - ty) * i / 10) for i in range(1, 11)]
    towel += [at(150 + (130 if i % 2 else 0), 380 + (i % 3) * 10) for i in range(50)]
    page.drag(towel, step_s=0.03)
    ok = page.wait_text("KINA CHALLENGE", timeout=12)
    time.sleep(1.5)
    shot("karaba-finished")
    check("handwashing plays through all five steps by touch", ok)
    check("finishing a game awards a sticker", page.has_text("New sticker!"))
    page.click("Grown-up: we did it!")
    page.click("Games")
    check("back to the games hub from the win screen", page.wait_path("/games"))


def tracing():
    page.click("Trace & Write")
    page.click("a e i o u")
    time.sleep(6.5)  # Kina's pencil writes it first
    shot("andika-trace")
    at = page.stage("0 0 400 590")
    pts = page.js("""(() => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', 'M69 52 A22 22 0 1 0 69 74'); const s = document.querySelector('svg[viewBox="0 0 400 590"]');
      s.appendChild(p); const L = p.getTotalLength(); const out = [];
      for (let i = 0; i <= 50; i++) { const q = p.getPointAtLength(L * i / 50); out.push([q.x, q.y]); }
      p.remove(); return out; })()""")
    page.drag([at(50 + 3 * gx, 24 + 3 * gy) for gx, gy in pts], step_s=0.03)
    time.sleep(0.8)
    shot("andika-inked")
    ink = page.js("""(() => { const s = document.querySelector('svg[viewBox="0 0 400 590"]');
      const p = [...s.querySelectorAll('path')].find(x => x.getAttribute('stroke') === '#2FBF6B');
      return p ? parseFloat(p.style.strokeDashoffset || '999') : null; })()""")
    check("the magic ink follows the finger along the stroke", ink is not None and ink < 5, f"dashoffset={ink}")
    back()
    back()
    page.wait_path("/games")


def other_games():
    for title, view, shot_name in [
        ("Shapes & Colours", "0 0 400 600", "imiterere"),
        ("Find the Way", "0 0 400 600", "inzira"),
    ]:
        page.click(title)
        time.sleep(2)
        shot(shot_name)
        check(f"{title} opens and draws its stage", page.stage(view) is not None)
        back()
        page.wait_path("/games")
        time.sleep(1)

    page.click("Jigsaw Puzzles")
    page.click("Cows on the hill")
    time.sleep(1.5)
    shot("teranya")
    pieces = page.js("document.querySelectorAll('g[clip-path^=\"url(#kw-piece-\"]').length")
    check("the jigsaw cuts the picture into pieces", pieces and pieces >= 4, f"{pieces} pieces")
    back()
    back()
    page.wait_path("/games")

    page.click("Colouring")
    page.click("Cow")
    time.sleep(1)
    page.click("Red")
    at = page.stage("0 0 360 360")
    x, y = at(170, 230)
    page._mouse("mousePressed", x, y)
    page._mouse("mouseReleased", x, y)
    time.sleep(1.2)
    shot("siga")
    filled = page.js("""(() => [...document.querySelectorAll('svg[viewBox="0 0 360 360"] path')]
      .some(p => p.getAttribute('fill') === '#F2453D'))()""")
    check("colouring: tapping a part paints it", filled)
    back()
    back()
    page.wait_path("/games")

    page.click("Open the sticker book")
    check("the sticker book shows the earned sticker", page.wait_text("1 of 20"))
    shot("stickers")
    back()


for name, fn in [
    ("first launch", first_launch),
    ("setup", setup),
    ("safe area", safe_area),
    ("back on home", back_on_home),
    ("close and reopen", survives_close),
    ("grown-up door", grown_up_door),
    ("video", video),
    ("fullscreen", fullscreen),
    ("games hub", games_hub),
    ("handwashing", wash_hands),
    ("tracing", tracing),
    ("other games", other_games),
]:
    step(name, fn)

# ── The log: crashes and JavaScript errors fail the run ──
log = adb("logcat", "-d", timeout=120)
with open(os.path.join(OUT, "logcat.txt"), "w", encoding="utf-8") as f:
    f.write(log)
crash = [l for l in log.splitlines() if f"Process: {PKG}" in l or (PKG in l and "has died" in l)]
check("no crash in Kina Wige", not crash, crash[0] if crash else "")
js_errors = [
    l for l in log.splitlines()
    if ("Capacitor/Console" in l or "chromium" in l)
    and re.search(r"Uncaught|TypeError|ReferenceError|SyntaxError", l)
    # Capacitor's SystemBars writes the safe-area variables when Android first
    # reports the bar sizes, which can be before the page exists, and writes
    # them again when the page commits. The "safe area" checks above verify
    # the second write landed.
    and "Error injecting safe area CSS" not in l
    # On a cold start Capacitor fires native lifecycle events into the page
    # with window.Capacitor.triggerEvent(...); on old WebViews that can run
    # before the bridge script exists, so the call finds window.Capacitor
    # undefined. Capacitor-internal, startup only, and Kina Wige uses none of
    # those events (back button and plugins use their own listener channel).
    and "'triggerEvent'" not in l
]
check("no uncaught JavaScript error", not js_errors, js_errors[0][:200] if js_errors else "")

passed = sum(1 for _, ok, _ in results if ok)
lines = [f"# Kina Wige smoke test — Android {release} (API {sdk}), WebView {webview}", "",
         f"**{passed}/{len(results)} checks passed**", "",
         "| Check | Result | Detail |", "|---|---|---|"]
lines += [f"| {n} | {'PASS' if ok else 'FAIL'} | {d.replace('|', '/')} |" for n, ok, d in results]
with open(os.path.join(OUT, "summary.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")
print(f"\n{passed}/{len(results)} checks passed", flush=True)
sys.exit(0 if passed == len(results) else 1)
