import type { Card } from '@kod-raido/shared';

export interface RuneZoneProps {
  runeCardIds: string[];
  cardsById: Map<string, Card>;
  /** Increment to replay the trigger pulse across all active runes for this side. */
  pulseKey?: number;
}

export function RuneZone({ runeCardIds, cardsById, pulseKey = 0 }: RuneZoneProps) {
  if (runeCardIds.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1" role="list" aria-label="Активные руны">
      {runeCardIds.map((cardId, i) => {
        const card = cardsById.get(cardId);
        return (
          <span
            key={`${cardId}-${i}`}
            role="listitem"
            title={card?.name ?? 'Руна'}
            aria-label={card?.name ?? 'Руна'}
            className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-raido-red/50 bg-black/60 text-[11px] text-raido-red"
          >
            <span aria-hidden className="absolute inset-0 rounded-full border border-raido-red/20 animate-rune-idle" />
            <span
              key={pulseKey}
              className={pulseKey > 0 ? 'animate-resonance-pulse' : ''}
              style={pulseKey > 0 ? { animationDelay: `${i * 90}ms` } : undefined}
              aria-hidden="true"
            >
              ⬡
            </span>
          </span>
        );
      })}
    </div>
  );
}
