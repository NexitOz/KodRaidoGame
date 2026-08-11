'use client';

import { useEffect, useState } from 'react';
import { KEYWORD_REGISTRY, KEYWORD_IDS } from '@kod-raido/shared';

/**
 * Compact reference sheet reachable from a "?" button in the battlefield header (section 10 of
 * the FPX spec) - no persistent hints after the tutorial finishes, just this on-demand lookup.
 * Content is the same shared KEYWORD_REGISTRY the in-text keyword tooltips use.
 */
export function HelpSheet() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Справка по терминам"
        className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-[11px] font-bold text-raido-mist hover:text-raido-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red"
      >
        ?
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Справка по терминам"
            className="max-h-[80dvh] w-full max-w-sm overflow-y-auto rounded-t-3xl border border-white/10 bg-raido-graphite p-5 md:rounded-3xl"
          >
            <h2 className="font-display text-lg font-bold">Справка</h2>
            <dl className="mt-3 flex flex-col gap-3">
              {KEYWORD_IDS.map((id) => {
                const def = KEYWORD_REGISTRY[id];
                return (
                  <div key={id}>
                    <dt className="text-sm font-bold text-raido-gold">{def.title}</dt>
                    <dd className="mt-0.5 text-xs leading-relaxed text-raido-mist">{def.description}</dd>
                  </div>
                );
              })}
            </dl>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-full bg-raido-steel py-2.5 text-sm text-raido-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red"
            >
              Закрыть
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
