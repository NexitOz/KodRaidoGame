# Player Progression & Economy 1.0

"The reason to play another match." A server-authoritative, idempotent early progression loop on
top of the existing account `level`/`xp`/`softCurrency` fields: every real (non-tutorial) match
now grants XP and soft currency ("Эхо"), account levels 2-10 unlock rewards, and players see their
progress on Home, on the post-match Result screen, and on a new `/profile` page.

This is a progression **foundation**, not monetization: no real-money purchases, no premium
currency, no shop, no loot boxes, no crafting/dust, no card-power-from-level. Account level never
changes combat stats (HP, energy, attack, health, Resonance tier, draw, deck size) - it only ever
grants soft currency and cosmetics.

## XP / Echo sources

Central source of truth: `packages/shared/src/progression.ts` → `REWARD_TABLE`,
`FIRST_WIN_OF_DAY_BONUS`, `LEVEL_REWARDS`. Nothing is hardcoded in `MatchesService` or in React
components.

| Mode | Win XP | Win Эхо | Loss XP | Loss Эхо |
|---|---|---|---|---|
| PvE | 60 | 25 | 35 | 10 |
| Casual PvP (architecture only - no casual queue exists yet) | 90 | 35 | 55 | 15 |
| Ranked PvP (the one live PvP queue - MMR-rated) | 110 | 45 | 65 | 20 |

A draw is scored as a loss (`rewardOutcomeFor`) - the spec only defines WIN/LOSS tiers and draws
are rare (both conductors reach 0 the same turn).

**First win of the day**: +50 XP and +50 Эхо, once per account per UTC calendar day, only on a
WIN in a reward-bearing match (`User.lastFirstWinBonusDate`, a plain `"YYYY-MM-DD"` string compared
by exact match - no DateTime/timezone arithmetic).

**Tutorial** keeps its own separate one-time reward (`TutorialService.complete()` /
`TUTORIAL_REWARD`), unaffected by this system - see "Tutorial interaction" below.

## Account level curve

`packages/shared/src/progression.ts`: `xpRequiredForLevel(level)`, `levelForXp(totalXp)`
(`computeLevelForXp` is a backward-compatible alias), `xpProgressForLevel(totalXp)`. Levels 1-30
(`MAX_LEVEL`). Level 1 = 0 XP; each subsequent level costs 20 more XP than the previous step:

```
Level 1 →   0 XP
Level 2 → 100 XP
Level 3 → 220 XP
Level 4 → 360 XP
Level 5 → 520 XP
...
```

## Level-up rewards (levels 2-10)

Data-driven, minimal unlock model (`LEVEL_REWARDS`) - no dedicated skins/cosmetics subsystem.
`CURRENCY` rewards apply directly to `softCurrency`; `COSMETIC` rewards create a generic
`UserUnlock` row (`type`, `key`, `source: 'LEVEL_UP'`) the client renders as a labelled chip.
Cosmetic keys are original Kod Raido placeholders - no third-party assets.

| Level | Reward |
|---|---|
| 2 | 100 Эхо |
| 3 | 150 Эхо |
| 4 | Значок профиля (cosmetic) |
| 5 | 200 Эхо |
| 6 | Рубашка карты (cosmetic) |
| 7 | 250 Эхо |
| 8 | Эмблема профиля (cosmetic) |
| 9 | 300 Эхо |
| 10 | Рамка RAIDO (cosmetic) |

Crossing multiple levels in one match grants every reward in between (see `MatchRewardService`
test I).

## MatchRewardService

`apps/game-server/src/progression/match-reward.service.ts` - the single place that grants
match XP/currency. `MatchesService.finishPveMatch`/`finishPvpMatch` call
`grantMatchReward({ userId, matchId, mode, result })` instead of doing reward math inline; PvP
calls it once per player. It returns `{ granted, xpGranted, softCurrencyGranted, firstWinBonus,
previousLevel, newLevel, levelsGained, rewardsUnlocked, currentLevelXp, nextLevelXp,
progressPercent }`.

### Idempotency and concurrency

Two protections, addressing two different races:

- **Same match, called twice** (page refresh re-rendering the result, a reconnect, a genuine race
  between two concurrent requests for the same `matchId`): a `MatchReward` row (`matchId` +
  `userId` unique) is the atomic claim - the service always `INSERT`s it **before** touching
  `User.xp`/`softCurrency`/`level`/`lastFirstWinBonusDate`/`highestRewardedLevel`. The losing call
  hits the row's unique constraint, is caught (narrowly - only when the violation's `meta.target`
  actually names the `MatchReward` (matchId, userId) index, never any arbitrary P2002), and returns
  the *original* grant's numbers with `granted: false` - no second mutation. Postgres enforces the
  constraint at the database level, so this holds under real concurrency, not just in a
  single-threaded fake.
- **Two different matches finishing concurrently for the same account**: the constraint above does
  nothing to protect this case on its own - both transactions would otherwise read the same
  pre-reward `User` row and each compute its reward against that same stale snapshot, silently
  discarding one of the two updates (a lost-update race). The transaction's first statement is
  `SELECT id FROM "users" WHERE id = $userId FOR UPDATE`, which serializes reward transactions for
  the *same* account only - the second transaction's read only happens after the first has fully
  committed. Rewards for two *different* accounts are never blocked by each other; there is no
  global economy lock.

Verified against a real local PostgreSQL instance (not just the fake-Prisma unit tests, which
cannot reproduce real transaction/row-lock isolation) via
`apps/game-server/scripts/verify-concurrency.ts` - a one-off manual script, not part of CI (this
repo has no DB-backed integration test infrastructure). It creates a throwaway user and fires two
concurrent `grantMatchReward` calls for different matches, then asserts the final row state
directly via SQL. All three scenarios passed: two concurrent wins (no lost XP/currency, exactly
one `firstWinBonus`, correct level/`highestRewardedLevel`), a concurrent win+loss (only the win
ever carries the bonus), and same-match concurrent duplicates (still exactly one grant). Run it
manually with `npx tsx scripts/verify-concurrency.ts` from `apps/game-server` against a local
Postgres to re-verify after any future change to this locking.

### No resurrection / no retroactive rewards

`User.highestRewardedLevel` is nullable. On an account's very first reward-granting match after
this system shipped, a `null` value is lazily bootstrapped to that match's *previous* level (the
level already reached before this match's XP) - so existing accounts are never retroactively paid
for levels they already crossed under the old flat curve. Only levels crossed by this and future
matches are rewarded. New accounts start at level 1 with no XP, so this has no visible effect for
them - the bootstrap only matters for accounts that existed before this phase shipped.

### Economy versioning

Every `MatchReward` row stores `economyVersion` (`ECONOMY_VERSION` in `progression.ts`, currently
`"1"`). Rebalancing `REWARD_TABLE`/`FIRST_WIN_OF_DAY_BONUS` later bumps this constant; existing
reward rows are never recalculated with new numbers.

## Player state API

`GET /me/progression` (spec section 20 names this `/profile/progression` - implemented under the
existing `/me` prefix instead, consistent with `/me/collection`, `/me/decks`, `/me/matches`,
`/me/tutorial`). Returns `level`, `totalXp`, `currentLevelXp`, `nextLevelXp`, `progressPercent`,
`softCurrency`, `firstWinClaimedToday`, `nextReward`, `unlockedCosmetics`, and `stats`
(wins/losses/winRate/pveWins/pvpWins derived from finished, non-tutorial `Match` rows). The client
never re-derives progression rules - `ProgressionService` computes everything server-side.

## UI surfaces

- **Result screen** (`ResultModal`): XP/Эхо reward line, a first-win-of-day badge, a level-up
  block (short `level-up-ring` animation, ≤1s, disabled under Low Data Mode and
  `prefers-reduced-motion` the same way `rune-reveal`/`event-flash` already are), an XP progress
  bar, and any unlocked level rewards. CTA row: Сыграть ещё / Коллекция / Главная.
- **Home** (authenticated only): a compact "Твой прогресс" card - level, XP bar, Эхо, first-win
  status, a `Играть` CTA, and a link to `/profile`.
- **`/profile`** (new page): full XP bar, Эхо, win/loss/win-rate/PvE-wins/PvP-wins stats, unlocked
  cosmetics count, next-reward preview, and a compact recent-matches list with each match's
  server-recorded `+XP`/`+Эхо`.
- **TopBar**: a profile icon-link next to Settings.

Rewards are granted automatically server-side when a match finishes - there is no "claim reward"
button anywhere. If the client closes the tab immediately after victory, the reward is already
persisted; a later login/reload/profile visit shows it.

## Admin visibility

`GET /admin/analytics/rewards` (AdminKeyGuard-protected, same guard as the existing
`/admin/analytics/summary`) - the most recent `MatchReward` grants with the granting user's
current level/xp/soft-currency for context. Read-only; there is no self-service
currency-adjustment endpoint anywhere in `AdminModule`.

## Analytics events

`matchRewardGranted`, `firstWinOfDayGranted`, `levelUp`, `progressionRewardUnlocked` - logged via
the existing first-party `AnalyticsEventsService` (no new third-party pipeline), with only
non-sensitive metadata (mode/result/level-before/level-after/xp/currency).

## Tutorial interaction

Tutorial rewards remain fully separate: `TutorialService.complete()` grants its own one-time
`TUTORIAL_REWARD` via its own atomic claim (`tutorialRewardClaimedAt`), never routed through
`MatchRewardService`. This was a deliberate choice to avoid regression risk in an already-shipped,
well-tested reward path - not an oversight.

## Starter decks

Unaffected. A fresh account still receives a starter collection and all 6 starter decks
(Starter Deck Provisioning 1.0); all of their PvE matches now additionally grant progression
rewards on top of that existing flow.

## Anti-abuse (known limitation)

A reward-bearing match must actually reach `FINISHED` with a server-authoritative
`state.winnerId`/draw outcome - there is no separate "did the match last long enough" check (e.g.
a minimum turn count) gating the reward. Adding one would require touching the match-finish
contract shared by PvE/PvP/forfeit paths; flagged here as a known gap for a future anti-abuse
phase rather than solved speculatively in this one.

## Future extension points

- A real casual PvP queue can use `REWARD_TABLE.CASUAL_PVP` immediately - the numbers already
  exist, only the queue itself is missing.
- Levels 11-30 have no reward defined yet (`LEVEL_REWARDS` only covers 2-10, per spec); extending
  the table is additive and doesn't require touching `MatchRewardService`.
- A `RewardTransaction`-style audit ledger was considered (spec section 16) but skipped:
  `MatchReward` already answers "why did this account gain X XP/Эхо" for every match, and level-up
  currency amounts are derived deterministically from `LEVEL_REWARDS[level]`, so a second ledger
  table would be pure duplication for no additional provable fact.
