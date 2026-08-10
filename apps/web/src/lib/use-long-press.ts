'use client';

import { useRef } from 'react';
import type { MouseEvent } from 'react';

const DEFAULT_THRESHOLD_MS = 450;

/**
 * Long-press detector that also swallows the click event long-presses
 * generate on release, so a long-press never also triggers the element's
 * own `onClick` (e.g. tap-to-play). Attach the returned handlers to a
 * wrapping element around the interactive child — `onClickCapture` fires
 * before the child's bubble-phase `onClick`, so `stopPropagation` there is
 * enough to cancel it without touching the child at all.
 */
export function useLongPress(onLongPress: () => void, thresholdMs = DEFAULT_THRESHOLD_MS) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired = useRef(false);

  function clear() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }

  return {
    onPointerDown: () => {
      fired.current = false;
      clear();
      timer.current = setTimeout(() => {
        fired.current = true;
        onLongPress();
      }, thresholdMs);
    },
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    onClickCapture: (e: MouseEvent) => {
      if (fired.current) {
        e.stopPropagation();
        fired.current = false;
      }
    },
  };
}
