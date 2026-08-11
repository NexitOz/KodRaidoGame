'use client';

import { useSettingsStore } from './settings-store';

export type SfxCue =
  | 'card-select'
  | 'card-play'
  | 'attack'
  | 'unit-death'
  | 'turn-end'
  | 'rune-trigger'
  | 'track-play'
  | 'resonance-trigger'
  | 'raido-reveal'
  | 'match-win'
  | 'match-loss';

interface Tone {
  frequency: number;
  durationMs: number;
  type: OscillatorType;
  delayMs?: number;
}

/**
 * No licensed audio in this repo, so cues are short synthesized tones
 * (Web Audio oscillators) rather than sample playback — genuinely
 * functional feedback without pretending to ship real sound design.
 */
const CUES: Record<SfxCue, Tone[]> = {
  'card-select': [{ frequency: 520, durationMs: 40, type: 'sine' }],
  'card-play': [{ frequency: 440, durationMs: 90, type: 'triangle' }],
  attack: [{ frequency: 220, durationMs: 70, type: 'sawtooth' }],
  'unit-death': [{ frequency: 160, durationMs: 160, type: 'square' }],
  'turn-end': [{ frequency: 330, durationMs: 60, type: 'sine' }],
  'rune-trigger': [
    { frequency: 349.23, durationMs: 100, type: 'triangle' },
    { frequency: 523.25, durationMs: 140, type: 'triangle', delayMs: 60 },
  ],
  'track-play': [
    { frequency: 261.63, durationMs: 80, type: 'sine' },
    { frequency: 392, durationMs: 120, type: 'sine', delayMs: 70 },
  ],
  'resonance-trigger': [{ frequency: 587.33, durationMs: 160, type: 'triangle' }],
  'raido-reveal': [
    { frequency: 130.81, durationMs: 180, type: 'sawtooth' },
    { frequency: 261.63, durationMs: 220, type: 'triangle', delayMs: 90 },
  ],
  'match-win': [
    { frequency: 523.25, durationMs: 120, type: 'triangle' },
    { frequency: 659.25, durationMs: 120, type: 'triangle', delayMs: 110 },
    { frequency: 783.99, durationMs: 220, type: 'triangle', delayMs: 220 },
  ],
  'match-loss': [
    { frequency: 392, durationMs: 160, type: 'sawtooth' },
    { frequency: 293.66, durationMs: 260, type: 'sawtooth', delayMs: 150 },
  ],
};

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextCtor = window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext;
  if (!AudioContextCtor) return null;
  if (!audioContext) audioContext = new AudioContextCtor();
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
}

export function playSfx(cue: SfxCue): void {
  const { sfxVolume, lowDataMode } = useSettingsStore.getState();
  if (lowDataMode || sfxVolume <= 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const gainScale = sfxVolume / 100;

  for (const tone of CUES[cue]) {
    const startTime = ctx.currentTime + (tone.delayMs ?? 0) / 1000;
    const stopTime = startTime + tone.durationMs / 1000;

    const oscillator = ctx.createOscillator();
    oscillator.type = tone.type;
    oscillator.frequency.setValueAtTime(tone.frequency, startTime);

    const gainNode = ctx.createGain();
    const peakGain = 0.2 * gainScale;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, stopTime);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(startTime);
    oscillator.stop(stopTime + 0.02);
  }
}
