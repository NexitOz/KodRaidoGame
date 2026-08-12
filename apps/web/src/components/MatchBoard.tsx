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
import { Button, type IconName } from '@kod-raido/ui';
import { api } from '@/lib/api';
import { useCombatFeedback } from '@/lib/use-combat-feedback';
import { computeViewerResonanceHeat } from '@/lib/resonance-heat';
import { ConductorPanel } from './battlefield/ConductorPanel';
import { CreatureRow } from './battlefield/CreatureRow';
import { OpponentHandBacks } from './battlefield/OpponentHandBacks';
import { HandFan } from './battlefield/HandFan';
import { HandCardPreview } from './battlefield/HandCardPreview';
import { TrackZone } from './battlefield/TrackZone';
import { CardPlayReveal } from './battlefield/CardPlayReveal';
import { RuneZone } from './battlefield/RuneZone';
import { TurnOverlay } from './battlefield/TurnOverlay';
import { EventLogSheet } from './battlefield/EventLogSheet';
import { HelpSheet } from './battlefield/HelpSheet';
import { ResultModal } from './battlefield/ResultModal';
import { ArenaSurface } from './battlefield/arena/ArenaSurface';
import { ArenaCore } from './battlefield/arena/ArenaCore';
import { DeckPile } from './battlefield/arena/DeckPile';
import { DiscardPile } from './battlefield/arena/DiscardPile';
import { EndTurnArtifact } from './battlefield/arena/EndTurnArtifact';
import styles from './MatchBoard.module.css';

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
  opponentIcon: IconName;
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

  const { items, deathToasts, resonanceTriggerKey, runeTriggerKey, cardPlayTrigger } = useCombatFeedback(events);
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
    <ArenaSurface isMyTurn={isMyTurn} className={clsx('mx-auto w-full pb-20', styles.board)}>
      <TurnOverlay activePlayerId={view.activePlayerId} isMyTurn={isMyTurn} />

      <header className={clsx('flex items-center justify-between text-xs text-raido-mist', styles.header)}>
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

      <div className={styles.banner}>{banner}</div>

      <section className={clsx('flex flex-col gap-1.5', styles.oppStatus)}>
        <ConductorPanel
          player={opponent}
          name={opponentName}
          icon={opponentIcon}
          align="left"
          targetable={targetingEnemy}
          onTap={onTapEnemyConductor}
          feedback={feedbackByTarget.get(`conductor:${opponent.playerId}`) ?? []}
          active={!isMyTurn}
        />
      </section>

      <section className={clsx('flex flex-col gap-1.5', styles.oppContent)}>
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
        <div className="flex items-center gap-3">
          <DeckPile count={opponent.deckCount} />
          <DiscardPile count={opponent.discardCount} />
        </div>
      </section>

      <section className={clsx('relative flex items-center justify-center py-1', styles.core)} data-tutorial-target="resonance">
        <ArenaCore tier={resonanceHeat} triggerKey={resonanceTriggerKey} isMyTurn={isMyTurn} />
        <TrackZone trigger={cardPlayTrigger} cardsById={cardsById} />
        <CardPlayReveal trigger={cardPlayTrigger} cardsById={cardsById} />
      </section>

      <section className={clsx('flex flex-col gap-1.5', styles.plyContent)}>
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
          <div className="flex items-center gap-3">
            <DeckPile count={you.deckCount} align="right" />
            <DiscardPile count={you.discardCount} align="right" />
          </div>
        </div>
      </section>

      <section className={clsx('flex flex-col gap-1.5', styles.plyStatus)}>
        <ConductorPanel
          player={you}
          name="Ты"
          icon="player"
          align="right"
          targetable={ownTargetable}
          onTap={onTapOwnConductor}
          feedback={feedbackByTarget.get(`conductor:${you.playerId}`) ?? []}
          rank={viewerRank}
          tutorialTarget="own-conductor"
          active={isMyTurn}
        />
      </section>

      <section className={clsx('flex flex-col gap-1.5', styles.handSection)}>
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
          <EndTurnArtifact
            onClick={onEndTurn}
            disabled={!isMyTurn || pending}
            pending={pending}
            isMyTurn={isMyTurn}
            className="flex-1"
          />
        </div>
      </section>

      <HandCardPreview card={previewCard} onClose={() => setPreviewCard(null)} />

      {view.finished ? (
        <ResultModal won={view.winnerId === you.playerId} rewards={rewards} rematchHref={rematchHref} />
      ) : null}
    </ArenaSurface>
  );
}
