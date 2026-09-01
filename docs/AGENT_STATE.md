# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 04 **FINAL OWNER APPROVED + REPOSITORY INTEGRATED + 14-CARD SYNC PREPARED ON `main` — PRODUCTION DISPATCH AUTHORIZED, NOT YET DISPATCHED**
- **Current target:** execute exactly one controlled 14-card production artwork sync and audit it end to end
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `600aed56eb0b724fa6ccb6522818a5bb82adbbaa`
- **Card 04 integration PR:** `#41` — MERGED
- **Card 04 integration merge / immutable artwork source:** `b792be37b32f73906d104642689afaa88a47b1c2`
- **14-card sync preparation PR:** `#42` — MERGED
- **14-card sync preparation merge commit:** `81a550200b06a889a751f3c78535c1b917bd5b41`
- **Prepared target count:** `14`
- **Prepared workflow gate:** `SYNC-14-CARD-ART-PRODUCTION`
- **Owner production authorization:** **YES — explicit exact phrase supplied on 2026-09-01**
- **`SYNC-13-CARD-ART-PRODUCTION`:** **CONSUMED — MUST NOT BE REUSED**
- **`SYNC-14-CARD-ART-PRODUCTION`:** **AUTHORIZED / NOT YET CONSUMED**
- **Production workflow dispatched:** **NO**
- **Railway / production DB accessed for this authorized run:** **NO**
- **Open blocker:** execution agent must perform one `workflow_dispatch`; current ChatGPT GitHub connector cannot create a new workflow dispatch, so the authorized task is delegated through the canonical Claude task without requiring the owner to repeat the confirmation

## Active one-use production authorization

The owner explicitly supplied:

`SYNC-14-CARD-ART-PRODUCTION`

This authorizes exactly one dispatch of `.github/workflows/production-card-art-sync.yml` on `main` with that exact confirmation input.

The authorization is **not consumed merely by being recorded here**. It becomes **CONSUMED** the moment GitHub accepts a new workflow run. After a run exists, no second dispatch and no rerun are allowed without a fresh owner decision, regardless of success/failure/cancellation.

If dispatch is rejected before a run is created, stop and report BLOCKED rather than inventing another production route.

## Required production evidence

The active task requires the execution agent to audit actual workflow logs and require:

- immutable source `b792be37b32f73906d104642689afaa88a47b1c2` verified;
- `ARTWORK_FILES_PRESENT=14/14`;
- production-scope and read-only preflight gates all PASS;
- PRE-WRITE `TARGET_ROWS=14`, `UNIQUE_SLUGS=14`, valid snapshot and actual mutation count;
- APPLY, if needed: transaction committed, rows changed equals pre-write count, `TARGET_ROWS_FINAL=14`, `SOURCE_OF_TRUTH_MATCH=14/14`, `NON_TARGET_FIELD_CHANGES=0`;
- POST-WRITE: `TARGET_ROWS=14`, `UNIQUE_SLUGS=14`, `ROWS_REQUIRING_MUTATION=0`, `SOURCE_OF_TRUTH_MATCH=14/14`.

Only after every gate passes may Card 04 be marked **LIVE IN PRODUCTION**.

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 02 `seal-of-the-curse` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 03 `warden-of-the-barrier` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 04 `rune-of-curse-breaking` — **FINAL OWNER APPROVED, REPOSITORY INTEGRATED, 14-CARD SYNC AUTHORIZED BUT NOT YET DISPATCHED**

## Safety boundary

Do NOT:

- dispatch more than once;
- rerun a failed/cancelled run or job without fresh owner approval;
- reuse either consumed confirmation;
- bypass immutable-source, production-scope, snapshot, Serializable transaction, non-target-field or post-write checks;
- perform ad-hoc production DB repairs;
- begin another card before Card 04 production closeout is recorded.

## Card 03 closed production record

- integration merge / old immutable source: `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`
- repin merge: `c3c6e0c491fb4e48c94b32749bd0474b047305c9`
- production run: `33436786024` (run #9)
- job: `99635055417`
- conclusion: success
- rows changed: exactly 1, only `warden-of-the-barrier`
- final source-of-truth: `13/13`
- `NON_TARGET_FIELD_CHANGES=0`
- `SYNC-13-CARD-ART-PRODUCTION`: **CONSUMED**

## Art binary transport standing rule

The user is not a manual file courier. Use the established GitHub Actions transport path with hard binary integrity gates for future generated masters when needed.
