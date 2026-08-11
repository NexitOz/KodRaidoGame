'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import type { TutorialStepContent } from '@/lib/tutorial-objectives';

interface OverlayRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function measure(target: string | null): OverlayRect | null {
  if (!target || typeof document === 'undefined') return null;
  const el = document.querySelector(`[data-tutorial-target="${target}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

const MARGIN = 12;
const FALLBACK_HINT_MS = 22_000;

export interface TutorialOverlayProps {
  content: TutorialStepContent;
  stepNumber: number;
  stepCount: number;
  /** Wrong taps recorded since this step started - used to intensify the spotlight (section 6). */
  attemptCount: number;
  onAdvance: () => void;
  /** Manual "Продолжить обучение" recovery: advances the tutorial's own step pointer without
   * touching match state (section 18) - never a substitute for actually completing the objective. */
  onManualAdvance: () => void;
}

/**
 * Additive overlay layer for Battlefield 2.0 - spotlights whatever DOM node currently carries
 * data-tutorial-target={content.target} (set generically by card TYPE / game-state flags in the
 * battlefield subcomponents, never by cardId) and shows a short tooltip near it. Rendered as a
 * position:fixed sibling, so it never touches MatchBoard's own markup or layout.
 */
export function TutorialOverlay({
  content,
  stepNumber,
  stepCount,
  attemptCount,
  onAdvance,
  onManualAdvance,
}: TutorialOverlayProps) {
  const [rect, setRect] = useState<OverlayRect | null>(() => measure(content.target));
  const [tooltipSize, setTooltipSize] = useState({ w: 280, h: 132 });
  const [showFallback, setShowFallback] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setShowFallback(false);
    const timer = setTimeout(() => setShowFallback(true), FALLBACK_HINT_MS);
    return () => clearTimeout(timer);
  }, [content.id]);

  useEffect(() => {
    let mounted = true;
    let frame = 0;
    function tick() {
      if (!mounted) return;
      const next = measure(content.target);
      setRect((prev) => {
        if (!next) return prev === null ? prev : null;
        if (
          prev &&
          prev.top === next.top &&
          prev.left === next.left &&
          prev.width === next.width &&
          prev.height === next.height
        ) {
          return prev;
        }
        return next;
      });
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
    };
  }, [content.target]);

  useEffect(() => {
    const el = tooltipRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setTooltipSize((prev) =>
        Math.abs(prev.w - width) > 1 || Math.abs(prev.h - height) > 1 ? { w: width, h: height } : prev,
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [content.id]);

  const vw = typeof window !== 'undefined' ? window.innerWidth : 390;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 844;

  let tooltipTop: number;
  if (rect) {
    const spaceBelow = vh - (rect.top + rect.height);
    const spaceAbove = rect.top;
    const placeBelow = spaceBelow >= tooltipSize.h + MARGIN || spaceBelow >= spaceAbove;
    tooltipTop = placeBelow
      ? Math.min(rect.top + rect.height + MARGIN, vh - tooltipSize.h - MARGIN)
      : Math.max(rect.top - tooltipSize.h - MARGIN, MARGIN);
  } else {
    tooltipTop = Math.max((vh - tooltipSize.h) / 2, MARGIN);
  }
  const centerX = rect ? rect.left + rect.width / 2 : vw / 2;
  const tooltipLeft = Math.min(
    Math.max(centerX - tooltipSize.w / 2, MARGIN),
    Math.max(MARGIN, vw - tooltipSize.w - MARGIN),
  );

  const intensify = attemptCount >= 2;

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {rect ? (
        <div
          className={clsx(
            'absolute rounded-xl border-2 border-raido-gold/80 motion-reduce:transition-none',
            intensify ? 'animate-spotlight-ring-strong' : 'animate-spotlight-ring',
          )}
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            boxShadow: '0 0 0 9999px rgba(3,3,6,0.74)',
          }}
        />
      ) : (
        // No matching DOM target yet (e.g. still loading, or an unexpected state mismatch) - a
        // plain dim layer plus the centered tooltip below keeps the player oriented instead of
        // showing a broken/empty overlay.
        <div className="absolute inset-0 bg-black/70" />
      )}

      <div
        ref={tooltipRef}
        role="status"
        aria-live="polite"
        aria-describedby="tutorial-step-body"
        className="pointer-events-auto absolute w-[min(280px,calc(100vw-24px))] rounded-2xl border border-raido-gold/50 bg-raido-graphite px-4 py-3 shadow-rune"
        style={{ top: tooltipTop, left: tooltipLeft }}
      >
        <p className="text-[10px] uppercase tracking-wide text-raido-mist">
          Шаг {stepNumber} из {stepCount}
        </p>
        <h2 className="mt-0.5 font-display text-base font-bold text-raido-white">{content.title}</h2>
        <p id="tutorial-step-body" className="mt-1 text-sm leading-snug text-raido-mist">
          {content.body}
        </p>

        {content.advanceKind === 'tap' ? (
          <button
            type="button"
            onClick={onAdvance}
            className="mt-3 min-h-9 w-full rounded-lg bg-raido-red px-3 text-sm font-semibold text-raido-white"
          >
            Понятно
          </button>
        ) : (
          <p className="mt-2 text-xs italic text-raido-mist" aria-hidden="true">
            Сделай это на поле, чтобы продолжить.
          </p>
        )}

        {showFallback ? (
          <button
            type="button"
            onClick={onManualAdvance}
            className="mt-2 w-full text-center text-[11px] text-raido-mist underline-offset-2 hover:text-raido-white hover:underline"
          >
            Продолжить обучение
          </button>
        ) : null}
      </div>
    </div>
  );
}
