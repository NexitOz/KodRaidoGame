import clsx from 'clsx';

import styles from './ProductionControls.module.css';

export interface DiscardPileProps {
  count: number;
  align?: 'left' | 'right';
  label?: string;
  side: 'opponent' | 'player';
  className?: string;
}

const CONTROL_PATH = '/art/battlefield/controls';
const MOBILE_CONTROL_PATH = '/art/battlefield/mobile-controls';
const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

export function DiscardPile({ count, align = 'left', label, side, className }: DiscardPileProps) {
  const art = `${CONTROL_PATH}/kod-raido-discard-${side === 'opponent' ? 'red' : 'blue'}-filled-v1.png`;
  const mobileArt = `${MOBILE_CONTROL_PATH}/kod-raido-mobile-discard-${side}-v1.webp`;

  return (
    <div className={clsx('flex flex-col items-center gap-1', align === 'right' && 'items-end', className)}>
      {label ? <span className={styles.pileLabel}>{label}</span> : null}

      <div className="relative h-[64px] w-[56px] lg:hidden">
        <picture className="pointer-events-none absolute inset-0" aria-hidden="true">
          <source media="(max-width: 1023.98px)" srcSet={mobileArt} />
          <img
            src={TRANSPARENT_PIXEL}
            alt=""
            draggable={false}
            width={127}
            height={128}
            className={clsx('h-full w-full object-contain', count <= 0 && 'opacity-25 grayscale')}
          />
        </picture>
        <span className="absolute bottom-[1%] left-1/2 z-10 -translate-x-1/2 text-[10px] font-black tabular-nums text-raido-white/95 [text-shadow:0_1px_4px_rgba(0,0,0,1)]">
          {count}
        </span>
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
