#!/usr/bin/env python3
"""Kina Wige — Android smoke test.

Runs inside the CI emulator (.github/workflows/android.yml) against the debug
APK. It drives the real app with real taps and the real back button, the way
a parent and a child would, and fails the build if any of these break:

  * the app starts and shows setup on first launch (not a blank screen, not
    the "update your WebView" fallback)
  * setup can be completed, and the hardware back button steps back through it
  * back on the child's home sends the app to the background — it is not killed
  * closing and reopening the app returns to the child's home, not to setup
  * the grown-up door (press and hold the greeting) opens the parent gate
  * a video plays from inside the app
  * no crash, and no uncaught JavaScript error, anywhere in the run

Screenshots of every step and the full log are kept as CI artifacts.

Usage: android-smoke.py <app-debug.apk> <output-dir>
"""

import os
import re
import subprocess
import sys
import time
import xml.etree.ElementTree as ET

PKG = "rw.kinawige.app"
# The child's home. Its greeting doubles as the hidden grown-up door, so
# Android's accessibility tree announces it by the door's label, "Grown-ups".
HOME = "Grown-ups"
ACTIVITY = f"{PKG}/.MainActivity"
APK = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else "smoke"
os.makedirs(OUT, exist_ok=True)

results: list[tuple[str, bool, str]] = []
shot_no = 0


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


def dump_xml() -> str:
    """The screen's accessibility tree. Android 12's uiautomator crashes (an NPE
    inside the dump tool itself, not in the app) when a node disappears
    mid-dump, which happens during animations. So: delete the previous dump
    first — a failed dump must never leave a stale screen to be read — then
    retry, alternating the compressed mode, which walks fewer nodes."""
    for attempt in range(6):
        adb("shell", "rm", "-f", "/sdcard/ui.xml", check=False)
        args = ["shell", "uiautomator", "dump"] + (["--compressed"] if attempt % 2 else []) + ["/sdcard/ui.xml"]
        out = adb(*args, check=False)
        if "dumped to" in out:
            raw = adb("exec-out", "cat", "/sdcard/ui.xml", check=False)
            if raw.strip().startswith("<?xml"):
                return raw
        time.sleep(0.8)
    return ""


def nodes() -> list[tuple[str, tuple[int, int, int, int]]]:
    """Every on-screen node with a label, from the accessibility tree (the
    WebView exposes its DOM text there), with its bounds."""
    raw = dump_xml()
    try:
        root = ET.fromstring(raw)
    except ET.ParseError:
        return []
    found = []
    for n in root.iter("node"):
        m = re.match(r"\[(\d+),(\d+)\]\[(\d+),(\d+)\]", n.get("bounds", ""))
        if not m:
            continue
        b = tuple(int(v) for v in m.groups())
        for label in (n.get("text") or "", n.get("content-desc") or ""):
            if label.strip():
                found.append((label.strip(), b))
    return found


def find(text: str, exact: bool = False):
    want = text.casefold()
    for label, b in nodes():
        have = label.casefold()
        if (have == want) if exact else (want in have):
            return b
    return None


def wait_for(text: str, timeout: float = 45, exact: bool = False):
    end = time.time() + timeout
    while time.time() < end:
        b = find(text, exact)
        if b:
            return b
        time.sleep(1.5)
    return None


def tap(text: str, timeout: float = 30, exact: bool = True) -> None:
    b = wait_for(text, timeout, exact)
    if not b:
        shot("missing-" + re.sub(r"\W+", "-", text)[:30])
        raise AssertionError(f"not on screen: {text!r}")
    adb("shell", "input", "tap", str((b[0] + b[2]) // 2), str((b[1] + b[3]) // 2))
    time.sleep(1.2)


def hold(text: str, ms: int = 3600) -> None:
    b = wait_for(text, 30, exact=False)
    if not b:
        raise AssertionError(f"not on screen to hold: {text!r}")
    x, y = (b[0] + b[2]) // 2, (b[1] + b[3]) // 2
    # A swipe that does not move is a long press of the given length.
    adb("shell", "input", "swipe", str(x), str(y), str(x), str(y), str(ms))
    time.sleep(1.5)


def back() -> None:
    adb("shell", "input", "keyevent", "KEYCODE_BACK")
    time.sleep(1.8)


def launch() -> None:
    adb("shell", "am", "start", "-W", "-n", ACTIVITY)
    time.sleep(2)


def running() -> bool:
    return bool(adb("shell", "pidof", PKG, check=False).strip())


def in_front() -> bool:
    acts = adb("shell", "dumpsys", "activity", "activities", check=False)
    resumed = [l for l in acts.splitlines() if "ResumedActivity" in l]
    return any(PKG in l for l in resumed)


def check(name: str, ok, detail: str = "") -> bool:
    results.append((name, bool(ok), detail))
    print(("PASS  " if ok else "FAIL  ") + name + (f"  ({detail})" if detail else ""), flush=True)
    return bool(ok)


def step(name: str, fn) -> None:
    """Run one scripted step; a failure is recorded and the run continues where it can."""
    try:
        fn()
    except Exception as e:  # noqa: BLE001 — every failure must reach the report
        check(name, False, str(e))


# ─────────────────────────────────────────────────────────────────────────────

sdk = adb("shell", "getprop", "ro.build.version.sdk").strip()
release = adb("shell", "getprop", "ro.build.version.release").strip()
wv = adb("shell", "dumpsys", "webviewupdate", check=False)
m = re.search(r"Current WebView package \(name, version\): \(([^,]+), ([^)]+)\)", wv)
webview = m.group(2).strip() if m else "unknown"
print(f"Android {release} (API {sdk}) · WebView {webview}", flush=True)

adb("install", "-r", "-g", APK, timeout=300)
adb("logcat", "-c")
launch()


def first_launch():
    b = wait_for("Ikinyarwanda", timeout=90, exact=True)
    shot("first-launch-setup")
    check("first launch shows setup", b)
    check("old-engine fallback is not shown", not find("Android System WebView"))


def setup_and_back():
    tap("English")
    check("language step leads to the grown-up welcome", wait_for("Welcome, grown-up"))
    shot("setup-welcome")
    # When the stylesheet fails to apply, everything still works but looks
    # broken: "Next" shrinks to a small default button. Styled, it spans the
    # screen. This is the check that catches an unstyled app.
    nxt = wait_for("Next", exact=True)
    width = int(re.search(r"(\d+)x\d+", adb("shell", "wm", "size")).group(1))
    check("page is styled (Next button spans the screen)",
          nxt and (nxt[2] - nxt[0]) > width * 0.7,
          f"button {nxt[2] - nxt[0] if nxt else 0}px of {width}px")
    tap("Next")
    check("next step: your child", wait_for("Your child", exact=True))
    back()
    check("hardware back steps back through setup", wait_for("Welcome, grown-up"))
    tap("Next")
    wait_for("Your child", exact=True)
    tap("Next")
    check("play-time step", wait_for("Play time", exact=True))
    shot("setup-play-time")
    tap("Next")
    check("last step: child sees only their screens", wait_for("Your child sees only their screens"))
    shot("setup-lock")
    tap("Let's play!")
    check("setup finishes on the child's home", wait_for(HOME))
    shot("child-home")


def back_on_home():
    back()
    time.sleep(1)
    check("back on home keeps the app alive", running())
    check("back on home moves the app to the background", not in_front())
    launch()
    check("reopening returns to the child's home, not setup", wait_for(HOME) and not find("Ikinyarwanda", exact=True))


def survives_close():
    adb("shell", "am", "force-stop", PKG)
    time.sleep(1)
    launch()
    check("after closing the app, setup is remembered", wait_for(HOME, timeout=60))


def grown_up_door():
    hold(HOME)
    check("press-and-hold opens the parent gate", wait_for("Grown-ups only"))
    shot("parent-gate")
    back()
    check("back from the gate returns to the child's home", wait_for(HOME))


def video():
    tap("Episodes", exact=False)
    check("episodes list", wait_for("Bayi Bayi Ingona"))
    shot("episodes")
    tap("Bayi Bayi Ingona", exact=False)
    check("episode opens", wait_for("Tap to play!", timeout=30) or wait_for("Play", exact=True, timeout=5))
    play = find("Tap to play!") or find("Play", exact=True)
    if not play:
        raise AssertionError("no play control on the episode screen")
    cx, cy = str((play[0] + play[2]) // 2), str((play[1] + play[3]) // 2)
    adb("shell", "input", "tap", cx, cy)
    time.sleep(7)
    shot("video-playing")
    # The player hides its controls 3 s after playback starts; a tap on the
    # picture brings them back. "Pause" showing means the video is playing.
    adb("shell", "input", "tap", cx, cy)
    time.sleep(1)
    check("video is playing (pause control showing)", find("Pause", exact=True))
    shot("video-controls")


for name, fn in [
    ("first launch", first_launch),
    ("setup", setup_and_back),
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
# Only Kina Wige's own process. (Android 12's uiautomator crashes on its own;
# that is the test tool, and its crash report names no app process.)
crash = [l for l in log.splitlines() if f"Process: {PKG}" in l or (PKG in l and "has died" in l)]
check("no native crash", not crash, crash[0] if crash else "")
js_errors = [
    l for l in log.splitlines()
    if ("Capacitor/Console" in l or "chromium" in l)
    and re.search(r"Uncaught|TypeError|ReferenceError|SyntaxError", l)
    # Capacitor's SystemBars writes the safe-area variables when Android first
    # reports the bar sizes, which can be before the page exists; it re-requests
    # the sizes when the page commits and the second write succeeds (the
    # screenshots show headers clear of the status bar). Known and harmless.
    and "Error injecting safe area CSS" not in l
]
check("no uncaught JavaScript error", not js_errors, js_errors[0][:200] if js_errors else "")

# ── Report ──
passed = sum(1 for _, ok, _ in results if ok)
lines = [f"# Kina Wige smoke test — Android {release} (API {sdk}), WebView {webview}", "",
         f"**{passed}/{len(results)} checks passed**", "", "| Check | Result | Detail |", "|---|---|---|"]
lines += [f"| {n} | {'PASS' if ok else 'FAIL'} | {d.replace('|', '/')} |" for n, ok, d in results]
with open(os.path.join(OUT, "summary.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")
print(f"\n{passed}/{len(results)} checks passed", flush=True)
sys.exit(0 if passed == len(results) else 1)
