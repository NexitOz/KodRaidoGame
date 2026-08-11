'use client';

import { useEffect, useState } from 'react';
import type { MatchEventView } from '@kod-raido/shared';
import { Icon } from '@kod-raido/ui';

const EVENT_LABEL: Record<string, string> = {
  CARD_PLAYED: 'сыграл карту',
  UNIT_SUMMONED: 'призвал существо',
  RUNE_ACTIVATED: 'активировал руну',
  ATTACK: 'атаковал',
  ATTACK_DECLARED: 'объявил атаку',
  DAMAGE: 'нанёс урон',
  UNIT_DAMAGED: 'нанёс урон существу',
  UNIT_DIED: 'существо погибло',
  UNIT_HEALED: 'существо исцелено',
  CONDUCTOR_DAMAGED: 'урон по Проводнику',
  CONDUCTOR_HEALED: 'Проводник исцелён',
  TURN_START: 'начался ход',
  TURN_END: 'ход завершён',
  CARD_DRAWN: 'взял карту',
  CARD_BURNED: 'сжёг карту',
  FATIGUE_DAMAGE: 'урон от истощения',
  SHIELD: 'получил щит',
  SHIELD_CONSUMED: 'щит поглотил урон',
  SILENCE: 'наложено безмолвие',
  STATUS_ADDED: 'наложен статус',
  MATCH_FINISHED: 'матч завершён',
};

function eventLabel(event: MatchEventView): string {
  return EVENT_LABEL[event.type] ?? event.type;
}

export function EventLogSheet({ events }: { events: MatchEventView[] }) {
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
        aria-label={`Журнал событий, ${events.length} записей`}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-raido-mist transition-colors hover:text-raido-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red"
      >
        <Icon name="log" size={18} />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Журнал событий"
            className="max-h-[70dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-white/10 bg-raido-graphite p-4 md:rounded-3xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Журнал событий</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть журнал событий"
                className="flex h-8 w-8 items-center justify-center rounded-full text-raido-mist hover:text-raido-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red"
              >
                ✕
              </button>
            </div>
            {events.length === 0 ? (
              <p className="text-sm text-raido-mist">Пока нет событий.</p>
            ) : (
              <ul className="flex flex-col gap-1.5 text-sm text-raido-mist">
                {events
                  .slice(-15)
                  .reverse()
                  .map((e, i) => (
                    <li key={i} className="border-b border-white/5 pb-1.5 last:border-0">
                      {eventLabel(e)}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
