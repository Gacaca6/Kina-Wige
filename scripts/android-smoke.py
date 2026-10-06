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

    def hold(self, text: str, seconds: float = 3.6) -> None:
        target = self.find(text, exact=True)
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


for name, fn in [
    ("first launch", first_launch),
    ("setup", setup),
    ("safe area", safe_area),
    ("back on home", back_on_home),
    ("close and reopen", survives_close),
    ("grown-up door", grown_up_door),
    ("video", video),
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
