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
            {/* Battlefield Visual Target 3.0 (section 10): a physical ritual socket reads as
                inscribed geometry slowly turning in place - sparse dashes, low opacity, an 18s
                rotation - not a bright loading spinner. Purely decorative, gated with every other
                continuous loop under Low Data Mode / reduced-motion (see globals.css). */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[-2px] rounded-full animate-rune-rotate"
              style={{ border: '1px dashed rgba(217,180,106,0.35)' }}
            />
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border border-raido-red/20 animate-rune-idle"
            />
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
