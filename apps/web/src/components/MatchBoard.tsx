'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
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
import { ResonanceMeter } from './battlefield/arena/ResonanceMeter';
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

  // Enlarged card preview: a plain tap on a hand card opens it, tapping it again (or the artwork
  // inside the modal) closes it. Independent from `selection` - previewing never arms a card.
  const [previewCard, setPreviewCard] = useState<Card | null>(null);
  const [previewedInstanceId, setPreviewedInstanceId] = useState<string | null>(null);

  function togglePreview(card: Card, instanceId: string) {
    if (previewedInstanceId === instanceId) {
      setPreviewCard(null);
      setPreviewedInstanceId(null);
    } else {
      setPreviewCard(card);
      setPreviewedInstanceId(instanceId);
    }
  }

  function closePreview() {
    setPreviewCard(null);
    setPreviewedInstanceId(null);
  }

  /** Maps a completed drag's `data-drop-zone` string to the existing (unchanged) targeting
   * handlers - a drag never introduces a new gameplay action, it only chooses which of the
   * already-existing handlers a single gesture ends up calling. */
  function resolveDropZone(zone: string) {
    if (zone === 'own-conductor') return onTapOwnConductor();
    if (zone === 'enemy-conductor') return onTapEnemyConductor();
    if (zone.startsWith('own-unit:')) {
      const unit = you.board.find((u) => u.instanceId === zone.slice('own-unit:'.length));
      return unit ? onSelectOwnUnit(unit) : onConfirmPlayNoTarget();
    }
    if (zone.startsWith('enemy-unit:')) {
      const unit = opponent.board.find((u) => u.instanceId === zone.slice('enemy-unit:'.length));
      return unit ? onTapEnemyUnit(unit) : onConfirmPlayNoTarget();
    }
    // 'own-empty' (character summon) or the generic 'board' catch-all (no explicit target).
    return onConfirmPlayNoTarget();
  }

  // `onSelectHand` (arm) and the target handlers both read `selection` from the parent page's own
  // state, one render apart - a drag's "arm, then resolve" has to be sequenced across that render
  // boundary too, via this ref + effect, rather than calling both in the same tick.
  const pendingDropZoneRef = useRef<string | null>(null);

  function playByDrag(instanceId: string, cost: number, zone: string | null) {
    if (!zone) return; // released somewhere that isn't a valid target - cancel, arm nothing
    if (selection?.kind === 'hand' && selection.instanceId === instanceId) {
      // Already armed (e.g. a previous drag's play attempt errored out) - resolve immediately,
      // re-arming would toggle it off instead.
      resolveDropZone(zone);
      return;
    }
    pendingDropZoneRef.current = zone;
    onSelectHand(instanceId, cost);
  }

  useEffect(() => {
    const zone = pendingDropZoneRef.current;
    if (!zone || selection?.kind !== 'hand') return;
    pendingDropZoneRef.current = null;
    resolveDropZone(zone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection]);

  const resonanceHeat = computeViewerResonanceHeat(view);
  const opponentDeathToasts = deathToasts.filter((d) => d.ownerId === opponent.playerId);
  const ownDeathToasts = deathToasts.filter((d) => d.ownerId === you.playerId);
  const opponentRunePulse = runeTriggerKey?.playerId === opponent.playerId ? runeTriggerKey.key : 0;
  const ownRunePulse = runeTriggerKey?.playerId === you.playerId ? runeTriggerKey.key : 0;

  return (
    <ArenaSurface isMyTurn={isMyTurn} className={clsx('mx-auto w-full pb-24 lg:pb-2', styles.board)}>
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

      {/* Battlefield Art Asset pass: everything below lives inside `.stage`. At mobile it's a plain
          wrapper (same flow as before, unchanged visual result). At lg it becomes the aspect-ratio-
          locked box carrying the illustrated `kod-raido-arena-base.webp` asset, and every section
          below individually escapes to `position:absolute` (percentage-anchored to that asset's
          geometry) via its own CSS-module class - see MatchBoard.module.css for the coordinates. */}
      <div className={styles.stage} data-drop-zone="board">
        {/* Opponent band: deck/discard (left) - hero medallion (center) - hand backs + board below.
            Both mobile and desktop now render on top of a real illustrated `.stage` asset, so these
            wrappers always collapse via `contents` - every slot below resolves its own
            `position:absolute` percentages against `.stage` itself, not against an intermediate
            flex box. */}
        <section className="contents" data-drop-zone="board">
          <div className="contents">
            <div className="contents">
              <div className={styles.oppDeckSlot}>
                <DeckPile count={opponent.deckCount} label="Колода" side="opponent" />
              </div>
              <div className={styles.oppDiscardSlot}>
                <DiscardPile count={opponent.discardCount} label="Сброс" side="opponent" />
              </div>
            </div>
            <div className={styles.oppCommanderSlot}>
              <ConductorPanel
                player={opponent}
                name={opponentName}
                icon={opponentIcon}
                align="left"
                targetable={targetingEnemy}
                onTap={onTapEnemyConductor}
                feedback={feedbackByTarget.get(`conductor:${opponent.playerId}`) ?? []}
                active={!isMyTurn}
                dropZone="enemy-conductor"
                side="opponent"
              />
            </div>
            <div
              className={clsx(
                'flex flex-col items-center gap-1 rounded-xl border border-raido-red/30 bg-black/50 px-2.5 py-1.5 [box-shadow:inset_0_2px_6px_rgba(0,0,0,0.65)]',
                styles.oppHandBacksSlot,
              )}
            >
              <OpponentHandBacks count={opponent.handCount} />
              <RuneZone runeCardIds={opponent.runeCardIds} cardsById={cardsById} pulseKey={opponentRunePulse} />
            </div>
          </div>
          <div className={styles.oppLane}>
            <CreatureRow
              units={opponent.board}
              targetableIds={opponentTargetable}
              hasActiveSelection={targetingEnemy}
              interactiveIds={opponentTargetable}
              onSelect={onTapEnemyUnit}
              feedbackByTarget={feedbackByTarget}
              deathToasts={opponentDeathToasts}
              dropZonePrefix="enemy"
            />
          </div>
        </section>

        <section
          className={clsx('relative flex items-center justify-center py-0 lg:py-0', styles.core, styles.coreSlot)}
          data-tutorial-target="resonance"
          data-drop-zone="board"
        >
          <ArenaCore tier={resonanceHeat} triggerKey={resonanceTriggerKey} isMyTurn={isMyTurn} />
          <TrackZone trigger={cardPlayTrigger} cardsById={cardsById} />
          <CardPlayReveal trigger={cardPlayTrigger} cardsById={cardsById} />
        </section>

        {/* Player band: board - hero medallion flanked by deck/discard (left) and Resonance (right,
            the only side we ever have real Resonance data for - see ResonanceMeter). */}
        <section className="contents" data-drop-zone="board">
          <div className={styles.plyLane}>
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
              dropZonePrefix="own"
            />
          </div>
          {you.runeCardIds.length > 0 ? (
            <div className={clsx('flex items-center justify-between', styles.plyRuneSlot)}>
              <RuneZone runeCardIds={you.runeCardIds} cardsById={cardsById} pulseKey={ownRunePulse} />
            </div>
          ) : null}
          <div className="contents">
            <div className="contents">
              <div className={styles.plyDeckSlot}>
                <DeckPile count={you.deckCount} label="Колода" side="player" />
              </div>
              <div className={styles.plyDiscardSlot}>
                <DiscardPile count={you.discardCount} label="Сброс" side="player" />
              </div>
            </div>
            <div className={styles.plyCommanderSlot}>
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
                dropZone="own-conductor"
                side="player"
              />
            </div>
            <div className={styles.resonanceSlot}>
              <ResonanceMeter
                tier={resonanceHeat}
                triggerKey={resonanceTriggerKey}
                align="right"
                className="w-20 sm:w-32 lg:w-full"
              />
            </div>
          </div>
        </section>

        <section className={clsx('flex flex-col gap-1.5', styles.handSection)}>
          <HandFan
            cards={you.hand}
            energy={you.energy}
            previewedInstanceId={previewedInstanceId}
            disabled={!isMyTurn || pending}
            onTogglePreview={togglePreview}
            onPlayByDrag={playByDrag}
          />

          {actionError ? (
            <p className="text-center text-xs text-raido-redGlow" role="alert">
              {actionError}
            </p>
          ) : null}

          {selection?.kind === 'hand' ? (
            <Button variant="secondary" onClick={onConfirmPlayNoTarget} disabled={pending} className="w-full">
              Сыграть без цели
            </Button>
          ) : null}
        </section>

        {/* Kept as its own `.stage` child (not nested in `.handSection`, which is itself
            `position:absolute` at lg) specifically so its `.endTurnSlot` percentages resolve
            against `.stage` - the illustrated asset's own coordinate system - rather than against
            handSection's much smaller box. Mobile: a plain full-width block right below the hand
            controls (same visual neighborhood as before, just its own row instead of sharing one
            with "Сыграть без цели"). Desktop: anchored over the illustrated right-side machinery. */}
        <div className={styles.endTurnSlot}>
          <EndTurnArtifact onClick={onEndTurn} disabled={!isMyTurn || pending} pending={pending} isMyTurn={isMyTurn} />
        </div>
      </div>

      <HandCardPreview
        card={previewCard}
        onClose={closePreview}
        onPlay={
          previewCard && previewedInstanceId
            ? () => {
                onSelectHand(previewedInstanceId, previewCard.cost);
                closePreview();
              }
            : undefined
        }
      />

      {view.finished ? (
        <ResultModal won={view.winnerId === you.playerId} rewards={rewards} rematchHref={rematchHref} />
      ) : null}
    </ArenaSurface>
  );
}
