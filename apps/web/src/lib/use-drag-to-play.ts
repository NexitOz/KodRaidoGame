'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Card } from '@kod-raido/shared';

const DRAG_THRESHOLD_PX = 12;

export interface DragCardInfo {
  card: Card;
  instanceId: string;
}

interface UseDragToPlayParams {
  disabled?: boolean;
  /** Plain tap (no meaningful pointer movement) - open/close the enlarged preview. */
  onTap: (card: Card, instanceId: string) => void;
  /** Press-hold + drag + release over a drop zone. `zone` is the nearest ancestor's
   * `data-drop-zone` value under the release point, or null if released over nothing playable. */
  onDrop: (instanceId: string, cost: number, zone: string | null) => void;
}

/**
 * Hand-card interaction: a plain tap previews the card (toggled by the caller via `onTap`); a
 * press-and-hold that then moves past a small threshold becomes a drag, ending in `onDrop` with
 * whatever `[data-drop-zone]` element sits under the release point (resolved via
 * `elementFromPoint`, so it works regardless of where in the tree MatchBoard renders its slots/
 * conductors - no prop drilling between the hand and the board). Purely a client-side input
 * mechanism: it always ends by calling the same `onTap`/`onDrop` callbacks the caller already
 * wires to the existing PLAY_CARD flow, never a new gameplay action of its own.
 *
 * Two non-obvious bits, both found by driving this with real synthetic pointer events:
 * - Tracking is done via `window`-level listeners rather than `setPointerCapture` on the card
 *   element - capture is lost the instant the dragged card re-renders in response to entering
 *   drag state, which happens on the very first frame of every drag. The window listeners
 *   themselves live in a lazily-created ref (not `useCallback`) so add/remove always pair up the
 *   same function identity no matter how many times this hook's owner re-renders mid-gesture;
 *   `onTap`/`onDrop`/`disabled` are read through a ref refreshed every render instead.
 * - `onPointerDown` calls `preventDefault()`. Without it, Chromium promotes the mousedown+move
 *   into a native HTML5 drag gesture (card art is an `<img>`, a default drag source), which fires
 *   `pointercancel` the instant the browser recognizes it - killing the custom drag before the
 *   first threshold-crossing move ever lands.
 */
export function useDragToPlay({ disabled, onTap, onDrop }: UseDragToPlayParams) {
  const [dragCard, setDragCard] = useState<DragCardInfo | null>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    startX: number;
    startY: number;
    dragging: boolean;
    instanceId: string;
    cost: number;
    card: Card;
  } | null>(null);
  const lastHoverEl = useRef<Element | null>(null);

  const paramsRef = useRef({ disabled, onTap, onDrop });
  paramsRef.current = { disabled, onTap, onDrop };

  const clearHover = () => {
    lastHoverEl.current?.classList.remove('drag-hover-target');
    lastHoverEl.current = null;
  };

  const handlersRef = useRef<{
    move: (e: PointerEvent) => void;
    up: (e: PointerEvent) => void;
    cancel: () => void;
  } | null>(null);

  function removeWindowListeners() {
    const h = handlersRef.current;
    if (!h) return;
    window.removeEventListener('pointermove', h.move);
    window.removeEventListener('pointerup', h.up);
    window.removeEventListener('pointercancel', h.cancel);
  }

  if (!handlersRef.current) {
    handlersRef.current = {
      move: (e) => {
        const s = stateRef.current;
        if (!s) return;
        const dx = e.clientX - s.startX;
        const dy = e.clientY - s.startY;
        if (!s.dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
          s.dragging = true;
          setDragCard({ card: s.card, instanceId: s.instanceId });
        }
        if (s.dragging) {
          const ghost = ghostRef.current;
          if (ghost) ghost.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -65%)`;
          const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-drop-zone]') ?? null;
          if (el !== lastHoverEl.current) {
            clearHover();
            if (el) {
              el.classList.add('drag-hover-target');
              lastHoverEl.current = el;
            }
          }
        }
      },
      up: (e) => {
        const s = stateRef.current;
        stateRef.current = null;
        removeWindowListeners();
        if (!s) return;
        if (s.dragging) {
          const zone = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-drop-zone]');
          clearHover();
          setDragCard(null);
          paramsRef.current.onDrop(s.instanceId, s.cost, zone?.getAttribute('data-drop-zone') ?? null);
        } else {
          paramsRef.current.onTap(s.card, s.instanceId);
        }
      },
      cancel: () => {
        const s = stateRef.current;
        stateRef.current = null;
        removeWindowListeners();
        if (s) clearHover();
        setDragCard(null);
      },
    };
  }

  // Cleanup if the component unmounts mid-gesture (e.g. the match ends while a card is armed).
  useEffect(() => removeWindowListeners, []);

  const onPointerDown = useCallback((e: React.PointerEvent, card: Card, instanceId: string, cost: number) => {
    if (paramsRef.current.disabled) return;
    e.preventDefault();
    stateRef.current = { startX: e.clientX, startY: e.clientY, dragging: false, instanceId, cost, card };
    const h = handlersRef.current!;
    window.addEventListener('pointermove', h.move);
    window.addEventListener('pointerup', h.up);
    window.addEventListener('pointercancel', h.cancel);
  }, []);

  const bind = useCallback(
    (card: Card, instanceId: string, cost: number) => ({
      onPointerDown: (e: React.PointerEvent) => onPointerDown(e, card, instanceId, cost),
    }),
    [onPointerDown],
  );

  return { dragCard, ghostRef, bind };
}
