# First Player Experience 1.0: Tutorial + Onboarding + First Battle

A new player's first 5-7 minutes: understand the Проводник (Conductor), Energy, how cards are
played, how creatures appear and attack, the difference between Character/Event/Rune/Track, what
Resonance is, how to end a turn, how to win — then land in a normal PvE match without further
prompting. Built on top of the real `@kod-raido/game-engine`, Content Pack 01, and Battlefield
2.0 — none of which were broken or forked for this phase.

## Onboarding flow

`OnboardingGate` (`apps/web/src/components/OnboardingGate.tsx`) mounts once in the root layout and
checks `GET /api/me/tutorial` on every page load — not just right after register/login, so a
returning user who never touched the tutorial still sees it. Three states:

1. **Untouched** (`!startedAt && !skippedAt && !completedAt`): full-screen dialog, title
   "КОД РАЙДО: РЕЗОНАНС", the quote, "Начать обучение" (primary) / "Пропустить" (subtle).
   Skip always works and is never blocked.
2. **Skip confirmed**: a one-shot transient screen ("Ты сможешь пройти обучение позже в
   настройках.") that must render even though `skippedAt` is already set server-side — see
   "Known simplifications" below for why this needed a dedicated code path.
3. **Started but not finished, no matching URL** (tab closed, deep link lost): a small
   non-blocking bottom banner ("◈ Продолжить обучение") links back into the same real match. It
   deliberately never renders while already on that match's own `/tutorial/[matchId]` page - see
   "A real bug found in browser testing" below.

## Tutorial match

`TutorialService.start()` (`apps/game-server/src/tutorial/tutorial.service.ts`) creates a real
match through the same `MatchesService`/`@kod-raido/game-engine` path every PvE match uses -
`applyAction`, validation, bot turns, everything. There is no pseudo-game.

- **Deck**: `TUTORIAL_DECK` (`apps/game-server/src/matches/tutorial-deck.ts`), 30 Content Pack 01
  cards chosen to pass normal deck validation and to surface a Character, an attack, a Rune, a
  Track, an Event, and a Resonance-tier bonus early.
- **Seed**: `TUTORIAL_MATCH_SEED`, a fixed string. The engine's shuffle key is
  `${seed}:setup`, independent of `playerId`, so every player gets the identical deterministic
  opening draw - verified by iterating several candidate seeds against the real seeded DB and
  picking the one with the best early-draw properties.
- **Resonance demo**: a synthetic `BoostSnapshotEntry[]` is built in
  `MatchesService.buildTutorialBoostSnapshot()` and passed straight into `createMatch({
  boostSnapshot })` for tutorial matches only - it never touches `ResonanceService` or writes a
  `ResonanceSnapshot` row, so it cannot leak into real Resonance data for any other match.
- **Bot**: a dedicated `TUTORIAL` `BotDifficulty` (`packages/game-engine/src/bot/pve-bot.ts`).
  `tutorialBotAction()` never seeks lethal early, avoids overloading the board
  (`TUTORIAL_BOT_MAX_BOARD`), and only relaxes toward `EASY`-like behavior after
  `TUTORIAL_GENTLE_TURN_LIMIT` turns - high enough (60) that it is the engine's own fatigue
  mechanic, not the bot, that ends a stalled match. It never fakes or substitutes the match
  result.

## The objective system (generic, never cardId-driven)

`apps/web/src/lib/tutorial-objectives.ts` defines `TUTORIAL_STEPS` (9 steps + a terminal `DONE`
marker) and `evaluateAutoAdvance(step, events, view, cardsById)`, which decides whether the
current step's objective was just satisfied by the latest action's event batch. It only ever
inspects a played card's **type** (`cardTypeOf(cardId) === 'CHARACTER'`, etc.) or generic engine
state (`view.you.runeCardIds.length > 0`, event `type`) - never a specific `cardId`. That is a
hard constraint from the spec, not a style preference: the tutorial deck can change in a future
content pack without touching this file.

| Step | Advance kind | Target on-screen | Objective |
| --- | --- | --- | --- |
| CONDUCTOR | tap | own conductor | read + "Понятно" |
| ENERGY | tap | own conductor | read + "Понятно" |
| PLAY_CHARACTER | auto | a CHARACTER-type hand card | `CARD_PLAYED` resolving to `CHARACTER` |
| END_TURN | auto | End Turn button | own `TURN_END` |
| ATTACK | auto | a ready-to-attack unit | own `ATTACK_DECLARED` |
| PLAY_RUNE | auto | a RUNE-type hand card | `CARD_PLAYED` resolving to `RUNE` |
| PLAY_TRACK | auto | a TRACK-type hand card | `CARD_PLAYED` resolving to `TRACK` |
| PLAY_EVENT | auto | an EVENT-type hand card | `CARD_PLAYED` resolving to `EVENT` |
| RESONANCE | auto | the Resonance badge | active rune **and** a played CHARACTER **and** a bonus-effect event, all in the same batch |

`resolveResumeStep()` re-derives a safe resume point from live match state (not from events) for
the two steps that have a durable state signal (`PLAY_CHARACTER`: board non-empty;
`PLAY_RUNE`: an active rune) - covering the common refresh case without needing to replay
history. Steps without a durable signal (`PLAY_TRACK`, `PLAY_EVENT`, `RESONANCE`'s bonus pulse)
rely on the overlay's manual "Продолжить обучение" fallback instead - see "Known
simplifications."

## `TutorialOverlay`: additive, not a second Battlefield

`apps/web/src/components/battlefield/TutorialOverlay.tsx` is a `position: fixed` sibling
rendered by `/tutorial/[matchId]/page.tsx` alongside the *unmodified* `<MatchBoard>` - it finds
its target via `document.querySelector('[data-tutorial-target="..."]')`, so it needs no prop
threading into Battlefield 2.0's component tree at all. The only changes to the battlefield
components themselves are additive `data-tutorial-target` attributes, each computed from
existing generic data the component already had:

- `ConductorPanel`: new `tutorialTarget` prop, set to `"own-conductor"` only on the viewer's own
  panel in `MatchBoard.tsx`.
- `HandFan`/`HandCardItem`: `HAND_TUTORIAL_TARGET[card.type]` - keyed by type, so it works for any
  hand card of the right type, not a specific one.
- `CreatureSlot`: `data-tutorial-target="own-board"` exactly when `readyToAttack` is already true
  - reusing the flag that already drives the ready-glow animation.
- `MatchBoard.tsx`: `data-tutorial-target="end-turn"` on the End Turn button, `"resonance"` on the
  wrapper around `ResonancePulse`/`TrackZone`.

The overlay itself: a cutout spotlight (a positioned box with `box-shadow: 0 0 0 9999px
rgba(...)` plus a pulsing border, `.animate-spotlight-ring`/`.animate-spotlight-ring-strong`),
tracked every frame via `requestAnimationFrame` so it follows animated targets (a selected hand
card translates up); a tooltip positioned above or below the target (whichever has more room),
clamped to the viewport, measured via `ResizeObserver` so its own size feeds back into the
placement math. No hard blocking modal anywhere - the darkening layer and spotlight box are
`pointer-events: none`, only the tooltip itself is interactive. After 2+ recorded wrong attempts
the spotlight ring switches to a faster/brighter variant (soft intensification, never an error
message). A manual "Продолжить обучение" link appears in the tooltip after ~22s on the same step
as the section-18 recovery fallback - it only moves the tutorial's own step pointer forward
(`saveTutorialStep`), it never touches match state or fakes an engine action.

## Reward, persistence, replay

- `User` gains `tutorialStartedAt`/`tutorialCompletedAt`/`tutorialSkippedAt`/`tutorialCurrentStep`/
  `tutorialRewardClaimedAt`; `Match` gains `isTutorial`.
- `TutorialService.complete()` is server-authoritative: it requires a real `Match` row with
  `isTutorial: true, status: 'FINISHED', winnerId: userId` before granting anything - the
  client's claim is never trusted alone. The one-time reward (`TUTORIAL_REWARD` =
  +100 XP / +300 soft currency, `packages/shared/src/progression.ts`) is gated behind
  `tutorialRewardClaimedAt`, a separate timestamp from `tutorialCompletedAt` - so a later replay
  can update `tutorialCompletedAt` again (expected, and shown correctly) without re-granting.
- Skip never permanently forfeits the reward: nothing about the reward path depends on
  `tutorialSkippedAt`. If a skipped user later plays the tutorial via Settings and wins, they get
  it exactly once, the same as a first-time player.
- `finishTutorialMatch()` never touches `user.xp`/`softCurrency`/`mmr` directly - only
  `complete()`'s reward transaction does. `listHistory()` excludes `isTutorial: true` matches, so
  tutorial matches never show up in, or affect, normal PvE/PvP win-loss stats.
- Replay: Settings → "Пройти обучение снова" calls the same `startTutorial` endpoint used by the
  first playthrough.

## Post-tutorial screens

- `/tutorial/victory`: "РЕЗОНАНС УСЛЫШАЛ ТЕБЯ" → "Обучение завершено." → reward numbers → 3
  cards (КОЛЛЕКЦИЯ/КОЛОДЫ/ИГРАТЬ, each with a one-liner) → "Продолжить".
- `/tutorial/archetypes`: the 6 existing Content Pack 01 starter decks (`STARTER_ARCHETYPES`,
  `apps/web/src/lib/starter-archetypes.ts`) with a one-liner and a ПРОСТО/СРЕДНЕ/СЛОЖНО label -
  informational only, no gameplay effect. "Начать бой" leads to `/play`.

## Contextual help, keyword tooltips, Resonance explanation

All three read from one shared registry, `KEYWORD_REGISTRY`
(`packages/shared/src/keywords.ts`) - a `KeywordId → {title, description, matchStems}` map,
never a per-card lookup:

- **Help sheet**: `HelpSheet` (`apps/web/src/components/battlefield/HelpSheet.tsx`), a "?" button
  in the Battlefield header opening a compact sheet that lists every keyword's title +
  description. On-demand only - no persistent hints once the tutorial is over.
- **In-text keyword tooltips**: `KeywordText` (`apps/web/src/components/KeywordText.tsx`) scans
  ability text for any `matchStems` occurrence (case-insensitive, extended to the end of the
  Cyrillic word so "Скрыт" highlights "Скрытым" in full), renders each match as a tappable
  underlined span that opens a small popover with the registry's title/description. Wired into
  `CardDetailDrawer` and `HandCardPreview`.
- **Resonance explanation**: `explainCardResonance(card)`
  (`packages/shared/src/resonance-explain.ts`) walks the card's own DSL
  (`RESONANCE_TIER_AT_LEAST` conditions) and produces a per-tier list of what actually changes,
  in Russian, via a generic `describeAction()` over `EffectActionType`. `CardDetailDrawer`
  replaced its earlier ad-hoc `describeResonanceBehavior()` (Content Pack 01 phase) with this -
  same idea, now shared and tier-by-tier instead of a single summary sentence.

## Analytics

`AnalyticsEventsService` (`apps/game-server/src/analytics-events/`) is a `@Global()` first-party
event log (`AnalyticsEvent` table: `type`, `userId?`, `payloadJson`, `createdAt`) - no
third-party analytics SDK, no personal data beyond `userId`. Events: `tutorialStarted`,
`tutorialStepReached` (payload `{ step }`, one row per client-driven `saveStep` call),
`tutorialCompleted` (logged on every `complete()` call, including replays),
`tutorialSkipped`, `firstPvEStarted`/`firstPvEFinished` (logged once per user via `logOnce`).

`AnalyticsService.getSummary()` (`apps/game-server/src/admin/analytics.service.ts`) adds:

- `tutorialStartedUsers` / `tutorialCompletedUsers` / `tutorialSkippedUsers` - counted from the
  `User` timestamp fields.
- `completionRate` - `tutorialCompletedUsers / tutorialStartedUsers`, `0` if nobody has started.
- `dropOffByStep` - for users who started but neither completed nor skipped, the furthest
  `tutorialStepReached` step they reached, bucketed by step index.
- `firstPvEAfterTutorial` - users who completed or skipped the tutorial and then have a
  `firstPvEStarted` event, i.e. successfully funneled into a normal match.

## Mobile UX and accessibility

Verified live at 360×800, 390×844, and 412×915 (see Testing below): no horizontal scroll, the
tooltip clamps within the viewport and is repositioned above/below the target based on available
space. Accessibility: the spotlight box has a visible border (not color-only), the tooltip is
`role="status" aria-live="polite"` with `aria-describedby` on the spotlight box pointing at the
tooltip body; `prefers-reduced-motion: reduce` disables `.animate-spotlight-ring`/
`.animate-spotlight-ring-strong` (added to the existing reduced-motion rule in
`apps/web/src/app/globals.css` alongside the Battlefield 2.0 animations).

## Failure/recovery

- **Refresh mid-tutorial**: `resolveResumeStep()` fast-forwards past `PLAY_CHARACTER`/`PLAY_RUNE`
  if state already proves them done; the manual "Продолжить обучение" fallback covers the rest.
- **Lost the tab/deep link**: the `OnboardingGate` resume banner (see Onboarding flow above).
- **Unexpected state mismatch / target not yet mounted**: `TutorialOverlay` falls back to a plain
  dim layer with a centered tooltip instead of rendering nothing.
- **Tutorial match ends in a loss** (rare, given the bot's constraints, but not impossible):
  `/tutorial/[matchId]/page.tsx` shows "Учебный бой не удался" with a "Попробовать снова" button
  that starts a fresh match - the real result is never overridden or hidden.

## Testing

- Unit: `packages/shared/src/keywords.test.ts` (7), `resonance-explain.test.ts` (4);
  `packages/game-engine/src/bot/pve-bot.test.ts` (TUTORIAL-difficulty cases, part of 12);
  `apps/game-server/src/tutorial/tutorial.service.spec.ts` (8, covers progress/start/complete
  exactly-once-reward/skip); `apps/game-server/src/matches/matches.service.spec.ts`
  (`createTutorialMatch` block, part of 21); `apps/game-server/src/admin/analytics.service.spec.ts`
  (tutorial funnel fields, part of 10); `apps/web/src/lib/tutorial-objectives.test.ts` (8, the
  objective evaluator - explicitly asserts it keys off card TYPE, never `cardId`). 252 tests
  across the monorepo, all green (`npm run test --workspaces`).
- End-to-end: `apps/web/e2e/tutorial-fpx.spec.ts` (`@playwright/test`, 6 tests) - the full golden
  path (register → onboarding → all 9 steps → victory → archetypes → `/play`), refresh mid-tutorial,
  skip, replay, 360×800 layout, `prefers-reduced-motion`. Requires a running local stack
  (Postgres + Redis + seeded game-server on `:4000` + this app on `:3000`); not part of `npm test`
  / CI - run manually with `npm run test:e2e -w apps/web`.

### Real problems found via live browser testing (and fixed)

1. **Tutorial bot could end the match against the player.** The initial gentle-turn window
   (`TUTORIAL_GENTLE_TURN_LIMIT = 10`) was too short - a scripted playthrough exceeded it and lost
   to an ordinary attack the relaxed post-window bot made. Raised to 60 turns (comfortably past a
   typical match length), so a stalled tutorial match ends via the engine's own fatigue mechanic
   instead. Re-verified with live playthroughs after the fix.
2. **The `OnboardingGate` "resume tutorial" banner rendered on top of the live tutorial match
   itself**, overlapping the hand and End Turn button - because the banner's visibility check
   only looked at tutorial progress fields, not at which page was currently open. Fixed by adding
   a `pathname === '/tutorial/${activeMatchId}'` guard so the banner never shows while already on
   that exact match.
3. **The skip confirmation screen never rendered.** The instant `skipTutorial` succeeds,
   `progress.skippedAt` is set in the query cache, which flips `untouched` to `false` on the very
   next render - and the newly-added "resume banner" branch returned `null` before the
   `skipConfirmed` local-state screen ever got a chance to show. Fixed by checking
   `skipConfirmed` first, ahead of every other branch.

One dev-only artifact was also observed and is **not** a product bug: intermittent 404s for
`_next/static/...` chunks during the live testing session, traced to running `next build`
(production) against the same `.next` directory a `next dev` process was using concurrently -
classic dev-server asset-manifest staleness. Confirmed absent from the actual production build
(`next build` succeeds cleanly with all 15 routes) and from a freshly-restarted dev server.

## Known simplifications

- `resolveResumeStep()` only fast-forwards `PLAY_CHARACTER` and `PLAY_RUNE` from live state; a
  refresh during `PLAY_TRACK`/`PLAY_EVENT`/`RESONANCE` relies on the manual "Продолжить обучение"
  fallback rather than a perfect state-based reconstruction (Tracks/Events don't leave board
  state, and the Resonance bonus pulse is inherently transient).
- `END_TURN`'s state-based fast-forward, if ever added, would need to distinguish "you already
  ended your first turn" from "it's turn 1 and the round counter hasn't moved" - not attempted
  here; not needed since `END_TURN` doesn't have a `STATE_SATISFIED` entry (it's simply left as
  the resume point, which is always correct, just not always the furthest-possible one).
- The starter archetype one-liners (`STARTER_ARCHETYPES`) are original copy written for this
  phase, not sourced from a pre-existing marketing document - the six decks and their difficulty
  tier were already fixed by Content Pack 01's seed data.
- `dropOffByStep` buckets by the furthest `tutorialStepReached` event a stalled user has - a
  client-driven bookmark (never used to gate anything server-side), so a user who never called
  `saveTutorialStep` at all before abandoning buckets at step 0, even if they were visibly further
  along in the UI.
