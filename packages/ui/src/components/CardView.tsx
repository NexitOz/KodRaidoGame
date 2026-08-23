import type { Card } from '@kod-raido/shared';
import clsx from 'clsx';
import { RARITY_FRAME_CLASS, RARITY_GLOW_CLASS, RARITY_LABEL } from '../rarity.js';
import { factionAccent } from '../factions.js';
import { ResonanceBadge } from './ResonanceBadge.js';
import { Icon } from './Icon.js';

export interface CardViewProps {
  card: Card;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  trending?: boolean;
  onSelect?: (card: Card) => void;
  className?: string;
  /** Default (`false`/unset) truncates the name to one line with an ellipsis, as every existing
   * caller (collection grid, hand fan, deck builder, ...) expects at their fixed card widths. Opt
   * in when a caller has room to spare and truncation would hide real information instead of just
   * saving space - e.g. a free-floating "read the whole card" overlay, not a dense grid. */
  allowNameWrap?: boolean;
  /** `size="xs"` only; defaults to `false` so every existing caller (Collection, Deck Builder,
   * Admin review, the hand dock's own smaller hands, HandCardPreview, ...) is byte-for-byte
   * unchanged. Opt in only for the densest mobile hand fans (Mobile Battlefield production polish
   * 4.0): at 8-10 overlapping cards the below-artwork name row became illegible visual noise
   * (adjacent cards' names smearing into each other), and the full name is already one tap away
   * via the existing preview modal / engaged-card overlay - so the compact treatment simply omits
   * the name row rather than trying to fit it, instead of rendering text nobody could read anyway. */
  compactName?: boolean;
}

const TYPE_LABEL: Record<Card['type'], string> = {
  CHARACTER: 'Персонаж',
  TRACK: 'Трек',
  RUNE: 'Руна',
  EVENT: 'Событие',
  EDIT: 'Эдит',
};

export function CardView({ card, size = 'md', trending, onSelect, className, allowNameWrap, compactName }: CardViewProps) {
  const isCharacter = card.type === 'CHARACTER';
  const accent = factionAccent(card.faction);
  const glowClass = RARITY_GLOW_CLASS[card.rarity];
  const isRaido = card.rarity === 'RAIDO';

  return (
    <button
      type="button"
      onClick={() => onSelect?.(card)}
      className={clsx(
        'card-tilt-layer group relative flex w-full flex-col overflow-hidden rounded-card border text-left transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red',
        'active:scale-[0.98] hover:-translate-y-1 hover:shadow-panel',
        RARITY_FRAME_CLASS[card.rarity],
        size === 'xs' && 'max-w-[92px]',
        size === 'sm' && 'max-w-[140px]',
        size === 'md' && 'max-w-[200px]',
        size === 'lg' && 'max-w-[280px]',
        className,
      )}
    >
      {/* Animated rarity pulse lives on its own layer so it never dims the artwork/text below it. */}
      {glowClass ? (
        <span aria-hidden className={clsx('pointer-events-none absolute inset-0 z-10 rounded-card', glowClass)} />
      ) : null}
      {isRaido ? (
        <span
          aria-hidden
          className="pointer-events-none absolute right-1.5 top-1.5 z-20 text-sm text-raido-red/80"
        >
          ᚱ
        </span>
      ) : null}

      <div className="relative aspect-[3/4] w-full overflow-hidden bg-raido-black">
        <img
          src={card.artworkUrl}
          alt={card.name}
          className="h-full w-full select-none object-cover opacity-90 transition-transform duration-300 group-hover:scale-[1.04] group-hover:opacity-100"
          loading="lazy"
          draggable={false}
        />
        <div className={clsx('absolute inset-x-0 top-0 flex items-center justify-between', size === 'xs' ? 'p-1' : 'p-2')}>
          <span
            className={clsx(
              'flex items-center justify-center rounded-full bg-black/70 font-bold text-raido-white ring-1 ring-white/10',
              size === 'xs' ? 'h-5 w-5 text-xs' : 'h-7 w-7 text-sm',
            )}
          >
            {card.cost}
          </span>
          {size !== 'xs' ? <ResonanceBadge tier={card.resonanceTier} trending={trending} /> : null}
        </div>
        {size !== 'xs' ? (
          <span
            aria-hidden
            title={card.faction}
            className={clsx(
              'absolute left-2 top-9 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs ring-1 ring-white/10',
              accent.textClass,
            )}
          >
            {accent.glyph}
          </span>
        ) : null}
        {isCharacter ? (
          <div
            className={clsx(
              'absolute inset-x-0 bottom-0 flex items-center justify-between font-bold',
              size === 'xs' ? 'p-1 text-xs' : 'p-2 text-sm',
            )}
          >
            <span className="flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 text-raido-white">
              <Icon name="sword" size={11} /> {card.attack}
            </span>
            <span className="flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 text-raido-redGlow">
              <Icon name="heart" size={11} /> {card.health}
            </span>
          </div>
        ) : null}
      </div>
      {size === 'xs' ? (
        compactName ? null : (
          <p
            className={clsx(
              allowNameWrap ? 'line-clamp-2' : 'truncate',
              'px-1.5 py-1 text-[11px] font-semibold text-raido-white',
            )}
          >
            {card.name}
          </p>
        )
      ) : (
        <div className="relative z-10 flex flex-1 flex-col gap-1 bg-raido-graphite/95 p-2.5">
          <p
            className={clsx(
              allowNameWrap ? 'line-clamp-2' : 'truncate',
              'text-sm font-semibold text-raido-white',
            )}
          >
            {card.name}
          </p>
          <p className={clsx('text-[11px] uppercase tracking-wide', accent.textClass)}>
            {TYPE_LABEL[card.type]} · {RARITY_LABEL[card.rarity]}
          </p>
        </div>
      )}
    </button>
  );
}
