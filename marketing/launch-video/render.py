#!/usr/bin/env python3
"""Render the Kina Wige launch video, frame by frame.

Serves the repo root over HTTP (fonts from node_modules, footage from
<footage-dir>), loads index.html in headless Chrome, calls renderAt(t) for
every frame and pipes the screenshots into ffmpeg with the soundtrack.

Usage: render.py <footage-dir> <out-dir> [--stills-only] [--format landscape|vertical]
"""

import base64
import functools
import http.server
import json
import os
import shutil
import subprocess
import sys
import tempfile
import threading
import time
import urllib.request
from pathlib import Path

import websocket  # websocket-client

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
FOOTAGE = Path(sys.argv[1]).resolve()
OUT = Path(sys.argv[2]).resolve()
STILLS_ONLY = "--stills-only" in sys.argv
ONLY_FORMAT = sys.argv[sys.argv.index("--format") + 1] if "--format" in sys.argv else None
FPS, DURATION, POSTER_T = 30, 21.0, 19.6
FORMATS = {"landscape": (1920, 1080), "vertical": (1080, 1920)}
STILL_TIMES = [0.6, 2.4, 3.05, 4.6, 6.8, 7.0, 8.6, 10.85, 12.6, 14.0, 15.8, 17.3, 18.4, 19.6, 20.9]
PORT_HTTP, PORT_CDP = 8765, 9334
OUT.mkdir(parents=True, exist_ok=True)


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = path.split("?", 1)[0]
        if p.startswith("/footage/"):
            return str(FOOTAGE / p[len("/footage/"):])
        return super().translate_path(path)

    def log_message(self, *a):
        pass


def serve() -> None:
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", PORT_HTTP), functools.partial(Handler, directory=str(ROOT)))
    threading.Thread(target=httpd.serve_forever, daemon=True).start()


class Chrome:
    def __init__(self, w: int, h: int) -> None:
        exe = os.environ.get("CHROME") or shutil.which("google-chrome") or shutil.which("chromium")
        self.profile = tempfile.mkdtemp(prefix="kw-render-")
        self.proc = subprocess.Popen([
            exe, "--headless=new", f"--remote-debugging-port={PORT_CDP}", f"--user-data-dir={self.profile}",
            "--no-first-run", "--no-default-browser-check", "--mute-audio", "--hide-scrollbars",
            "--force-color-profile=srgb", "--font-render-hinting=none", "--disable-gpu-vsync",
            f"--window-size={w},{h}", "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(80):
            try:
                with urllib.request.urlopen(f"http://127.0.0.1:{PORT_CDP}/json/list", timeout=2) as r:
                    pages = [t for t in json.load(r) if t.get("type") == "page"]
                if pages:
                    self.ws = websocket.create_connection(pages[0]["webSocketDebuggerUrl"], timeout=120,
                                                          suppress_origin=True)
                    break
            except Exception:  # noqa: BLE001
                pass
            time.sleep(0.25)
        else:
            raise SystemExit("Chrome did not start")
        self.mid = 0
        self.send("Page.enable")
        self.send("Emulation.setDeviceMetricsOverride", width=w, height=h, deviceScaleFactor=1, mobile=False)

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
            raise RuntimeError(f"page script failed: {r['exceptionDetails']}")
        return r.get("result", {}).get("value")

    def frame(self, t: float, fmt: str = "png") -> bytes:
        self.js(f"renderAt({t:.5f})")
        r = self.send("Page.captureScreenshot", format=fmt, **({"quality": 95} if fmt == "jpeg" else {}))
        return base64.b64decode(r["data"])

    def close(self) -> None:
        self.proc.terminate()
        try:
            self.proc.wait(timeout=10)
        except subprocess.TimeoutExpired:
            self.proc.kill()
        shutil.rmtree(self.profile, ignore_errors=True)


def footage_counts() -> dict:
    return {d.name: len(list(d.glob("*.jpg"))) for d in FOOTAGE.iterdir() if d.is_dir()}


def render(fmt: str, music: Path | None) -> None:
    w, h = FORMATS[fmt]
    c = Chrome(w, h)
    try:
        c.send("Page.addScriptToEvaluateOnNewDocument",
               source=f"window.FOOTAGE_FRAMES = {json.dumps(footage_counts())};")
        c.send("Page.navigate", url=f"http://127.0.0.1:{PORT_HTTP}/marketing/launch-video/index.html?format={fmt}")
        for _ in range(100):
            time.sleep(0.2)
            try:
                if c.js("!!window.ready && window.ready.then(() => true)"):
                    break
            except RuntimeError:
                pass
        stills = OUT / "stills"
        stills.mkdir(exist_ok=True)
        for t in STILL_TIMES:
            (stills / f"{fmt}-{t:05.2f}.jpg").write_bytes(c.frame(t, "jpeg"))
        size = f"{w}x{h}"
        (OUT / f"poster-{size}.jpg").write_bytes(c.frame(POSTER_T, "jpeg"))
        if STILLS_ONLY:
            return
        out = OUT / f"kina-wige-launch-{size}.mp4"
        cmd = ["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "png", "-i", "-"]
        if music:
            cmd += ["-i", str(music)]
        cmd += ["-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-profile:v", "high",
                "-r", str(FPS), "-movflags", "+faststart"]
        if music:
            cmd += ["-c:a", "aac", "-b:a", "192k", "-shortest"]
        cmd += [str(out)]
        ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        n = round(DURATION * FPS)
        t0 = time.time()
        for i in range(n):
            # Frame 0 is the poster, so every platform's thumbnail shows the settled outro.
            ff.stdin.write(c.frame(POSTER_T if i == 0 else i / FPS))
            if i % 90 == 0:
                print(f"{fmt}: frame {i}/{n} ({time.time() - t0:.0f}s)", flush=True)
        ff.stdin.close()
        if ff.wait() != 0:
            raise SystemExit(f"ffmpeg failed for {fmt}")
        print(f"rendered {out.name}", flush=True)
    finally:
        c.close()


serve()
music = OUT / "kina-wige-launch-music.wav"
if not STILLS_ONLY:
    subprocess.run([sys.executable, str(HERE / "music.py"), str(music)], check=True)
for fmt in FORMATS:
    if ONLY_FORMAT and fmt != ONLY_FORMAT:
        continue
    render(fmt, None if STILLS_ONLY else music)
