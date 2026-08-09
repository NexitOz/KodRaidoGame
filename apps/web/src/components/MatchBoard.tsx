'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type { MatchEventView, MatchRewards, MatchStateView, UnitInstanceView } from '@kod-raido/shared';
import { Button, CardView } from '@kod-raido/ui';
import { UnitToken } from './UnitToken';

export type MatchSelection =
  | { kind: 'hand'; instanceId: string; cost: number }
  | { kind: 'unit'; instanceId: string }
  | null;

const EVENT_LABEL: Record<string, string> = {
  CARD_PLAYED: 'сыграл карту',
  UNIT_SUMMONED: 'призвал существо',
  RUNE_ACTIVATED: 'активировал руну',
  ATTACK: 'атаковал',
  DAMAGE: 'нанёс урон',
  UNIT_DIED: 'существо погибло',
  CONDUCTOR_DAMAGED: 'урон по Проводнику',
  TURN_STARTED: 'начался ход',
  TURN_ENDED: 'ход завершён',
  DRAW: 'взял карту',
  FATIGUE: 'урон от истощения',
};

function eventLabel(event: MatchEventView): string {
  return EVENT_LABEL[event.type] ?? event.type;
}

export interface MatchBoardProps {
  view: MatchStateView;
  events: MatchEventView[];
  rewards: MatchRewards | null;
  selection: MatchSelection;
  isMyTurn: boolean;
  pending: boolean;
  actionError: string | null;
  /** "Бот" for PvE, the opponent's username for PvP. */
  opponentName: string;
  opponentIcon: string;
  opponentTurnLabel: string;
  rematchHref: string;
  onSelectHand: (instanceId: string, cost: number) => void;
  onSelectOwnUnit: (unit: UnitInstanceView) => void;
  onTapOwnConductor: () => void;
  onTapEnemyUnit: (unit: UnitInstanceView) => void;
  onTapEnemyConductor: () => void;
  onConfirmPlayNoTarget: () => void;
  onEndTurn: () => void;
  /** Extra status banner rendered above the board (e.g. PvP reconnect notices). */
  banner?: ReactNode;
}

export function MatchBoard({
  view,
  events,
  rewards,
  selection,
  isMyTurn,
  pending,
  actionError,
  opponentName,
  opponentIcon,
  opponentTurnLabel,
  rematchHref,
  onSelectHand,
  onSelectOwnUnit,
  onTapOwnConductor,
  onTapEnemyUnit,
  onTapEnemyConductor,
  onConfirmPlayNoTarget,
  onEndTurn,
  banner,
}: MatchBoardProps) {
  const { you, opponent } = view;
  const targetingEnemy = Boolean(selection);
  const readyAttackers = new Set(
    you.board.filter((u) => !u.summonedThisTurn && !u.attackedThisTurn).map((u) => u.instanceId),
  );

  return (
    <div className="flex flex-col gap-4 pb-24">
      <header className="flex items-center justify-between text-xs text-raido-mist">
        <span>Ход {view.turn}</span>
        <span className={isMyTurn ? 'text-raido-red' : ''}>
          {isMyTurn ? 'Твой ход' : opponentTurnLabel}
        </span>
      </header>

      {banner}

      <section className="flex flex-col gap-2 rounded-xl border border-white/10 bg-raido-graphite/60 p-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onTapEnemyConductor}
            disabled={!targetingEnemy}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors',
              targetingEnemy && 'ring-1 ring-emerald-400/60',
            )}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-raido-black text-sm font-bold">
              {opponentIcon}
            </span>
            <span className="text-sm">
              <span className="block font-semibold text-raido-white">{opponentName}</span>
              <span className="text-raido-mist">
                ♥ {opponent.conductorHp} · ⚡ {opponent.energy}/{opponent.maxEnergy}
              </span>
            </span>
          </button>
          <span className="text-[11px] text-raido-mist">
            Рука {opponent.handCount} · Колода {opponent.deckCount}
          </span>
        </div>
        <div className="flex min-h-[72px] flex-wrap gap-1.5">
          {opponent.board.map((unit) => (
            <UnitToken
              key={unit.instanceId}
              unit={unit}
              targetable={targetingEnemy}
              onSelect={onTapEnemyUnit}
            />
          ))}
        </div>
      </section>

      {events.length > 0 ? (
        <details className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-raido-mist">
          <summary className="cursor-pointer select-none font-semibold text-raido-white">
            Журнал событий
          </summary>
          <ul className="mt-2 flex flex-col gap-1">
            {events
              .slice(-15)
              .reverse()
              .map((e, i) => (
                <li key={i}>{eventLabel(e)}</li>
              ))}
          </ul>
        </details>
      ) : null}

      <section className="flex flex-col gap-2 rounded-xl border border-white/10 bg-raido-graphite/60 p-3">
        <div className="flex min-h-[72px] flex-wrap gap-1.5">
          {you.board.map((unit) => (
            <UnitToken
              key={unit.instanceId}
              unit={unit}
              selectable={readyAttackers.has(unit.instanceId)}
              selected={selection?.kind === 'unit' && selection.instanceId === unit.instanceId}
              targetable={selection?.kind === 'hand'}
              onSelect={onSelectOwnUnit}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-raido-mist">
            Колода {you.deckCount} · Сброс {you.discardCount}
          </span>
          <button
            type="button"
            onClick={onTapOwnConductor}
            disabled={selection?.kind !== 'hand'}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-2 py-1 transition-colors',
              selection?.kind === 'hand' && 'ring-1 ring-emerald-400/60',
            )}
          >
            <span className="text-sm">
              <span className="block text-right font-semibold text-raido-white">Ты</span>
              <span className="text-raido-mist">
                ♥ {you.conductorHp} · ⚡ {you.energy}/{you.maxEnergy}
              </span>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-raido-black text-sm font-bold">
              🧑
            </span>
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {you.hand.map(({ instanceId, card }) => (
            <div key={instanceId} className="shrink-0">
              <CardView
                card={card}
                size="sm"
                onSelect={() => onSelectHand(instanceId, card.cost)}
                className={clsx(
                  selection?.kind === 'hand' && selection.instanceId === instanceId
                    ? 'ring-2 ring-raido-red'
                    : '',
                  card.cost > you.energy && 'opacity-40',
                )}
              />
            </div>
          ))}
        </div>

        {actionError ? <p className="text-xs text-raido-redGlow">{actionError}</p> : null}

        <div className="flex gap-2">
          {selection?.kind === 'hand' ? (
            <Button
              variant="secondary"
              onClick={onConfirmPlayNoTarget}
              disabled={pending}
              className="flex-1"
            >
              Сыграть без цели
            </Button>
          ) : null}
          <Button onClick={onEndTurn} disabled={!isMyTurn || pending} className="flex-1">
            {pending ? 'Обработка…' : 'Завершить ход'}
          </Button>
        </div>
      </section>

      {view.finished ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4">
          <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-white/10 bg-raido-graphite p-6 text-center">
            <h2 className="font-display text-2xl font-bold">
              {view.winnerId === you.playerId ? 'Победа!' : 'Поражение'}
            </h2>
            {rewards ? (
              <p className="text-sm text-raido-mist">
                +{rewards.xp} опыта · +{rewards.softCurrency} монет
                {typeof rewards.mmrDelta === 'number'
                  ? ` · рейтинг ${rewards.mmrDelta >= 0 ? '+' : ''}${rewards.mmrDelta}`
                  : ''}
                {rewards.leveledUp ? ' · Новый уровень!' : ''}
              </p>
            ) : null}
            <div className="flex gap-3">
              <Link href={rematchHref}>
                <Button>Играть снова</Button>
              </Link>
              <Link href="/collection">
                <Button variant="secondary">К коллекции</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
