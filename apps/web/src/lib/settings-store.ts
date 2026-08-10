'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  lowDataMode: boolean;
  setMusicVolume: (value: number) => void;
  setSfxVolume: (value: number) => void;
  setVoiceVolume: (value: number) => void;
  setLowDataMode: (value: boolean) => void;
}

const DEFAULT_VOLUME = 70;

/**
 * Volumes are 0-100 (not 0-1) so they map directly onto <input type="range">
 * without a conversion step at every call site; the SFX engine divides by
 * 100 itself when it needs a gain value.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      musicVolume: DEFAULT_VOLUME,
      sfxVolume: DEFAULT_VOLUME,
      voiceVolume: DEFAULT_VOLUME,
      lowDataMode: false,
      setMusicVolume: (value) => set({ musicVolume: clamp(value) }),
      setSfxVolume: (value) => set({ sfxVolume: clamp(value) }),
      setVoiceVolume: (value) => set({ voiceVolume: clamp(value) }),
      setLowDataMode: (value) => set({ lowDataMode: value }),
    }),
    { name: 'kod-raido-settings' },
  ),
);

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
