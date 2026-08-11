'use client';

import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import type {
  Card,
  MatchEventView,
  MatchRewards,
  MatchStateView,
  RankTierDefinition,
  UnitInstanceView,
} from '@kod-raido/shared';
import { Button } from '@kod-raido/ui';
import { api } from '@/lib/api';
import { useCombatFeedback } from '@/lib/use-combat-feedback';
import { computeViewerResonanceHeat } from '@/lib/resonance-heat';
import { ConductorPanel } from './battlefield/ConductorPanel';
import { CreatureRow } from './battlefield/CreatureRow';
import { OpponentHandBacks } from './battlefield/OpponentHandBacks';
import { HandFan } from './battlefield/HandFan';
import { HandCardPreview } from './battlefield/HandCardPreview';
import { ResonancePulse } from './battlefield/ResonancePulse';
import { TrackZone } from './battlefield/TrackZone';
import { RuneZone } from './battlefield/RuneZone';
import { TurnOverlay } from './battlefield/TurnOverlay';
import { EventLogSheet } from './battlefield/EventLogSheet';
import { HelpSheet } from './battlefield/HelpSheet';
import { ResultModal } from './battlefield/ResultModal';

export type MatchSelection =
  | { kind: 'hand'; instanceId: string; cost: number }
  | { kind: 'unit'; instanceId: string }
  | null;

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
  /** Viewer's own rank, shown on their conductor panel — PvP only, "при наличии данных". */
  viewerRank?: RankTierDefinition;
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
  viewerRank,
}: MatchBoardProps) {
  const { you, opponent } = view;
  const targetingEnemy = Boolean(selection);
  const readyAttackers = new Set(
    you.board.filter((u) => !u.summonedThisTurn && !u.attackedThisTurn).map((u) => u.instanceId),
  );
  const ownTargetable = selection?.kind === 'hand';
  const ownInteractive = new Set<string>([
    ...readyAttackers,
    ...(ownTargetable ? you.board.map((u) => u.instanceId) : []),
  ]);
  const opponentTargetable = new Set(targetingEnemy ? opponent.board.map((u) => u.instanceId) : []);

  const { data: cards } = useQuery({ queryKey: ['cards'], queryFn: api.getCards });
  const cardsById = new Map<string, Card>((cards ?? []).map((c) => [c.id, c]));

  const { items, deathToasts, resonanceTriggerKey, runeTriggerKey, trackTrigger } = useCombatFeedback(events);
  const feedbackByTarget = new Map<string, typeof items>();
  for (const item of items) {
    const list = feedbackByTarget.get(item.target) ?? [];
    list.push(item);
    feedbackByTarget.set(item.target, list);
  }

  const [previewCard, setPreviewCard] = useState<Card | null>(null);

  const resonanceHeat = computeViewerResonanceHeat(view);
  const opponentDeathToasts = deathToasts.filter((d) => d.ownerId === opponent.playerId);
  const ownDeathToasts = deathToasts.filter((d) => d.ownerId === you.playerId);
  const opponentRunePulse = runeTriggerKey?.playerId === opponent.playerId ? runeTriggerKey.key : 0;
  const ownRunePulse = runeTriggerKey?.playerId === you.playerId ? runeTriggerKey.key : 0;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-1.5 pb-20">
      <TurnOverlay activePlayerId={view.activePlayerId} isMyTurn={isMyTurn} />

      <header className="flex items-center justify-between text-xs text-raido-mist">
        <span>
          Ход {view.turn} · <span className={isMyTurn ? 'font-semibold text-raido-red' : ''}>
            {isMyTurn ? 'Твой ход' : opponentTurnLabel}
          </span>
        </span>
        <span className="flex items-center gap-2">
          <HelpSheet />
          <EventLogSheet events={events} />
        </span>
      </header>

      {banner}

      <section className="flex flex-col gap-1.5">
        <ConductorPanel
          player={opponent}
          name={opponentName}
          icon={opponentIcon}
          align="left"
          targetable={targetingEnemy}
          onTap={onTapEnemyConductor}
          feedback={feedbackByTarget.get(`conductor:${opponent.playerId}`) ?? []}
        />
        <div className="flex items-center justify-between">
          <OpponentHandBacks count={opponent.handCount} />
          <RuneZone runeCardIds={opponent.runeCardIds} cardsById={cardsById} pulseKey={opponentRunePulse} />
        </div>
        <CreatureRow
          units={opponent.board}
          targetableIds={opponentTargetable}
          hasActiveSelection={targetingEnemy}
          interactiveIds={opponentTargetable}
          onSelect={onTapEnemyUnit}
          feedbackByTarget={feedbackByTarget}
          deathToasts={opponentDeathToasts}
        />
      </section>

      <section className="relative flex items-center justify-center py-1" data-tutorial-target="resonance">
        <ResonancePulse tier={resonanceHeat} triggerKey={resonanceTriggerKey} />
        <TrackZone trigger={trackTrigger} cardsById={cardsById} />
      </section>

      <section className="flex flex-col gap-1.5">
        <CreatureRow
          units={you.board}
          selectedInstanceId={selection?.kind === 'unit' ? selection.instanceId : null}
          readyAttackerIds={readyAttackers}
          targetableIds={ownTargetable ? new Set(you.board.map((u) => u.instanceId)) : undefined}
          hasActiveSelection={ownTargetable}
          interactiveIds={ownInteractive}
          onSelect={onSelectOwnUnit}
          feedbackByTarget={feedbackByTarget}
          deathToasts={ownDeathToasts}
        />
        <div className="flex items-center justify-between">
          <RuneZone runeCardIds={you.runeCardIds} cardsById={cardsById} pulseKey={ownRunePulse} />
          <span className="text-[11px] text-raido-mist">
            Колода {you.deckCount} · Сброс {you.discardCount}
          </span>
        </div>
        <ConductorPanel
          player={you}
          name="Ты"
          icon="🧑"
          align="right"
          targetable={ownTargetable}
          onTap={onTapOwnConductor}
          feedback={feedbackByTarget.get(`conductor:${you.playerId}`) ?? []}
          rank={viewerRank}
          tutorialTarget="own-conductor"
        />
      </section>

      <section className="flex flex-col gap-1.5">
        <HandFan
          cards={you.hand}
          energy={you.energy}
          selectedInstanceId={selection?.kind === 'hand' ? selection.instanceId : null}
          disabled={!isMyTurn || pending}
          onSelect={onSelectHand}
          onPreview={setPreviewCard}
        />

        {actionError ? (
          <p className="text-center text-xs text-raido-redGlow" role="alert">
            {actionError}
          </p>
        ) : null}

        <div className="flex gap-2">
          {selection?.kind === 'hand' ? (
            <Button variant="secondary" onClick={onConfirmPlayNoTarget} disabled={pending} className="flex-1">
              Сыграть без цели
            </Button>
          ) : null}
          <Button
            onClick={onEndTurn}
            disabled={!isMyTurn || pending}
            data-tutorial-target="end-turn"
            className={clsx('min-h-12 flex-1 text-base', isMyTurn && !pending && 'shadow-glow')}
          >
            {pending ? 'Обработка…' : 'Завершить ход'}
          </Button>
        </div>
      </section>

      <HandCardPreview card={previewCard} onClose={() => setPreviewCard(null)} />

      {view.finished ? (
        <ResultModal won={view.winnerId === you.playerId} rewards={rewards} rematchHref={rematchHref} />
      ) : null}
    </div>
  );
}
