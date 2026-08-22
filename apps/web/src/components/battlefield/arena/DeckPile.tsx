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
const MOBILE_CONTROL_PATH = '/art/battlefield/mobile-controls';
const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

export function DeckPile({ count, align = 'left', label, side, className }: DeckPileProps) {
  const art = `${CONTROL_PATH}/kod-raido-deck-${side === 'opponent' ? 'red' : 'blue'}-stacked-v1.png`;
  const mobileArt = `${MOBILE_CONTROL_PATH}/kod-raido-mobile-deck-${side}-v1.webp`;

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
            width={112}
            height={128}
            className={clsx('h-full w-full object-contain', count <= 0 && 'opacity-30 grayscale')}
          />
        </picture>
        {/* QA fix (Task 5.1): was `bottom-[1%]`, which put the count right at the housing's own
            bottom edge - on the player's side, `.plyDeckSlot`/`.plyDiscardSlot` (MatchBoard.module.css,
            frozen) sit close enough together that the number collided with the Discard pile's
            "СБРОС" label directly beneath it (e.g. "СБ25ОС"). `bottom-[24%]` lands the count over
            the dark stacked-pages area low in the art itself (still visually part of the deck
            housing, not floating in empty space) with enough clearance to clear that label on both
            sides at every tested count (0/1/19/20/25+) - purely an internal repositioning of this
            span, no change to the housing's own size/position or to DiscardPile. */}
        <span className="absolute bottom-[24%] left-1/2 z-10 -translate-x-1/2 text-[10px] font-black tabular-nums text-raido-white [text-shadow:0_1px_4px_rgba(0,0,0,1)]">
          {count}
        </span>
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
