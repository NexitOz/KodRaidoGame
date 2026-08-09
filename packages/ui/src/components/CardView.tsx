import type { Card } from '@kod-raido/shared';
import clsx from 'clsx';
import { RARITY_FRAME_CLASS, RARITY_LABEL } from '../rarity.js';
import { ResonanceBadge } from './ResonanceBadge.js';

export interface CardViewProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  trending?: boolean;
  onSelect?: (card: Card) => void;
  className?: string;
}

const TYPE_LABEL: Record<Card['type'], string> = {
  CHARACTER: 'Персонаж',
  TRACK: 'Трек',
  RUNE: 'Руна',
  EVENT: 'Событие',
  EDIT: 'Эдит',
};

export function CardView({ card, size = 'md', trending, onSelect, className }: CardViewProps) {
  const isCharacter = card.type === 'CHARACTER';

  return (
    <button
      type="button"
      onClick={() => onSelect?.(card)}
      className={clsx(
        'group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-raido-graphite text-left transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red',
        'active:scale-[0.98] hover:-translate-y-0.5',
        RARITY_FRAME_CLASS[card.rarity],
        size === 'sm' && 'max-w-[140px]',
        size === 'md' && 'max-w-[200px]',
        size === 'lg' && 'max-w-[280px]',
        className,
      )}
    >
      <div className="relative aspect-[3/4] w-full bg-raido-black">
        <img
          src={card.artworkUrl}
          alt={card.name}
          className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm font-bold text-raido-white ring-1 ring-white/10">
            {card.cost}
          </span>
          <ResonanceBadge tier={card.resonanceTier} trending={trending} />
        </div>
        {isCharacter ? (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-2 text-sm font-bold">
            <span className="rounded-md bg-black/70 px-1.5 py-0.5 text-raido-white">
              ⚔ {card.attack}
            </span>
            <span className="rounded-md bg-black/70 px-1.5 py-0.5 text-raido-white">
              ♥ {card.health}
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <p className="truncate text-sm font-semibold text-raido-white">{card.name}</p>
        <p className="text-[11px] uppercase tracking-wide text-raido-mist">
          {TYPE_LABEL[card.type]} · {RARITY_LABEL[card.rarity]}
        </p>
      </div>
    </button>
  );
}
