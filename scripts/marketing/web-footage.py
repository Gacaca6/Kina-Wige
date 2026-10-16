#!/usr/bin/env python3
"""Kina Wige — frame-exact gameplay footage for the launch video.

Runs in CI (.github/workflows/launch-video.yml), never on a user's device.
The emulator screen recorder only manages 7-10 fps without a GPU, which reads
as stutter in a launch video. Here the real web build runs in headless Chrome
with its clock frozen: every time source the page can see (rAF, timers, Date,
performance.now, CSS and Web Animations) is stepped by exactly 1/30 s per
frame, so the footage is perfectly smooth however slow the machine is.

Same demo state as store-captures.py: a fictional child, "Keza", aged 4,
playing in Kinyarwanda. Only the progress data is seeded.

Usage: web-footage.py <base-url> <output-dir> [scene ...]
Writes <output-dir>/<scene>/00000.jpg ... at 1080 x 2280 (the phone screen
below the status bar), 30 fps.
"""

import base64
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request

import websocket  # websocket-client

BASE_URL = sys.argv[1].rstrip("/")
OUT = sys.argv[2]
ONLY = set(sys.argv[3:])
FPS = 30
DT = 1000 / FPS
W, H, DPR = 432, 912, 2.5  # → 1080 x 2280 device pixels
PORT = 9333

# Installed before any app code runs. Freezes every clock the page can read
# and hands the stepping to __vt.advance(ms).
CLOCK = r"""
(() => {
  try { delete Navigator.prototype.serviceWorker; } catch (e) {}
  const realRAF = window.requestAnimationFrame.bind(window);
  const realTimeout = window.setTimeout.bind(window);
  const RealDate = Date;
  const epoch = RealDate.UTC(2026, 9, 16, 7, 41, 0);
  let now = 0, rafId = 1, timerId = 1;
  let rafQ = [];
  const timers = new Map();
  performance.now = () => now;
  function FakeDate(...a) {
    if (!new.target) return new RealDate(epoch + now).toString();
    return a.length ? new RealDate(...a) : new RealDate(epoch + now);
  }
  FakeDate.prototype = RealDate.prototype;
  FakeDate.now = () => epoch + now;
  FakeDate.UTC = RealDate.UTC;
  FakeDate.parse = RealDate.parse;
  window.Date = FakeDate;
  window.requestAnimationFrame = (cb) => { const id = rafId++; rafQ.push([id, cb]); return id; };
  window.cancelAnimationFrame = (id) => { rafQ = rafQ.filter((x) => x[0] !== id); };
  window.setTimeout = (cb, ms, ...args) => {
    const id = timerId++; timers.set(id, { at: now + Math.max(0, Number(ms) || 0), cb, args, every: 0 }); return id;
  };
  window.setInterval = (cb, ms, ...args) => {
    const id = timerId++; const every = Math.max(1, Number(ms) || 0);
    timers.set(id, { at: now + every, cb, args, every }); return id;
  };
  window.clearTimeout = window.clearInterval = (id) => { timers.delete(id); };
  const run = (fn, args) => { try { typeof fn === 'function' ? fn(...args) : (0, eval)(String(fn)); } catch (e) { console.error(e); } };
  const tick = () => new Promise((r) => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });
  const seen = new WeakMap();
  const sweep = () => {
    for (const a of document.getAnimations()) {
      let s = seen.get(a);
      if (!s) {
        const t = Number(a.currentTime) || 0;
        s = { base: t < 60 ? 0 : t, born: now, done: false };
        seen.set(a, s);
      }
      if (s.done) continue;
      if (a.playState === 'running') a.pause();
      const t = s.base + (now - s.born) * (a.playbackRate || 1);
      const end = a.effect ? a.effect.getComputedTiming().endTime : Infinity;
      if (Number.isFinite(end) && t >= end) { s.done = true; try { a.finish(); } catch (e) {} }
      else a.currentTime = t;
    }
  };
  window.__vt = {
    get now() { return now; },
    async advance(dt) {
      const target = now + dt;
      for (;;) {
        let next = null;
        for (const [id, t] of timers) if (t.at <= target && (!next || t.at < next[1].at)) next = [id, t];
        if (!next) break;
        const [id, t] = next;
        now = Math.max(now, t.at);
        if (t.every) t.at += t.every; else timers.delete(id);
        run(t.cb, t.args);
        await tick();
      }
      now = target;
      const q = rafQ; rafQ = [];
      for (const [, cb] of q) run(cb, [now]);
      await tick(); await tick();
      sweep();
    },
    paint() {
      return new Promise((r) => {
        const done = () => { sweep(); r(true); };
        realTimeout(done, 120);
        realRAF(() => realRAF(done));
      });
    },
  };
})();
"""


class Chrome:
    def __init__(self) -> None:
        exe = os.environ.get("CHROME") or shutil.which("google-chrome") or shutil.which("chromium")
        if not exe:
            raise SystemExit("no Chrome found (set CHROME)")
        self.profile = tempfile.mkdtemp(prefix="kw-footage-")
        self.proc = subprocess.Popen([
            exe, "--headless=new", f"--remote-debugging-port={PORT}", f"--user-data-dir={self.profile}",
            "--no-first-run", "--no-default-browser-check", "--mute-audio", "--hide-scrollbars",
            "--disable-background-timer-throttling", "--disable-renderer-backgrounding",
            "--force-color-profile=srgb", "--font-render-hinting=none", f"--window-size={W},{H}", "about:blank",
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(80):
            try:
                with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/list", timeout=2) as r:
                    pages = [t for t in json.load(r) if t.get("type") == "page"]
                if pages:
                    self.ws = websocket.create_connection(pages[0]["webSocketDebuggerUrl"], timeout=60,
                                                          suppress_origin=True)
                    break
            except Exception:  # noqa: BLE001
                pass
            time.sleep(0.25)
        else:
            raise SystemExit("Chrome did not start")
        self.mid = 0
        self.send("Page.enable")
        self.send("Runtime.enable")
        self.send("Emulation.setDeviceMetricsOverride", width=W, height=H, deviceScaleFactor=DPR, mobile=True)
        self.send("Emulation.setTouchEmulationEnabled", enabled=False)
        self.send("Page.addScriptToEvaluateOnNewDocument", source=CLOCK)

    def send(self, method: str, **params):
        self.mid += 1
        mid = self.mid
        self.ws.send(json.dumps({"id": mid, "method": method, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == mid:
                if "error" in msg:
                    raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})

    def js(self, expr: str):
        r = self.send("Runtime.evaluate", expression=expr, returnByValue=True, awaitPromise=True)
        if r.get("exceptionDetails"):
            d = r["exceptionDetails"]
            why = (d.get("exception") or {}).get("description") or d.get("text")
            raise RuntimeError(f"page script failed: {why} :: {expr[:100]}")
        return r.get("result", {}).get("value")

    def wait_for_origin(self) -> None:
        for _ in range(100):
            try:
                if self.js(f"location.href.startsWith({json.dumps(BASE_URL)}) && document.readyState !== 'loading'"):
                    return
            except RuntimeError:
                pass
            time.sleep(0.1)
        raise RuntimeError("app page did not load")

    def close(self) -> None:
        self.proc.terminate()
        shutil.rmtree(self.profile, ignore_errors=True)


class Take:
    """One scene. Time only moves when this object moves it."""

    def __init__(self, c: Chrome, name: str) -> None:
        self.c, self.name = c, name
        self.dir = os.path.join(OUT, name)
        shutil.rmtree(self.dir, ignore_errors=True)
        os.makedirs(self.dir)
        self.rolling = False
        self.n = 0
        self.x, self.y, self.down = W / 2, H / 2, False

    def step(self) -> None:
        self.c.js(f"__vt.advance({DT})")
        if self.rolling:
            self.c.js("__vt.paint()")
            shot = self.c.send("Page.captureScreenshot", format="jpeg", quality=94, fromSurface=True)
            with open(os.path.join(self.dir, f"{self.n:05d}.jpg"), "wb") as f:
                f.write(base64.b64decode(shot["data"]))
            self.n += 1

    def wait(self, seconds: float) -> None:
        for _ in range(round(seconds * FPS)):
            self.step()

    def settle(self, seconds: float) -> None:
        """Off-camera time: let lazy routes load in real time while the clock runs."""
        for _ in range(round(seconds * FPS)):
            self.c.js(f"__vt.advance({DT})")
            time.sleep(0.01)

    def roll(self) -> None:
        self.rolling = True

    def mouse(self, kind: str, x: float, y: float) -> None:
        self.x, self.y = x, y
        self.c.send("Input.dispatchMouseEvent", type=kind, x=x, y=y, button="left",
                    buttons=1 if self.down else 0, clickCount=1)

    def tap(self, x: float, y: float, after: float = 0.0) -> None:
        self.mouse("mouseMoved", x, y)
        self.down = True
        self.mouse("mousePressed", x, y)
        self.step()
        self.down = False
        self.mouse("mouseReleased", x, y)
        self.step()
        self.wait(after)

    def drag(self, pts, frames_per_point: int = 1) -> None:
        self.mouse("mouseMoved", *pts[0])
        self.down = True
        self.mouse("mousePressed", *pts[0])
        self.step()
        for p in pts[1:]:
            self.mouse("mouseMoved", *p)
            for _ in range(frames_per_point):
                self.step()
        self.down = False
        self.mouse("mouseReleased", *pts[-1])
        self.step()

    def label(self, label: str):
        for _ in range(60):
            c = self.c.js(f"""(() => {{ const want = {json.dumps(label)};
              const el = [...document.querySelectorAll('button,[role=button]')]
                .find(e => (e.getAttribute('aria-label') || '').trim() === want || (e.innerText || '').trim() === want);
              if (!el) return null; const r = el.getBoundingClientRect();
              return {{ x: r.left + r.width/2, y: r.top + r.height/2 }}; }})()""")
            if c:
                return c["x"], c["y"]
            self.settle(0.1)
        raise RuntimeError(f"not on screen: {label}")

    def stage(self, view: str):
        m = self.c.js(f"""(() => {{ const s = document.querySelector('svg[viewBox="{view}"]');
          if (!s) return null; const m = s.getScreenCTM(); return {{a:m.a, d:m.d, e:m.e, f:m.f}}; }})()""")
        if not m:
            raise RuntimeError(f"no stage {view}")
        return lambda x, y: (m["a"] * x + m["e"], m["d"] * y + m["f"])


# ── Demo state (mirrors store-captures.py) ──────────────────────────────────

NOW = 1792136460000  # 2026-10-16 07:41 UTC, the frozen page clock's epoch
DAY = 86_400_000


def attempts(pattern: str, source: str, sessions=("s1", "s2")):
    return [{"correct": ch == "1", "session": sessions[min(i * len(sessions) // len(pattern), len(sessions) - 1)],
             "source": source, "at": NOW - (len(pattern) - i) * DAY // 2} for i, ch in enumerate(pattern)]


BASE = {
    "kina-wige-family": {"onboarded": True, "childName": "Keza", "age": 4, "sessionMinutes": 20},
    "kina-wige-language": "KN",
    "kina-wige-stars": 23,
    "kina-wige-stickers": {k: 1 for k in ["cow", "banana", "drum", "gorilla", "hippo", "giraffe", "goat", "avocado",
                                          "elephant", "house", "chicken", "pineapple"]} | {"giraffe": 2, "cow": 2},
    "kina-wige-evidence": {
        "phy.hand.sequence": attempts("01111", "game:karaba"),
        "snd.vowel.recognise": attempts("11011", "lesson:u1l1"),
        "snd.write.trace": attempts("011", "game:andika"),
        "num.shape.build": attempts("1", "game:teranya"),
    },
    "kina-wige-progress": {"episodesWatched": {"bayi-bayi-ingona": True, "isuku": True},
                           "gamesCompleted": {"karaba": 4, "andika": 2, "teranya": 3, "inzira": 2, "siga": 1},
                           "comicsRead": {}, "lessonsCompleted": {"u1l1": 1, "u3l1": 1}},
}


def open_take(c: Chrome, name: str, path: str, extra: dict | None = None) -> Take:
    store = dict(BASE)
    store.update(extra or {})
    sets = "".join(f"localStorage.setItem({json.dumps(k)}, {json.dumps(v if isinstance(v, str) else json.dumps(v))});"
                   for k, v in store.items())
    c.send("Page.navigate", url=BASE_URL + "/")
    c.wait_for_origin()
    c.js("localStorage.clear(); sessionStorage.clear();" + sets + "true")
    c.send("Page.navigate", url=BASE_URL + path)
    t = Take(c, name)
    for _ in range(40):  # wait (in real time) for the route chunk, ticking the clock
        t.settle(0.1)
        if c.js("document.readyState === 'complete' && !!document.querySelector('#root *')"):
            break
    t.settle(1.5)
    return t


def level(game: str, n: int) -> dict:
    return {"kina-wige-game-levels": {game: {"level": n, "up": 0, "down": 0}}}


# ── Scenes ──────────────────────────────────────────────────────────────────

def home(c: Chrome) -> None:
    t = open_take(c, "home", "/home-path")
    t.settle(1.0)
    t.roll()
    t.wait(4.0)


def karaba(c: Chrome) -> None:
    t = open_take(c, "karaba", "/game/karaba", level("karaba", 2))
    t.tap(*t.label("Tangira gukina"))
    t.settle(1.4)
    at = t.stage("0 0 400 600")
    t.roll()
    t.wait(0.5)
    t.tap(*at(225, 548), after=2.4)                         # pedal: water pours
    sx, sy = at(334, 340)
    hx, hy = at(215, 395)
    t.drag([(sx + (hx - sx) * i / 18, sy + (hy - sy) * i / 18) for i in range(19)])  # soap onto the hands
    t.wait(1.0)
    rub = [at(140 + (150 if i % 2 else 0), 360 + (i % 4) * 12) for i in range(72)]
    t.drag(rub, frames_per_point=2)                         # scrub: germs pop, the ring fills
    t.wait(1.6)


def andika(c: Chrome) -> None:
    t = open_take(c, "andika", "/game/andika", level("andika", 1))
    t.tap(*t.label("a e i o u"))
    t.settle(0.8)
    t.roll()
    t.wait(6.0)                                             # Kina's pencil writes "a" first
    at = t.stage("0 0 400 590")
    for d in ["M69 52 A22 22 0 1 0 69 74", "M72 41 V85"]:
        pts = c.js(f"""(() => {{ const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          p.setAttribute('d', {json.dumps(d)}); const s = document.querySelector('svg[viewBox="0 0 400 590"]');
          s.appendChild(p); const L = p.getTotalLength(); const out = [];
          for (let i = 0; i <= 44; i++) {{ const q = p.getPointAtLength(L * i / 44); out.push([q.x, q.y]); }}
          p.remove(); return out; }})()""")
        t.drag([at(50 + 3 * gx, 24 + 3 * gy) for gx, gy in pts])
        t.wait(0.4)
    t.wait(2.6)                                             # the letter turns gold


def teranya(c: Chrome) -> None:
    t = open_take(c, "teranya", "/game/teranya", level("teranya", 1))
    t.tap(*t.label("Inka ku musozi"))
    t.settle(1.2)
    at = t.stage("0 0 400 600")
    t.roll()
    t.wait(0.6)
    for _ in range(4):
        info = c.js("""(() => [...document.querySelectorAll('g[clip-path^="url(#kw-piece-"]')].map(g => {
            const id = Number(g.getAttribute('clip-path').match(/kw-piece-(\\d+)/)[1]);
            const tr = g.parentElement.parentElement.getAttribute('transform') || '';
            const m = /translate\\(([-\\d.]+)[ ,]+([-\\d.]+)\\)/.exec(tr);
            return { id, x: m ? Number(m[1]) : null, y: m ? Number(m[2]) : null };
          }))()""")
        cols = 2 if len(info) == 4 else 3
        rows = max(1, len(info) // cols)
        pw, ph = 360 / cols, 270 / rows
        for p in info:
            col, row = p["id"] % cols, p["id"] // cols
            tx, ty = 20 + col * pw + pw / 2, 16 + row * ph + ph / 2
            if p["x"] is None or abs(p["x"] - tx) + abs(p["y"] - ty) < 2:
                continue
            a, b = at(p["x"], p["y"]), at(tx, ty)
            # ease in-out, like a hand
            pts = []
            for i in range(19):
                k = i / 18
                e = k * k * (3 - 2 * k)
                pts.append((a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e))
            t.drag(pts)
            t.wait(0.45)
            break
    t.wait(3.2)                                             # the picture comes alive


SCENES = {"home": home, "karaba": karaba, "andika": andika, "teranya": teranya}

os.makedirs(OUT, exist_ok=True)
chrome = Chrome()
failed = []
try:
    for name, fn in SCENES.items():
        if ONLY and name not in ONLY:
            continue
        t0 = time.time()
        try:
            fn(chrome)
            n = len(os.listdir(os.path.join(OUT, name)))
            print(f"footage {name}: {n} frames ({n / FPS:.1f}s) in {time.time() - t0:.0f}s", flush=True)
        except Exception as e:  # noqa: BLE001 — one failed scene must not lose the rest
            failed.append(name)
            print(f"FAILED {name}: {e}", flush=True)
finally:
    chrome.close()
sys.exit(1 if failed else 0)
