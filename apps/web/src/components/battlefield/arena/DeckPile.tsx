import clsx from 'clsx';

import styles from './ProductionControls.module.css';

export interface DeckPileProps {
  count: number;
  align?: 'left' | 'right';
  label?: string;
  side: 'opponent' | 'player';
  className?: string;
}

const CONTROL_PATH = '/art/battlefield/controls';
const TRANSPARENT_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

/** Desktop uses the approved production art; the original compact mobile control is preserved. */
export function DeckPile({ count, align = 'left', label, side, className }: DeckPileProps) {
  const art = `${CONTROL_PATH}/kod-raido-deck-${side === 'opponent' ? 'red' : 'blue'}-stacked-v1.png`;

  return (
    <div className={clsx('flex flex-col items-center gap-1', align === 'right' && 'items-end', className)}>
      {label ? <span className={styles.pileLabel}>{label}</span> : null}

      {/* Battlefield Polish 3.1: `gap-1.5` (was `gap-1`) and a text-shadow on the count give the
          number a touch more separation/contrast so it reads as belonging to *this* stack rather
          than drifting toward the discard column ~8px away - purely internal spacing/typography,
          the slot's own position against the painted housing is untouched. Already `lg:hidden`
          (this whole block never renders at desktop), so no `lg:` reset is needed here. */}
      <div className={clsx('relative flex flex-col items-center gap-1.5 lg:hidden', align === 'right' && 'flex-row-reverse')}>
        <div className="relative flex h-12 w-9 items-center justify-center">
          <div className="relative h-9 w-7" aria-hidden="true">
            {Array.from({ length: count <= 0 ? 0 : count < 8 ? 1 : count < 20 ? 2 : 3 }).map((_, i) => (
              <span key={i} className="absolute inset-0 rounded-[4px] border border-raido-gold/30 bg-gradient-to-b from-raido-graphite to-raido-black shadow-[0_2px_5px_rgba(0,0,0,0.6)]" style={{ transform: `translate(${i * 1.5}px, ${-i * 2}px)` }} />
            ))}
            {count > 0 ? <span className="absolute inset-0 flex items-center justify-center rounded-[4px] border border-raido-gold/45 bg-gradient-to-b from-raido-graphite to-raido-black text-sm text-raido-gold/75">ᚱ</span> : <span className="absolute inset-0 rounded-[4px] border border-dashed border-white/10" />}
          </div>
        </div>
        <span className="text-sm font-bold tabular-nums text-raido-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">{count}</span>
      </div>

      <div className={styles.deckControl}>
        {count > 0 ? (
          <picture className={styles.deckArtwork} aria-hidden="true">
            <source media="(min-width: 1024px)" srcSet={art} />
            <img src={TRANSPARENT_PIXEL} alt="" draggable={false} width={1086} height={1448} />
          </picture>
        ) : null}
        <picture className={styles.deckCounter} aria-hidden="true">
          <source media="(min-width: 1024px)" srcSet={`${CONTROL_PATH}/kod-raido-counter-deck-horizontal-v1.png`} />
          <img src={TRANSPARENT_PIXEL} alt="" draggable={false} width={1387} height={333} />
        </picture>
        <span className={styles.deckCount}>{count}</span>
      </div>
    </div>
  );
}
