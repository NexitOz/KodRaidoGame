# CURRENT TASK — Art Pack 03 Card 02: authorized production synchronization

## Owner authorization

The owner explicitly supplied the exact confirmation string on 2026-08-30:

`SYNC-12-CARD-ART-PRODUCTION`

This authorizes exactly **one** controlled dispatch of `.github/workflows/production-card-art-sync.yml` on `main` using that exact input. Do not ask the owner to repeat it. Do not use any alternate production mutation path and do not automatically retry a failed run.

## Pre-dispatch state verified by ChatGPT bridge

- current `main` before this authorization record: `8664dd429beb4f8d3ad75d4fe19420d7912d8689`
- immutable 12-card source / Card 02 merge commit: `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`
- workflow `REQUIRED_SOURCE_COMMIT`: `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`
- workflow `SOURCE_COMMIT`: `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`
- sync-script `REQUIRED_SOURCE_COMMIT`: `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`
- production sync target count: `12`

A GitHub compare from the immutable source to current `main` shows only these post-source changes:

- `.github/workflows/production-card-art-sync.yml`
- `apps/game-server/scripts/sync-production-card-art.ts`
- `docs/AGENT_STATE.md`
- `docs/CLAUDE_CURRENT_TASK.md`

Therefore no post-source change touched:

- `apps/game-server/prisma/seed.ts`
- `apps/game-server/prisma/schema.prisma`
- `apps/web/public/art/cards`

## Required execution

1. Sync fresh `main` and resolve its exact HEAD directly from GitHub.
2. Re-verify all three immutable-source pins equal `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`.
3. Re-verify no post-source commit touched `seed.ts`, Prisma schema, or `apps/web/public/art/cards`.
4. Dispatch **only** `.github/workflows/production-card-art-sync.yml` with exact input `SYNC-12-CARD-ART-PRODUCTION`.
5. Inspect the actual run through completion. Require:
   - exact manual confirmation accepted
   - immutable source SHA verified
   - `ARTWORK_FILES_PRESENT=12/12`
   - `RAILWAY_TOKEN_PRESENT=YES`
   - token project/environment/database scope gates PASS
   - `READ_ONLY_DB_PREFLIGHT=YES`
   - PRE-WRITE `TARGET_ROWS=12`
   - PRE-WRITE `UNIQUE_SLUGS=12`
   - a 64-char PRE-WRITE snapshot
   - `ROWS_REQUIRING_MUTATION` in `0..12`
6. If APPLY runs, require:
   - `TRANSACTION_STARTED=YES`
   - `TRANSACTION_COMMITTED=YES`
   - `TARGET_ROWS_FINAL=12`
   - `SOURCE_OF_TRUTH_MATCH=12/12`
   - `NON_TARGET_FIELD_CHANGES=0`
7. Require independent POST-WRITE:
   - `TARGET_ROWS=12`
   - `UNIQUE_SLUGS=12`
   - `ROWS_REQUIRING_MUTATION=0`
   - `SOURCE_OF_TRUTH_MATCH=12/12`
8. Record workflow run ID, job ID, PRE-WRITE mutation count, APPLY rows changed (or already-synchronized state), and all final safety signals in a durable report under `docs/agent-reports/`.
9. After a successful sync, transition the project to Art Pack 03 Card 03 `warden-of-the-barrier` planning. Do not generate/promote Card 03 art inside the production-sync task itself.
10. Update `docs/AGENT_STATE.md` **last** and fetch it back from GitHub to verify.

## Failure rule

If any gate fails, stop and report the exact failure. Do not retry automatically, do not mutate production another way, and do not begin Card 03 until the failure is reviewed.

## Current hard status

- Owner authorization: **YES — ONE DISPATCH**
- Production sync dispatched from ChatGPT bridge: **NO**
- Production DB mutated by this authorization-record step: **NO**
- Next action: execute and verify the authorized workflow.
