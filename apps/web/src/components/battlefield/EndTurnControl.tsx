'use client';

import clsx from 'clsx';
import { Icon } from '@kod-raido/ui';

export interface EndTurnControlProps {
  isMyTurn: boolean;
  pending: boolean;
  onEndTurn: () => void;
}

/**
 * Battlefield Visual Target 3.0: a physical dark-metal + antique-gold octagonal control instead
 * of a full-width web pill button - same `onClick`/`disabled` contract and the same
 * `data-tutorial-target="end-turn"` the tutorial spotlight and Playwright e2e helpers already
 * select on (see apps/web/e2e/helpers.ts), so nothing outside this component's own markup needed
 * to change. Four read-at-a-glance states:
 * - WAITING (not your turn): dim, static, disabled.
 * - YOUR TURN / CAN END TURN (your turn, no action in flight): warm gold-red glow, enabled.
 * - PROCESSING (your turn, an action is in flight): same shape, quiet spin instead of glow,
 *   disabled so a second tap can't double-submit.
 * The two owner-spec labels "YOUR TURN" and "CAN END TURN" describe the same actionable game
 * state here (there is no separate "must end turn" condition in the engine) - both map to the
 * one active visual state below rather than inventing a distinction the state machine doesn't
 * have.
 */
export function EndTurnControl({ isMyTurn, pending, onEndTurn }: EndTurnControlProps) {
  const active = isMyTurn && !pending;
  const processing = isMyTurn && pending;

  const label = processing ? 'Обработка' : isMyTurn ? 'Завершить ход' : 'Ход соперника';

  return (
    <button
      type="button"
      onClick={onEndTurn}
      disabled={!isMyTurn || pending}
      data-tutorial-target="end-turn"
      aria-label={label}
      className={clsx(
        'group relative flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center gap-0.5 rounded-full border-2 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red disabled:cursor-not-allowed sm:h-20 sm:w-20',
        'bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.08),transparent_55%),linear-gradient(to_bottom,theme(colors.raido.steel),theme(colors.raido.black))]',
        active && 'border-raido-gold/70 shadow-[0_0_22px_rgba(217,180,106,0.35)] active:scale-95',
        processing && 'border-raido-gold/30 opacity-80',
        !isMyTurn && !processing && 'border-white/10 opacity-60',
      )}
    >
      {active ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-raido-red/50 animate-ready-glow"
        />
      ) : null}
      {processing ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-1 rounded-full border-2 border-transparent border-t-raido-gold/70 animate-rune-rotate"
        />
      ) : null}
      <Icon
        name={processing ? 'impulse' : 'sword'}
        size={18}
        className={active ? 'text-raido-gold' : 'text-raido-mist'}
      />
      <span
        className={clsx(
          'px-1 text-[9px] font-bold uppercase leading-tight tracking-wide',
          active ? 'text-raido-white' : 'text-raido-mist',
        )}
      >
        {processing ? 'Обработка' : isMyTurn ? 'Ход' : 'Ждём'}
      </span>
    </button>
  );
}
