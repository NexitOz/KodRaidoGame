# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** **COMPLETE END TO END — CARD 04 LIVE IN PRODUCTION**
- **Detail:** Art Pack 03 Cards 01–04 are all complete end to end and live in production. Nothing in this pack is outstanding.
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md` — executed and closed
- **Current task commit:** `600aed56eb0b724fa6ccb6522818a5bb82adbbaa`
- **Latest report:** `docs/agent-reports/2026-09-01-art-pack-03-card-04-production-sync.md`
- **Latest task-result commit:** `4ff241ccc82c67578adbb2dcaffc035e1b84c389`
- **Branch / PR:** `main` — docs-only closeout, no PR, same pattern as the Card 03 production-sync record
- **Production workflow dispatched:** **YES — exactly once**
- **`SYNC-13-CARD-ART-PRODUCTION`:** **CONSUMED** (Card 03, run `33436786024`) — must never be reused
- **`SYNC-14-CARD-ART-PRODUCTION`:** **CONSUMED** (Card 04, run `33560559977`) — must never be reused
- **Open blockers:** none
- **Recommended next action:** owner spot-checks Card 04 in the live client; the next art pack card starts from a fresh owner brief. See the "Follow-ups" section below for two small cleanups.

## Card 04 production sync — closed record

| Item                  | Value                                                                          |
| --------------------- | ------------------------------------------------------------------------------ |
| Workflow run          | **33560559977** (run 10, attempt 1) — conclusion **success**                   |
| Job                   | `100031744885`                                                                 |
| Run URL               | https://github.com/NexitOz/KodRaidoGame/actions/runs/33560559977               |
| Executed              | 2026-09-01T21:20:50Z → 21:21:45Z (~55 s)                                       |
| Dispatched on         | `main` @ `a81823443f8a824ecfbe03629c167a3f81b37d76`                            |
| Immutable source pin  | `b792be37b32f73906d104642689afaa88a47b1c2` (PR #41 merge)                      |
| Preparation PR        | `#42`, merged as `81a550200b06a889a751f3c78535c1b917bd5b41`                    |
| Target project        | `gleaming-eagerness` / `production` / service `game-server`                    |
| Rows changed          | **1** — only `rune-of-curse-breaking` (`bb32d11c-3a3e-4f76-bbbe-1cd020caecf6`) |
| Non-target changes    | **0**                                                                          |
| Final source of truth | **`14/14`**                                                                    |

Evidence read from the actual job logs, not from the run conclusion:

- `IMMUTABLE_SOURCE_SHA_VERIFIED=b792be37…`, `CURRENT_MAIN_SHA=a818234…`, `ARTWORK_FILES_PRESENT=14/14`
- `RAILWAY_TOKEN_PRESENT=YES`, `TOKEN_PROJECT_ID_VERIFIED=YES`, `TOKEN_ENVIRONMENT_ID_VERIFIED=YES`, `GAME_SERVER_DB_LINK_VERIFIED=YES`, `PRODUCTION_SCOPE_VERIFIED=YES`, `READ_ONLY_DB_PREFLIGHT=YES`
- PRE-WRITE — `TARGET_ROWS=14`, `UNIQUE_SLUGS=14`, `ROWS_REQUIRING_MUTATION=1`, `SOURCE_OF_TRUTH_MATCH=13/14`, snapshot `3ed2430d…` (64 chars), `NON_TARGET_FINGERPRINTS=14`; only Card 04 reported `needsChange=YES`
- APPLY — `TRANSACTION_STARTED=YES`, `TRANSACTION_COMMITTED=YES`, `ROWS_CHANGED=1`, `TARGET_ROWS_FINAL=14`, `SOURCE_OF_TRUTH_MATCH=14/14`, `NON_TARGET_FIELD_CHANGES=0`
- Independent POST-WRITE — `TARGET_ROWS=14`, `UNIQUE_SLUGS=14`, `ROWS_REQUIRING_MUTATION=0`, `SOURCE_OF_TRUTH_MATCH=14/14`

Card 04 moved from an inline SVG placeholder with `rightsStatus: placeholder` to
`/art/cards/rune-of-curse-breaking.webp` with `rightsStatus: owned`. Exactly one dispatch was made
(workflow run count 9 → 10); no run or job was rerun.

## Safety boundary — still in force

Do NOT:

- dispatch the production artwork sync again without a fresh explicit owner authorization;
- rerun run `33560559977` or any earlier run;
- reuse `SYNC-13-CARD-ART-PRODUCTION` or `SYNC-14-CARD-ART-PRODUCTION` — both are consumed;
- bypass immutable-source, production-scope, snapshot, Serializable transaction, non-target-field or post-write checks;
- perform ad-hoc production DB repairs.

A future sync needs a new confirmation phrase, a pin repointed at a new already-merged integration
commit, and a fresh owner decision.

## Follow-ups (small, not blocking)

1. The authorization-state comments in `apps/game-server/scripts/sync-production-card-art.ts` and
   `.github/workflows/production-card-art-sync.yml` still call `SYNC-14-CARD-ART-PRODUCTION`
   "RESERVED, NOT AUTHORIZED, NOT CONSUMED". That is stale — it is CONSUMED. Fold the correction into
   the next preparation change, exactly as the `SYNC-13…` CONSUMED note was folded in.
2. `transport/card04-github-actions` can now be deleted; it carries a `contents: write` workflow and
   must never be merged.

## Card 03 closed production record

- integration merge / old immutable source: `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`
- repin merge: `c3c6e0c491fb4e48c94b32749bd0474b047305c9`
- production run: `33436786024` (run #9), job `99635055417`, conclusion success
- rows changed: exactly 1, only `warden-of-the-barrier`
- final source-of-truth: `13/13`, `NON_TARGET_FIELD_CHANGES=0`
- `SYNC-13-CARD-ART-PRODUCTION`: **CONSUMED**

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 02 `seal-of-the-curse` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 03 `warden-of-the-barrier` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 04 `rune-of-curse-breaking` — **COMPLETE END TO END, LIVE IN PRODUCTION**

## Art binary transport standing rule

The user is not a manual file courier. Use the established GitHub Actions transport path with hard
binary integrity gates for future generated masters when needed. Never use GitHub Contents-API
binary/base64 transport for generated masters; this project has already observed truncation through
that route.
