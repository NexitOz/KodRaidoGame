'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/lib/settings-store';

/** Mirrors the persisted Low Data Mode setting onto <html> so plain CSS can react to it. */
export function LowDataModeSync() {
  const lowDataMode = useSettingsStore((s) => s.lowDataMode);

  useEffect(() => {
    document.documentElement.dataset.lowData = String(lowDataMode);
  }, [lowDataMode]);

  return null;
}
