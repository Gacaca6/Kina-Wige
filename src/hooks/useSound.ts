import { useCallback, useEffect } from 'react';
import { REST_EVENT } from '../components/ui/restEvent';

type SoundName =
  | 'tap' | 'water_on' | 'soap_squish' | 'germ_pop_1' | 'germ_pop_2'
  | 'germ_pop_3' | 'germ_pop_4' | 'germ_pop_5' | 'germ_scared'
  | 'scrub_bubble' | 'rinse_splash' | 'dry_cloth' | 'clean_chime'
  | 'victory_fanfare' | 'star_ding' | 'step_complete'
  | 'success' | 'error'
  // The game kit's palette (docs/GAMES-DESIGN.md §3). 'boop' is the gentle
  // not-quite sound — a soft falling note, never a buzzer.
  | 'pop' | 'snap' | 'whoosh' | 'sparkle' | 'boop' | 'pour' | 'pedal'
  | 'squeak' | 'tick' | 'paint' | 'sticker' | 'rub' | 'step';

/** A note in a tune: frequency in Hz (0 = rest) and length in beats. */
export type TuneNote = [number, number];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.5;
    this.masterGain.connect(this.ctx.destination);
  }

  /** Play time is over: silence everything at once (tunes included). */
  rest() {
    this.tuneGain?.disconnect();
    this.tuneGain = null;
    this.ctx?.suspend().catch(() => {});
  }

  private tuneGain: GainNode | null = null;

  private tone(freq: number, start: number, dur: number, type: OscillatorType, vol: number, out?: AudioNode, glideTo?: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, start + dur);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + Math.min(0.02, dur / 4));
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(gain);
    gain.connect(out ?? this.masterGain!);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  private noise(start: number, dur: number, filter: BiquadFilterType, freq: number, vol: number, freqEnd?: number) {
    const ctx = this.ctx!;
    const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const f = ctx.createBiquadFilter();
    f.type = filter;
    f.frequency.setValueAtTime(freq, start);
    if (freqEnd) f.frequency.exponentialRampToValueAtTime(freqEnd, start + dur);
    f.Q.value = 1.2;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + Math.min(0.05, dur / 4));
    gain.gain.linearRampToValueAtTime(0, start + dur);
    src.connect(f);
    f.connect(gain);
    gain.connect(this.masterGain!);
    src.start(start);
  }

  /**
   * A looping tune (the handwashing song). Returns a stop function. Soft
   * triangle voice so it sits under the game's sounds, never over them.
   */
  playTune(notes: TuneNote[], bpm = 132, loop = true): () => void {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return () => {};
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.value = 0.55;
    out.connect(this.masterGain);
    this.tuneGain = out;
    const beat = 60 / bpm;
    const length = notes.reduce((s, n) => s + n[1], 0) * beat;
    let alive = true;
    let timer = 0;
    const schedule = (at: number) => {
      let t = at;
      for (const [f, beats] of notes) {
        if (f > 0) this.tone(f, t, beats * beat * 0.92, 'triangle', 0.22, out);
        t += beats * beat;
      }
      if (loop) {
        timer = window.setTimeout(() => alive && schedule(at + length), Math.max(0, (at + length - ctx.currentTime - 0.3) * 1000));
      }
    };
    schedule(ctx.currentTime + 0.05);
    return () => {
      alive = false;
      window.clearTimeout(timer);
      out.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
      window.setTimeout(() => out.disconnect(), 400);
    };
  }

  play(name: SoundName, pitch = 1) {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;

    switch (name) {
      case 'pop':
        this.tone(420 * pitch, t, 0.12, 'sine', 0.45, undefined, 900 * pitch);
        break;
      case 'snap':
        // A wooden "tock" + a bright confirmation note: the piece is home.
        this.noise(t, 0.05, 'bandpass', 1800, 0.35);
        this.tone(660 * pitch, t + 0.03, 0.18, 'sine', 0.3);
        this.tone(990 * pitch, t + 0.09, 0.22, 'sine', 0.22);
        break;
      case 'whoosh':
        this.noise(t, 0.35, 'bandpass', 600, 0.18, 2400);
        break;
      case 'sparkle':
        [1568, 2093, 2637].forEach((f, i) => this.tone(f * pitch, t + i * 0.06, 0.25, 'sine', 0.14));
        break;
      case 'boop':
        // Gentle "not that one": a soft falling two-note, quieter than success.
        this.tone(392, t, 0.16, 'sine', 0.22, undefined, 330);
        this.tone(330, t + 0.14, 0.2, 'sine', 0.18, undefined, 294);
        break;
      case 'pour':
        this.noise(t, 1.4, 'bandpass', 900, 0.22, 500);
        this.noise(t + 0.1, 1.2, 'highpass', 3000, 0.06);
        break;
      case 'pedal':
        this.tone(140, t, 0.12, 'square', 0.12, undefined, 90);
        this.noise(t, 0.08, 'lowpass', 600, 0.25);
        break;
      case 'squeak':
        this.tone(900 * pitch, t, 0.1, 'sine', 0.2, undefined, 1400 * pitch);
        break;
      case 'tick':
        this.tone(880 * pitch, t, 0.07, 'sine', 0.16);
        break;
      case 'paint':
        this.noise(t, 0.18, 'bandpass', 1400 * pitch, 0.2, 500);
        this.tone(520 * pitch, t + 0.02, 0.18, 'sine', 0.16, undefined, 780 * pitch);
        break;
      case 'sticker':
        [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, t + i * 0.08, 0.3, 'triangle', 0.2));
        break;
      case 'rub':
        this.noise(t, 0.16, 'bandpass', 2600 * pitch, 0.08);
        break;
      case 'step':
        this.tone(523, t, 0.14, 'sine', 0.26);
        this.tone(784, t + 0.11, 0.24, 'sine', 0.24);
        break;

      case 'tap': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.05);
        break;
      }
      case 'water_on': {
        const bufferSize = this.ctx.sampleRate * 0.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 400;
        filter.Q.value = 1;
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.1);
        gain.gain.linearRampToValueAtTime(0, t + 0.5);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(t);
        break;
      }
      case 'soap_squish': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.4, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.2);
        break;
      }
      case 'germ_pop_1':
      case 'germ_pop_2':
      case 'germ_pop_3':
      case 'germ_pop_4':
      case 'germ_pop_5': {
        const freqs = { germ_pop_1: 300, germ_pop_2: 400, germ_pop_3: 500, germ_pop_4: 600, germ_pop_5: 700 };
        const freq = freqs[name as keyof typeof freqs];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 2, t + 0.1);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.5, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.15);
        break;
      }
      case 'star_ding': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046, t); // C6
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.4);
        break;
      }
      case 'victory_fanfare': {
        const notes = [
          { f: 523, d: 0.3, start: 0 }, // C5
          { f: 659, d: 0.3, start: 0.3 }, // E5
          { f: 784, d: 0.6, start: 0.6 }  // G5
        ];
        notes.forEach(note => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note.f, t + note.start);
          gain.gain.setValueAtTime(0, t + note.start);
          gain.gain.linearRampToValueAtTime(0.3, t + note.start + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, t + note.start + note.d);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(t + note.start);
          osc.stop(t + note.start + note.d);
        });
        break;
      }
      case 'germ_scared': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.1);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
      }
      case 'scrub_bubble': {
        const bufferSize = this.ctx.sampleRate * 0.2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 2;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(t);
        break;
      }
      case 'rinse_splash': {
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, t);
        filter.frequency.exponentialRampToValueAtTime(300, t + 0.4);
        filter.Q.value = 1;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.25, t + 0.05);
        gain.gain.linearRampToValueAtTime(0, t + 0.4);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(t);
        break;
      }
      case 'dry_cloth': {
        const bufferSize = this.ctx.sampleRate * 0.3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.1);
        gain.gain.linearRampToValueAtTime(0, t + 0.3);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(t);
        break;
      }
      case 'clean_chime': {
        const notes = [
          { f: 523, start: 0, d: 0.2 },
          { f: 659, start: 0.2, d: 0.3 }
        ];
        notes.forEach(note => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.f, t + note.start);
          gain.gain.setValueAtTime(0, t + note.start);
          gain.gain.linearRampToValueAtTime(0.3, t + note.start + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.01, t + note.start + note.d);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(t + note.start);
          osc.stop(t + note.start + note.d);
        });
        break;
      }
      case 'step_complete': {
        const notes = [
          { f: 392, start: 0, d: 0.15 },
          { f: 523, start: 0.15, d: 0.15 }
        ];
        notes.forEach(note => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.f, t + note.start);
          gain.gain.setValueAtTime(0, t + note.start);
          gain.gain.linearRampToValueAtTime(0.3, t + note.start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, t + note.start + note.d);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(t + note.start);
          osc.stop(t + note.start + note.d);
        });
        break;
      }
      case 'success': {
        // Same as clean_chime
        const sNotes = [
          { f: 523, start: 0, d: 0.2 },
          { f: 659, start: 0.2, d: 0.3 }
        ];
        sNotes.forEach(note => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.f, t + note.start);
          gain.gain.setValueAtTime(0, t + note.start);
          gain.gain.linearRampToValueAtTime(0.3, t + note.start + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.01, t + note.start + note.d);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(t + note.start);
          osc.stop(t + note.start + note.d);
        });
        break;
      }
      case 'error': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.2);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.2);
        break;
      }
      default:
        break;
    }
  }
}

const engine = new SoundEngine();

// When play time ends, every game goes quiet at once — including a tune that
// is mid-loop. The next sound after rest (a grown-up's new session) resumes.
if (typeof window !== 'undefined') {
  window.addEventListener(REST_EVENT, () => engine.rest());
}

export function useSound() {
  useEffect(() => {
    const initAudio = () => engine.init();
    window.addEventListener('touchstart', initAudio, { once: true });
    window.addEventListener('click', initAudio, { once: true });
    return () => {
      window.removeEventListener('touchstart', initAudio);
      window.removeEventListener('click', initAudio);
    };
  }, []);

  const play = useCallback((name: SoundName, pitch?: number) => {
    engine.play(name, pitch);
  }, []);

  const playTune = useCallback((notes: TuneNote[], bpm?: number, loop?: boolean) => engine.playTune(notes, bpm, loop), []);

  return { play, playTune };
}

// Haptics. In the Android app these need android.permission.VIBRATE in the
// manifest — without it navigator.vibrate silently does nothing.
export function useHaptic() {
  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  }, []);

  return {
    tick: () => vibrate(12),
    lightTap: () => vibrate(30),
    mediumTap: () => vibrate(50),
    success: () => vibrate([50, 30, 50, 30, 100])
  };
}
