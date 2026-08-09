'use client';

import type { PublicUser } from '@kod-raido/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: PublicUser | null;
  accessToken: string | null;
  setAuth: (user: PublicUser, accessToken: string) => void;
  clear: () => void;
}

/**
 * Access tokens are short-lived (15 min) and persisted here only to smooth
 * over page reloads during MVP development; the long-lived refresh token
 * never leaves the httpOnly cookie the game-server sets.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      clear: () => set({ user: null, accessToken: null }),
    }),
    { name: 'kod-raido-auth' },
  ),
);
