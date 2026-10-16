#!/usr/bin/env python3
"""Original soundtrack for the Kina Wige launch video. No samples, no licences.

Everything is synthesized here with numpy: a kalimba-style mallet, soft pad,
round bass, gentle kick, finger snap and shaker, in G major at 120 BPM. The
sound effects are tuned to the same key and share the same reverb, so they
sit inside the music rather than on top of it.

Bars land on the video's cuts (3, 7, 11, 15 and 17 s); see index.html.
Usage: music.py <out.wav>
"""

import sys
import wave

import numpy as np

SR = 48_000
DUR = 21.0
N = int(SR * DUR)
BEAT = 0.5                     # 120 BPM
T0 = -1.0                      # beat 0 is at -1 s, so bars start at 3, 7, 11, 15, 17 ...
rng = np.random.default_rng(7)

dry = np.zeros((2, N))
wet_send = np.zeros((2, N))


def bt(b: float) -> float:
    return T0 + b * BEAT


def hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def place(buf: np.ndarray, sig: np.ndarray, t: float, gain: float, pan: float = 0.0, send: float = 0.0) -> None:
    i = int(round(t * SR))
    if i >= N or i + len(sig) <= 0:
        return
    s0 = max(0, -i)
    s1 = min(len(sig), N - i)
    seg = sig[s0:s1] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[0, i + s0:i + s1] += seg * l * 1.414
    buf[1, i + s0:i + s1] += seg * r * 1.414
    if send:
        wet_send[0, i + s0:i + s1] += seg * l * send
        wet_send[1, i + s0:i + s1] += seg * r * send


def env(n: int, attack: float, decay: float) -> np.ndarray:
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-t / decay)


def band(noise: np.ndarray, lo: float, hi: float) -> np.ndarray:
    f = np.fft.rfft(noise)
    fr = np.fft.rfftfreq(len(noise), 1 / SR)
    mask = 1 / (1 + (lo / np.maximum(fr, 1)) ** 4) / (1 + (fr / hi) ** 4)
    return np.fft.irfft(f * mask, len(noise))


# ── Instruments ─────────────────────────────────────────────────────────────

def mallet(midi: float, length: float = 1.6) -> np.ndarray:
    """Kalimba / marimba: a few inharmonic modes, each decaying at its own rate."""
    n = int(length * SR)
    t = np.arange(n) / SR
    f = hz(midi)
    out = np.zeros(n)
    for ratio, amp, dec in [(1.0, 1.0, 0.9), (3.93, 0.28, 0.16), (9.2, 0.07, 0.05), (2.0, 0.06, 0.4)]:
        if f * ratio < SR / 2.2:
            out += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t / dec)
    click = band(rng.standard_normal(int(0.004 * SR)), 1500, 7000) * np.hanning(int(0.004 * SR)) * 0.25
    out[:len(click)] += click
    return out * np.clip(t / 0.002, 0, 1)


def pad(midis, length: float) -> np.ndarray:
    n = int(length * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in midis:
        for det in (-0.07, 0.07):
            f = hz(m + det)
            out += np.sin(2 * np.pi * f * t) + 0.18 * np.sin(4 * np.pi * f * t)
    shape = np.clip(t / 0.45, 0, 1) * np.clip((length - t) / 0.6, 0, 1)
    return out * shape / len(midis)


def bass(midi: float, length: float = 0.42) -> np.ndarray:
    n = int(length * SR)
    t = np.arange(n) / SR
    f = hz(midi)
    out = np.sin(2 * np.pi * f * t) + 0.28 * np.sin(4 * np.pi * f * t) + 0.08 * np.sin(6 * np.pi * f * t)
    return out * env(n, 0.006, 0.22) * np.clip((length - t) / 0.03, 0, 1)


def kick() -> np.ndarray:
    n = int(0.34 * SR)
    t = np.arange(n) / SR
    f = 46 + 95 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(n, 0.002, 0.16)


def snap() -> np.ndarray:
    n = int(0.22 * SR)
    x = band(rng.standard_normal(n), 900, 3600)
    e = env(n, 0.001, 0.045)
    e[int(0.012 * SR):] += 0.35 * env(n - int(0.012 * SR), 0.001, 0.06)  # the second tap of a snap
    return x * e / (np.abs(x).max() + 1e-9)


def shaker() -> np.ndarray:
    n = int(0.09 * SR)
    x = band(rng.standard_normal(n), 5000, 14000)
    return x * env(n, 0.012, 0.03) / (np.abs(x).max() + 1e-9)


def air(length: float, lo: float = 400, hi: float = 3500) -> np.ndarray:
    """A soft filtered-noise swell for transitions."""
    n = int(length * SR)
    t = np.arange(n) / SR
    x = band(rng.standard_normal(n), lo, hi)
    shape = np.sin(np.pi * np.clip(t / length, 0, 1)) ** 2.2
    return x * shape / (np.abs(x).max() + 1e-9)


def pop(f0: float = 900, f1: float = 320) -> np.ndarray:
    n = int(0.07 * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.012)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.025)


# ── Score ───────────────────────────────────────────────────────────────────

CHORDS = {  # mallet ostinato (8 eighths), pad, bass root
    "G":  ([74, 79, 83, 79, 74, 79, 81, 83], [55, 59, 62], 43),
    "Em": ([71, 76, 79, 76, 71, 76, 79, 81], [52, 55, 59], 40),
    "C":  ([72, 76, 79, 76, 72, 76, 79, 81], [48, 52, 55], 36),
    "D":  ([74, 78, 81, 78, 74, 78, 81, 83], [50, 54, 57], 38),
}
ACCENT = [1.0, 0.5, 0.74, 0.48, 0.86, 0.52, 0.7, 0.58]

# Intro (0-3 s): the hook, mallet and pad alone.
place(dry, pad([55, 59, 62, 67], 3.4), 0.0, 0.10, send=0.5)
place(dry, pop(), 0.12, 0.10)
for i, m in enumerate([67, 71, 74]):                      # "Muraho!" lands on a G chord
    place(dry, mallet(m + 12, 2.0), 0.12 + i * 0.018, 0.34, pan=(i - 1) * 0.3, send=0.35)
for i, m in enumerate([79, 81, 83, 86, 88, 91]):          # one soft note per word of the line
    place(dry, mallet(m, 1.0), 0.95 + i * 0.07, 0.11, pan=(-0.3 + 0.12 * i), send=0.4)
for b, m in [(6.0, 74), (6.5, 76), (7.0, 79), (7.5, 81)]:  # pickup into the reveal
    place(dry, mallet(m, 1.0), bt(b), 0.2 + (b - 6) * 0.05, pan=0.15, send=0.3)
place(dry, air(0.5), 2.62, 0.035, send=0.3)

# Groove (3-17 s): bars from beat 8.
progression = ["G", "Em", "C", "D", "G", "C", "D"]  # 4-beat bars at t = 3, 5 ... 15; D resolves to G at 17
for bar, name in enumerate(progression):
    b0 = 8 + bar * 4
    notes, chord, root = CHORDS[name]
    place(dry, pad(chord, 4 * BEAT + 0.3), bt(b0), 0.075, send=0.5)
    for i, m in enumerate(notes):
        sparkle = bar >= 4 and i % 4 == 3
        place(dry, mallet(m + (12 if sparkle else 0), 1.2), bt(b0 + i * 0.5),
              0.24 * ACCENT[i] * (0.8 if sparkle else 1), pan=0.22 if i % 2 else -0.22, send=0.28)
    for off, m in [(0, root), (1.5, root), (2.5, root + 7), (3.0, root + 12 if bar % 2 else root)]:
        place(dry, bass(m), bt(b0 + off), 0.30)
    for k in range(4):
        place(dry, kick(), bt(b0 + k), 0.52 if k in (0, 2) else 0.34)
    for k in (1, 3):
        place(dry, snap(), bt(b0 + k), 0.13, pan=-0.15, send=0.35)
    for k in range(8):
        swing = 0.03 if k % 2 else 0.0
        place(dry, shaker(), bt(b0 + k * 0.5) + swing, 0.05 if k % 2 else 0.032, pan=0.35)

# Transitions: low air under each cut, title pops tuned to the key.
for cut in (6.62, 10.62, 13.62):
    place(dry, air(0.42), cut, 0.03, send=0.3)
for t in (7.18, 11.18, 14.18):
    place(dry, mallet(86, 1.2), t, 0.12, pan=-0.25, send=0.45)
    place(dry, pop(1100, 420), t, 0.05)
for t in []:                                               # puzzle snaps, set once the footage timing is known
    place(dry, pop(700, 250), t, 0.10)

# Outro (17 s): the G chord rings, the groove eases out, a last bell at 19 s.
place(dry, air(0.7, 2500, 12000), 16.35, 0.035, send=0.4)
for i, m in enumerate([55, 59, 62, 67, 71, 74, 79]):
    place(dry, mallet(m + 12, 2.6), 17.0 + i * 0.035, 0.24, pan=-0.45 + i * 0.15, send=0.45)
place(dry, pad([55, 59, 62, 67, 71], 4.2), 17.0, 0.11, send=0.6)
place(dry, bass(31, 1.6), 17.0, 0.36)
place(dry, bass(43, 1.4), 17.0, 0.22)
place(dry, kick(), 17.0, 0.5)
for k in range(1, 4):                                       # half-time groove to 19 s
    place(dry, kick(), 17.0 + k * 0.5, 0.26 if k == 2 else 0.18)
    place(dry, shaker(), 17.0 + k * 0.5 + 0.25, 0.028, pan=0.35)
place(dry, snap(), 18.0, 0.10, pan=-0.15, send=0.4)
place(dry, mallet(91, 2.0), 17.38, 0.12, send=0.5)          # logo lands
place(dry, pop(1000, 380), 18.32, 0.05)                     # badge
for i, m in enumerate([67, 74, 79, 83]):
    place(dry, mallet(m + 12, 2.6), 19.0 + i * 0.05, 0.2 - i * 0.025, pan=-0.2 + 0.13 * i, send=0.6)
place(dry, bass(43, 1.8), 19.0, 0.2)


# ── Mix ─────────────────────────────────────────────────────────────────────

def reverb(x: np.ndarray, seconds: float = 1.4, seed: int = 0) -> np.ndarray:
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = np.random.default_rng(seed).standard_normal(n) * np.exp(-t / (seconds / 6.5))
    ir = band(ir, 180, 7000)
    ir[: int(0.012 * SR)] = 0                                # a short pre-delay
    ir /= np.sqrt((ir ** 2).sum())
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return y


mix = dry + 0.42 * np.vstack([reverb(wet_send[0], seed=1), reverb(wet_send[1], seed=2)])
mix -= mix.mean(axis=1, keepdims=True)

# gentle bus compression via soft saturation, then -1 dBFS peak
mix /= np.abs(mix).max() + 1e-9
mix = np.tanh(1.15 * mix) / np.tanh(1.15)
fade = np.ones(N)
fade[: int(0.01 * SR)] = np.linspace(0, 1, int(0.01 * SR))
tail = int(0.9 * SR)
fade[-tail:] = np.linspace(1, 0, tail) ** 1.6
mix *= fade


def groove_rms(x):
    return 20 * np.log10(np.sqrt((x[:, int(3 * SR):int(17 * SR)] ** 2).mean()) + 1e-12)


# about -14 LUFS for this material (social platforms normalise there), never above -1 dBFS peak
mix *= min(10 ** ((-16.0 - groove_rms(mix)) / 20), 0.891 / (np.abs(mix).max() + 1e-9))
rms = groove_rms(mix)
pcm = (np.clip(mix.T, -1, 1) * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
peak = 20 * np.log10(np.abs(mix).max() + 1e-12)
print(f"music: {DUR:.1f}s, peak {peak:.1f} dBFS, groove RMS {rms:.1f} dBFS -> {sys.argv[1]}")
