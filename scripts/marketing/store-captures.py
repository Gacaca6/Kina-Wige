#!/usr/bin/env python3
"""Kina Wige — raw captures for the Google Play listing and the launch campaign.

Runs in a CI emulator (.github/workflows/store-captures.yml), never on a
user's phone. It drives the DEBUG build over the WebView DevTools channel
(the same way scripts/android-smoke.py does), puts the app into the state
each marketing screen needs, and saves full-resolution screenshots with a
clean, pinned status bar. goldie then frames them for the store.

Demo state: a fictional child, "Keza" (one of the app's own characters),
aged 4, playing in Kinyarwanda. Every screen is a real feature in the
shipped app; only the progress data is seeded so the report and the sticker
book have something to show.

Usage: store-captures.py <app-debug.apk> <output-dir>
"""

import json
import os
import subprocess
import sys
import time
import urllib.request

import websocket  # websocket-client

PKG = "rw.kinawige.app"
ACTIVITY = f"{PKG}/.MainActivity"
PORT = 9222
APK = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else "store-raw"
os.makedirs(OUT, exist_ok=True)
log: list[str] = []


def adb(*args: str, check: bool = True, timeout: int = 120) -> str:
    r = subprocess.run(["adb", *args], capture_output=True, text=True, timeout=timeout)
    if check and r.returncode != 0:
        raise RuntimeError(f"adb {' '.join(args)} failed: {r.stderr.strip()}")
    return r.stdout


def pid() -> str:
    return adb("shell", "pidof", PKG, check=False).strip()


def demo_status_bar() -> None:
    """Android's SystemUI demo mode: 9:41, full signal and battery, no icons."""
    adb("shell", "settings", "put", "global", "sysui_demo_allowed", "1", check=False)
    def demo(*extra: str) -> None:
        adb("shell", "am", "broadcast", "-a", "com.android.systemui.demo", "-e", "command", *extra, check=False)
    demo("enter")
    demo("clock", "-e", "hhmm", "0941")
    demo("battery", "-e", "level", "100", "-e", "plugged", "false")
    demo("network", "-e", "wifi", "show", "-e", "level", "4", "-e", "fully", "true")
    demo("network", "-e", "mobile", "hide")
    demo("notifications", "-e", "visible", "false")


def shot(name: str, settle: float = 0.4) -> None:
    time.sleep(settle)
    png = subprocess.run(["adb", "exec-out", "screencap", "-p"], capture_output=True, timeout=60).stdout
    with open(os.path.join(OUT, f"{name}.png"), "wb") as f:
        f.write(png)
    log.append(f"captured {name}")
    print("captured", name, flush=True)


class Page:
    def __init__(self) -> None:
        self.ws = None
        self.pid = ""
        self.msg_id = 0

    def attach(self, timeout: float = 90) -> None:
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
                    last = "no page target yet"
                except Exception as e:  # noqa: BLE001
                    last = str(e)
            time.sleep(1.5)
        raise RuntimeError(f"could not attach to the WebView: {last}")

    def send(self, method: str, **params):
        for attempt in range(2):
            try:
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
            except (websocket.WebSocketException, ConnectionError, OSError):
                self.ws = None
                if attempt:
                    raise

    def js(self, expr: str):
        r = self.send("Runtime.evaluate", expression=expr, returnByValue=True, awaitPromise=True)
        if r.get("exceptionDetails"):
            raise RuntimeError(f"page script failed: {r['exceptionDetails'].get('text')} :: {expr[:120]}")
        return r.get("result", {}).get("value")

    def mouse(self, kind: str, x: float, y: float, buttons: int = 0) -> None:
        self.send("Input.dispatchMouseEvent", type=kind, x=x, y=y, button="left", buttons=buttons, clickCount=1)

    def tap(self, x: float, y: float) -> None:
        self.mouse("mouseMoved", x, y)
        self.mouse("mousePressed", x, y, 1)
        self.mouse("mouseReleased", x, y)

    def drag(self, pts, step_s: float = 0.025) -> None:
        (x0, y0) = pts[0]
        self.mouse("mouseMoved", x0, y0)
        self.mouse("mousePressed", x0, y0, 1)
        for (x, y) in pts[1:]:
            self.mouse("mouseMoved", x, y, 1)
            time.sleep(step_s)
        self.mouse("mouseReleased", *pts[-1])

    def click_label(self, label: str, timeout: float = 20) -> None:
        end = time.time() + timeout
        while time.time() < end:
            c = self.js(f"""(() => {{ const want = {json.dumps(label)};
              const el = [...document.querySelectorAll('button,[role=button]')]
                .find(e => (e.getAttribute('aria-label') || '').trim() === want || (e.innerText || '').trim() === want);
              if (!el) return null; el.scrollIntoView({{block:'center'}});
              const r = el.getBoundingClientRect(); return {{ x: r.left + r.width/2, y: r.top + r.height/2 }}; }})()""")
            if c:
                time.sleep(0.3)
                self.tap(c["x"], c["y"])
                time.sleep(1.2)
                return
            time.sleep(0.8)
        raise RuntimeError(f"not on screen: {label}")

    def stage(self, view: str):
        m = self.js(f"""(() => {{ const s = document.querySelector('svg[viewBox="{view}"]');
          if (!s) return null; const m = s.getScreenCTM(); return {{a:m.a, d:m.d, e:m.e, f:m.f}}; }})()""")
        if not m:
            raise RuntimeError(f"no stage {view}")
        return lambda x, y: (m["a"] * x + m["e"], m["d"] * y + m["f"])


# ── Demo state ──────────────────────────────────────────────────────────────

NOW = int(time.time() * 1000)
DAY = 86_400_000


def attempts(pattern: str, source: str, sessions=("s1", "s2")):
    out = []
    for i, ch in enumerate(pattern):
        out.append({"correct": ch == "1", "session": sessions[min(i * len(sessions) // len(pattern), len(sessions) - 1)],
                    "source": source, "at": NOW - (len(pattern) - i) * DAY // 2})
    return out


EVIDENCE = {
    "phy.hand.sequence": attempts("01111", "game:karaba") + attempts("1", "offline:karaba", ("s3",)),
    "snd.vowel.recognise": attempts("11011", "lesson:u1l1"),
    "num.cardinal5": attempts("0101", "game:counting"),
    "snd.write.trace": attempts("011", "game:andika"),
    "phy.fine.control": attempts("1101", "game:inzira"),
    "num.sort.one": attempts("0111", "game:imiterere"),
    "num.shape.build": attempts("1", "game:teranya"),
}
BASE = {
    "kina-wige-family": {"onboarded": True, "childName": "Keza", "age": 4, "sessionMinutes": 20},
    "kina-wige-language": "KN",
    "kina-wige-stars": 23,
    "kina-wige-stickers": {k: 1 for k in ["cow", "banana", "drum", "gorilla", "hippo", "giraffe", "goat", "avocado",
                                          "elephant", "house", "chicken", "pineapple"]} | {"giraffe": 2, "cow": 2},
    "kina-wige-evidence": EVIDENCE,
    "kina-wige-progress": {"episodesWatched": {"bayi-bayi-ingona": True, "isuku": True},
                           "gamesCompleted": {"karaba": 4, "andika": 2, "teranya": 3, "inzira": 2, "siga": 1},
                           "comicsRead": {}, "lessonsCompleted": {"u1l1": 1, "u3l1": 1}},
}


def goto(page: Page, path: str, extra_local: dict | None = None, session: dict | None = None, wait: float = 3.0) -> None:
    store = dict(BASE)
    store.update(extra_local or {})
    sets = "".join(
        f"localStorage.setItem({json.dumps(k)}, {json.dumps(v if isinstance(v, str) else json.dumps(v))});"
        for k, v in store.items())
    sess = "".join(f"sessionStorage.setItem({json.dumps(k)}, {json.dumps(v)});" for k, v in (session or {}).items())
    page.js("localStorage.removeItem('kina-wige-session'); sessionStorage.clear();" + sets + sess +
            f"location.replace({json.dumps(path)}); true")
    time.sleep(wait)


def scene(name, fn):
    try:
        fn()
    except Exception as e:  # noqa: BLE001 — one failed scene must not lose the rest
        log.append(f"FAILED {name}: {e}")
        print("FAILED", name, e, flush=True)


# ── Run ─────────────────────────────────────────────────────────────────────

adb("install", "-r", "-g", APK, timeout=300)
adb("shell", "am", "start", "-W", "-n", ACTIVITY)
page = Page()
page.attach()
time.sleep(4)
demo_status_bar()


def home():
    goto(page, "/home-path", wait=4)
    shot("home")


def episode():
    goto(page, "/episode/bayi-bayi-ingona", wait=4)
    # A real tap on the play overlay, as a child would; then let the controls fade.
    c = page.js("""(() => { const el = [...document.querySelectorAll('button,div,span,p')]
        .filter(e => (e.innerText || '').trim() === 'Kanda urebe!').pop();
      if (!el) return null; const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()""")
    if c:
        page.tap(c["x"], c["y"])
    time.sleep(3)
    page.js("(() => { const v = document.querySelector('video'); if (v) { v.muted = true; v.currentTime = 24; } return true; })()")
    time.sleep(5)
    shot("episode")


def karaba():
    goto(page, "/game/karaba")
    page.click_label("Tangira gukina")
    time.sleep(1.5)
    at = page.stage("0 0 400 600")
    page.tap(*at(225, 548))
    time.sleep(2.8)
    sx, sy = at(334, 340)
    hx, hy = at(215, 395)
    page.drag([(sx, sy)] + [(sx + (hx - sx) * i / 12, sy + (hy - sy) * i / 12) for i in range(1, 13)])
    time.sleep(2.0)
    # Rub part of the way: foam building, some germs still there, the ring half full.
    rub = [at(140 + (150 if i % 2 else 0), 360 + (i % 4) * 12) for i in range(26)]
    page.drag(rub, step_s=0.04)
    shot("karaba", settle=0.25)


def andika():
    goto(page, "/game/andika")
    page.click_label("a e i o u")
    time.sleep(7)  # Kina's pencil writes it first
    at = page.stage("0 0 400 590")
    pts = page.js("""(() => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', 'M69 52 A22 22 0 1 0 69 74'); const s = document.querySelector('svg[viewBox="0 0 400 590"]');
      s.appendChild(p); const L = p.getTotalLength(); const out = [];
      for (let i = 0; i <= 60; i++) { const q = p.getPointAtLength(L * i / 60); out.push([q.x, q.y]); }
      p.remove(); return out; })()""")
    page.drag([at(50 + 3 * gx, 24 + 3 * gy) for gx, gy in pts], step_s=0.03)
    time.sleep(1.0)
    shot("andika")


def teranya():
    goto(page, "/game/teranya")
    page.click_label("Inka ku musozi")
    time.sleep(1.8)
    at = page.stage("0 0 400 600")
    info = page.js("""(() => [...document.querySelectorAll('g[clip-path^="url(#kw-piece-"]')].map(g => {
        const id = Number(g.getAttribute('clip-path').match(/kw-piece-(\\d+)/)[1]);
        const t = g.parentElement.parentElement.getAttribute('transform') || '';
        const m = /translate\\(([-\\d.]+)[ ,]+([-\\d.]+)\\)/.exec(t);
        return { id, x: m ? Number(m[1]) : null, y: m ? Number(m[2]) : null };
      }))()""")
    cols = 3 if len(info) in (6, 9) else (2 if len(info) == 4 else 4)
    rows = len(info) // cols
    pw, ph = 360 / cols, 270 / rows
    for p in sorted(info, key=lambda p: p["id"])[: max(2, len(info) // 2)]:
        if p["x"] is None:
            continue
        c, r = p["id"] % cols, p["id"] // cols
        a, b = at(p["x"], p["y"]), at(20 + c * pw + pw / 2, 16 + r * ph + ph / 2)
        page.drag([a] + [(a[0] + (b[0] - a[0]) * i / 10, a[1] + (b[1] - a[1]) * i / 10) for i in range(1, 11)])
        time.sleep(0.9)
    time.sleep(0.6)
    shot("teranya")


def stickers():
    goto(page, "/stickers", wait=3.5)
    shot("stickers")


def parents():
    goto(page, "/parents", session={"kina-wige-parent-unlocked": "1"}, wait=4)
    shot("parents")
    page.js("document.querySelector('main') && (document.querySelector('main').scrollTop = 520); true")
    time.sleep(1.2)
    shot("parents-skills")


def rest():
    session = {"playedMs": 20 * 60_000, "lastTick": NOW, "restUntil": NOW + 3_600_000}
    goto(page, "/home-path", extra_local={"kina-wige-session": session}, wait=4)
    shot("rest")


def inzira():
    goto(page, "/game/inzira", extra_local={"kina-wige-game-levels": {"inzira": {"level": 4, "up": 0, "down": 0}}}, wait=3.5)
    shot("inzira")


def imiterere():
    goto(page, "/game/imiterere", extra_local={"kina-wige-game-levels": {"imiterere": {"level": 15, "up": 0, "down": 0}}}, wait=3.5)
    shot("imiterere")


def siga():
    goto(page, "/game/siga")
    page.click_label("Inka")
    time.sleep(1.2)
    at = page.stage("0 0 360 360")
    for colour, (x, y) in [("Ubururu bwerurutse", (200, 30)), ("Icyatsi kibisi", (30, 330)), ("Umuhondo", (58, 58)),
                           ("Ikigina", (170, 230)), ("Umweru", (140, 210)), ("Iroza", (282, 178)),
                           ("Ikigina", (282, 130)), ("Umuhondo", (240, 60)), ("Umuhondo", (326, 60))]:
        page.click_label(colour)
        page.tap(*at(x, y))
        time.sleep(0.7)
    shot("siga")


# ── Gameplay clips for the launch video ─────────────────────────────────────

def record(name: str, seconds: int, actions) -> None:
    """Screen-record the real app while `actions` plays it, then pull the MP4."""
    remote = f"/sdcard/{name}.mp4"
    adb("shell", "rm", "-f", remote, check=False)
    rec = subprocess.Popen(["adb", "shell", "screenrecord", "--bit-rate", "12000000",
                            "--time-limit", str(seconds), remote])
    time.sleep(0.8)
    try:
        actions()
    finally:
        rec.wait(timeout=seconds + 30)
    time.sleep(1.5)
    adb("pull", remote, os.path.join(OUT, f"{name}.mp4"), timeout=120)
    log.append(f"recorded {name}")
    print("recorded", name, flush=True)


def clip_karaba():
    goto(page, "/game/karaba", extra_local={"kina-wige-game-levels": {"karaba": {"level": 2, "up": 0, "down": 0}}})
    page.click_label("Tangira gukina")
    time.sleep(1.2)
    at = page.stage("0 0 400 600")

    def play():
        time.sleep(0.6)
        page.tap(*at(225, 548))                       # water
        time.sleep(2.6)
        sx, sy = at(334, 340)
        hx, hy = at(215, 395)
        page.drag([(sx, sy)] + [(sx + (hx - sx) * i / 16, sy + (hy - sy) * i / 16) for i in range(1, 17)], step_s=0.03)
        time.sleep(1.4)
        rub = [at(140 + (150 if i % 2 else 0), 360 + (i % 4) * 12) for i in range(70)]
        page.drag(rub, step_s=0.05)                   # scrub: germs pop, the ring fills
        time.sleep(1.2)
    record("clip-karaba", 15, play)


def clip_andika():
    goto(page, "/game/andika", extra_local={"kina-wige-game-levels": {"andika": {"level": 1, "up": 0, "down": 0}}})
    page.click_label("a e i o u")

    def play():
        time.sleep(6.2)                               # Kina's pencil writes "a"
        at = page.stage("0 0 400 590")
        for d in ["M69 52 A22 22 0 1 0 69 74", "M72 41 V85"]:
            pts = page.js(f"""(() => {{ const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              p.setAttribute('d', {json.dumps(d)}); const s = document.querySelector('svg[viewBox="0 0 400 590"]');
              s.appendChild(p); const L = p.getTotalLength(); const out = [];
              for (let i = 0; i <= 50; i++) {{ const q = p.getPointAtLength(L * i / 50); out.push([q.x, q.y]); }}
              p.remove(); return out; }})()""")
            page.drag([at(50 + 3 * gx, 24 + 3 * gy) for gx, gy in pts], step_s=0.035)
            time.sleep(0.5)
        time.sleep(2.0)                               # the letter turns gold
    record("clip-andika", 16, play)


def clip_teranya():
    goto(page, "/game/teranya", extra_local={"kina-wige-game-levels": {"teranya": {"level": 1, "up": 0, "down": 0}}})
    page.click_label("Inka ku musozi")
    time.sleep(1.5)
    at = page.stage("0 0 400 600")

    def play():
        time.sleep(0.5)
        for _ in range(4):
            info = page.js("""(() => [...document.querySelectorAll('g[clip-path^="url(#kw-piece-"]')].map(g => {
                const id = Number(g.getAttribute('clip-path').match(/kw-piece-(\\d+)/)[1]);
                const t = g.parentElement.parentElement.getAttribute('transform') || '';
                const m = /translate\\(([-\\d.]+)[ ,]+([-\\d.]+)\\)/.exec(t);
                return { id, x: m ? Number(m[1]) : null, y: m ? Number(m[2]) : null };
              }))()""")
            cols = 2 if len(info) == 4 else 3
            rows = len(info) // cols
            pw, ph = 360 / cols, 270 / rows
            for p in info:
                c, r = p["id"] % cols, p["id"] // cols
                tx, ty = 20 + c * pw + pw / 2, 16 + r * ph + ph / 2
                if p["x"] is None or abs(p["x"] - tx) + abs(p["y"] - ty) < 2:
                    continue
                a, b = at(p["x"], p["y"]), at(tx, ty)
                page.drag([a] + [(a[0] + (b[0] - a[0]) * i / 14, a[1] + (b[1] - a[1]) * i / 14) for i in range(1, 15)], step_s=0.03)
                time.sleep(0.6)
                break
        time.sleep(3.5)                               # the picture comes alive
    record("clip-teranya", 12, play)


for name, fn in [("home", home), ("episode", episode), ("karaba", karaba), ("andika", andika),
                 ("teranya", teranya), ("stickers", stickers), ("parents", parents), ("rest", rest),
                 ("inzira", inzira), ("imiterere", imiterere), ("siga", siga),
                 ("clip-karaba", clip_karaba), ("clip-andika", clip_andika), ("clip-teranya", clip_teranya)]:
    scene(name, fn)

with open(os.path.join(OUT, "captures.log"), "w", encoding="utf-8") as f:
    f.write("\n".join(log) + "\n")
failed = [l for l in log if l.startswith("FAILED")]
print(f"{len(log) - len(failed)} captured, {len(failed)} failed", flush=True)
sys.exit(1 if failed else 0)
