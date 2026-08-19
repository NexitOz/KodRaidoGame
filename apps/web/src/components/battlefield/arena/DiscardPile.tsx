import clsx from 'clsx';
import { Icon } from '@kod-raido/ui';

import styles from './ProductionControls.module.css';

export interface DiscardPileProps {
  count: number;
  align?: 'left' | 'right';
  label?: string;
  side: 'opponent' | 'player';
  className?: string;
}

const CONTROL_PATH = '/art/battlefield/controls';
const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

/** Desktop uses the approved production art; the original compact mobile control is preserved. */
export function DiscardPile({ count, align = 'left', label, side, className }: DiscardPileProps) {
  const art = `${CONTROL_PATH}/kod-raido-discard-${side === 'opponent' ? 'red' : 'blue'}-filled-v1.png`;

  return (
    <div className={clsx('flex flex-col items-center gap-1', align === 'right' && 'items-end', className)}>
      {label ? <span className={styles.pileLabel}>{label}</span> : null}

      {/* Battlefield Polish 3.1: `gap-1.5` (was `gap-1`), same reasoning as DeckPile - a touch more
          separation from the deck column ~8px away, plus a brighter/shadowed count (was the same
          dim `text-raido-mist` as the idle icon itself, which is the harder of the two piles to
          associate at a glance) so it instantly reads as "belonging to Discard" rather than fading
          into the icon above it. Already `lg:hidden`, so no `lg:` reset needed. */}
      <div className={clsx('relative flex flex-col items-center gap-1.5 lg:hidden', align === 'right' && 'flex-row-reverse')}>
        <div className="relative flex h-12 w-9 items-center justify-center">
          <div className="relative h-9 w-7" aria-hidden="true">
            {Array.from({ length: count <= 0 ? 0 : count < 8 ? 1 : count < 20 ? 2 : 3 }).map((_, i) => (
              <span key={i} className="absolute inset-0 rounded-[4px] border border-white/10 bg-raido-black/80 opacity-80 shadow-[0_2px_5px_rgba(0,0,0,0.6)]" style={{ transform: `translate(${i * 1.5}px, ${-i * 1.5}px) rotate(${(i - 1) * 4}deg)` }} />
            ))}
            {count > 0 ? <span className="absolute inset-0 flex items-center justify-center rounded-[4px] border border-white/15 bg-raido-black/80 text-raido-mist opacity-90"><Icon name="skull" size={16} /></span> : <span className="absolute inset-0 rounded-[4px] border border-dashed border-white/10" />}
          </div>
        </div>
        <span className="text-sm font-bold tabular-nums text-raido-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">{count}</span>
      </div>

      <div className={styles.discardControl}>
        {count > 0 ? (
          <picture className={styles.discardArtwork} aria-hidden="true">
            <source media="(min-width: 1024px)" srcSet={art} />
            <img src={TRANSPARENT_PIXEL} alt="" draggable={false} width={1086} height={1448} />
          </picture>
        ) : null}
        <picture className={styles.discardCounter} aria-hidden="true">
          <source media="(min-width: 1024px)" srcSet={`${CONTROL_PATH}/kod-raido-counter-discard-vertical-v1.png`} />
          <img src={TRANSPARENT_PIXEL} alt="" draggable={false} width={347} height={753} />
        </picture>
        <span className={styles.discardCount}>{count}</span>
      </div>
    </div>
  );
}
