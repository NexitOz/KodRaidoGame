import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSettingsStore } from './settings-store';

// Each test dynamically re-imports the module after vi.resetModules() so the
// internal `audioContext` singleton never leaks state (and therefore never
// leaks a stale window.AudioContext mock) between test cases.
async function freshPlaySfx() {
  vi.resetModules();
  const mod = await import('./sfx');
  return mod.playSfx;
}

describe('playSfx', () => {
  beforeEach(() => {
    useSettingsStore.setState({ sfxVolume: 70, lowDataMode: false });
    // @ts-expect-error -- test-only cleanup of a global shim
    delete window.AudioContext;
  });

  it('does not throw when the Web Audio API is unavailable (e.g. jsdom)', async () => {
    const playSfx = await freshPlaySfx();
    expect(() => playSfx('card-play')).not.toThrow();
  });

  it('never constructs an AudioContext while Low Data Mode is on', async () => {
    const ctor = vi.fn();
    window.AudioContext = ctor;
    useSettingsStore.setState({ lowDataMode: true });

    const playSfx = await freshPlaySfx();
    playSfx('attack');
    expect(ctor).not.toHaveBeenCalled();
  });

  it('never constructs an AudioContext when sfxVolume is 0', async () => {
    const ctor = vi.fn();
    window.AudioContext = ctor;
    useSettingsStore.setState({ sfxVolume: 0 });

    const playSfx = await freshPlaySfx();
    playSfx('attack');
    expect(ctor).not.toHaveBeenCalled();
  });

  it('schedules one oscillator per tone in the cue when enabled', async () => {
    const oscillator = {
      type: '',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
    const gainNode = {
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };
    const ctx = {
      state: 'running',
      currentTime: 0,
      createOscillator: vi.fn(() => oscillator),
      createGain: vi.fn(() => gainNode),
      destination: {},
    };
    // @ts-expect-error -- test shim
    window.AudioContext = vi.fn(() => ctx);

    const playSfx = await freshPlaySfx();
    playSfx('match-win'); // defined with 3 tones

    expect(ctx.createOscillator).toHaveBeenCalledTimes(3);
    expect(oscillator.start).toHaveBeenCalledTimes(3);
    expect(oscillator.connect).toHaveBeenCalledWith(gainNode);
    expect(gainNode.connect).toHaveBeenCalledWith(ctx.destination);
  });
});
