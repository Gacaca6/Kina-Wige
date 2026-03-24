import { useCallback, useRef, useEffect } from 'react';

type SoundName =
  | 'tap' | 'water_on' | 'soap_squish' | 'germ_pop_1' | 'germ_pop_2'
  | 'germ_pop_3' | 'germ_pop_4' | 'germ_pop_5' | 'germ_scared'
  | 'scrub_bubble' | 'rinse_splash' | 'dry_cloth' | 'clean_chime'
  | 'victory_fanfare' | 'star_ding' | 'step_complete'
  | 'success' | 'error';

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

  play(name: SoundName) {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    
    switch (name) {
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

  const play = useCallback((name: SoundName) => {
    engine.play(name);
  }, []);

  return { play };
}

export function useHaptic() {
  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  }, []);

  return {
    lightTap: () => vibrate(30),
    mediumTap: () => vibrate(50),
    success: () => vibrate([50, 30, 50, 30, 100])
  };
}
