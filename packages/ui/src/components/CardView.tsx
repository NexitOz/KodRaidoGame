import type { Card } from '@kod-raido/shared';
import clsx from 'clsx';
import {
  RARITY_FRAME_CLASS,
  RARITY_GLOW_CLASS,
  RARITY_LABEL,
  RARITY_PIP_CLASS,
  RARITY_PIP_COUNT,
} from '../rarity.js';
import { factionAccent } from '../factions.js';
import { ResonanceBadge } from './ResonanceBadge.js';
import { Icon } from './Icon.js';

export interface CardViewProps {
  card: Card;
  size?: 'xs' | 'sm' | 'md' | 'lg';
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

/** A regular hexagon clip-path - used for the cost/ATK/HP badges so they read as cut "gems" set
 * into the frame instead of plain circles/pills, echoing the reference concept's medallion
 * language without needing any new art assets. */
const HEX_CLIP = 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)';

export function CardView({ card, size = 'md', trending, onSelect, className }: CardViewProps) {
  const isCharacter = card.type === 'CHARACTER';
  const accent = factionAccent(card.faction);
  const glowClass = RARITY_GLOW_CLASS[card.rarity];
  const isRaido = card.rarity === 'RAIDO';
  const hasOrnateCorners = card.rarity === 'LEGENDARY' || card.rarity === 'RAIDO';
  const pipCount = RARITY_PIP_COUNT[card.rarity];
  const pipClass = RARITY_PIP_CLASS[card.rarity];

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
        <span
          aria-hidden
          className={clsx('pointer-events-none absolute inset-0 z-10 rounded-card', glowClass)}
        />
      ) : null}
      {/* Ornate inner hairline - a second, inset border reading as "engraved metal frame" rather
          than a single flat rule. Restrained (low opacity), present on every rarity. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[3px] z-10 rounded-2xl border border-white/[0.08]"
      />
      {isRaido ? (
        <span
          aria-hidden
          className="pointer-events-none absolute right-1.5 top-1.5 z-20 text-sm text-raido-red/80"
        >
          ᚱ
        </span>
      ) : null}
      {/* Legendary/Raido corner flourishes - small bracket accents at the artwork's top corners,
          the one purely decorative cue reserved for the top two rarities (section: "красивая
          подача редкости"). CSS-only, no new assets. */}
      {hasOrnateCorners && size !== 'xs' ? (
        <>
          <span
            aria-hidden
            className={clsx(
              'pointer-events-none absolute left-1.5 top-1.5 z-20 h-3 w-3 border-l border-t',
              isRaido ? 'border-raido-red/70' : 'border-raido-gold/70',
            )}
          />
          <span
            aria-hidden
            className={clsx(
              'pointer-events-none absolute bottom-1.5 right-1.5 z-20 h-3 w-3 border-b border-r',
              isRaido ? 'border-raido-red/70' : 'border-raido-gold/70',
            )}
          />
        </>
      ) : null}

      <div className="relative aspect-[3/4] w-full overflow-hidden bg-raido-black">
        <img
          src={card.artworkUrl}
          alt={card.name}
          className="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-[1.04] group-hover:opacity-100"
          loading="lazy"
        />
        <div
          className={clsx(
            'absolute inset-x-0 top-0 flex items-center justify-between',
            size === 'xs' ? 'p-1' : 'p-2',
          )}
        >
          <span
            style={{ clipPath: HEX_CLIP }}
            className={clsx(
              'flex items-center justify-center bg-black/75 font-bold text-raido-gold ring-1 ring-inset ring-raido-gold/40',
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
            <span
              style={size !== 'xs' ? { clipPath: HEX_CLIP } : undefined}
              className={clsx(
                'flex items-center gap-0.5 bg-black/75 text-raido-white',
                size === 'xs'
                  ? 'rounded-md px-1.5 py-0.5'
                  : 'px-2 py-1 ring-1 ring-inset ring-white/15',
              )}
            >
              <Icon name="sword" size={11} /> {card.attack}
            </span>
            <span
              style={size !== 'xs' ? { clipPath: HEX_CLIP } : undefined}
              className={clsx(
                'flex items-center gap-0.5 bg-black/75 text-raido-redGlow',
                size === 'xs'
                  ? 'rounded-md px-1.5 py-0.5'
                  : 'px-2 py-1 ring-1 ring-inset ring-raido-red/25',
              )}
            >
              <Icon name="heart" size={11} /> {card.health}
            </span>
          </div>
        ) : null}
      </div>
      {size === 'xs' ? (
        <p className="truncate px-1.5 py-1 text-[11px] font-semibold text-raido-white">
          {card.name}
        </p>
      ) : (
        <div className="relative z-10 flex flex-1 flex-col gap-1 overflow-hidden bg-raido-graphite/95 p-2.5">
          {/* Faction wash - a very low-opacity tint under the text footer, the frame's one nod to
              "this card belongs to X" beyond the small corner glyph above. */}
          <span
            aria-hidden
            className={clsx('pointer-events-none absolute inset-0 -z-10', accent.bgSoftClass)}
          />
          <p className="truncate text-sm font-semibold text-raido-white">{card.name}</p>
          <p
            className={clsx(
              'flex items-center gap-1.5 text-[11px] uppercase tracking-wide',
              accent.textClass,
            )}
          >
            {TYPE_LABEL[card.type]} · {RARITY_LABEL[card.rarity]}
            <span className="flex items-center gap-[3px]" aria-hidden>
              {Array.from({ length: pipCount }, (_, i) => (
                <span key={i} className={clsx('h-1 w-1 rounded-full', pipClass)} />
              ))}
            </span>
          </p>
        </div>
      )}
    </button>
  );
}
