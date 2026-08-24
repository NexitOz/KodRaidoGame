# CURRENT TASK — EXECUTE authorized 10-card production artwork sync

## Authorization

The owner explicitly authorized the production operation on 2026-08-25 with the exact confirmation string:

`SYNC-10-CARD-ART-PRODUCTION`

This authorization is valid for one controlled dispatch of the existing workflow `.github/workflows/production-card-art-sync.yml` on `main` for the ten-card artwork synchronization described below.

Do not ask the owner to repeat the confirmation.

## Canonical source

Card 04 `rune-of-the-echoing-dusk` / «Рунный Страж Эха» is owner-approved, merged and FINAL APPROVED.

PR #34 was merged at:

`23e83c9978a9045059d3009eb1983b17f005d1d3`

That merge commit is the immutable production source for all ten artwork targets.

Before dispatch, independently resolve fresh `main` and verify from GitHub that all three pins are still exactly:

`23e83c9978a9045059d3009eb1983b17f005d1d3`

Pins:

- `.github/workflows/production-card-art-sync.yml` → `REQUIRED_SOURCE_COMMIT`
- `.github/workflows/production-card-art-sync.yml` → `SOURCE_COMMIT`
- `apps/game-server/scripts/sync-production-card-art.ts` → `REQUIRED_SOURCE_COMMIT`

Also verify that no post-merge change touched:

- `apps/game-server/prisma/seed.ts`
- `apps/game-server/prisma/schema.prisma`
- `apps/web/public/art/cards`

If any pin or immutable-source condition is not exactly correct, STOP without dispatching.

## Required action

Dispatch `.github/workflows/production-card-art-sync.yml` on `main` with input:

`confirmation = SYNC-10-CARD-ART-PRODUCTION`

This is an authorized production DB operation.

Do not dispatch any other workflow.
Do not re-run automatically if the run fails.

## Required verification

Wait for the workflow to finish and inspect the actual job / step logs. The final report must record the run ID, job ID and result of every gate.

Require evidence for:

1. Exact manual confirmation accepted.
2. Immutable source SHA verified as `23e83c9978a9045059d3009eb1983b17f005d1d3`.
3. `ARTWORK_FILES_PRESENT=10/10`.
4. `RAILWAY_TOKEN_PRESENT=YES`.
5. Production scope checks all PASS:
   - `TOKEN_PROJECT_ID_VERIFIED=YES`
   - `TOKEN_ENVIRONMENT_ID_VERIFIED=YES`
   - `GAME_SERVER_DB_LINK_VERIFIED=YES`
   - `PRODUCTION_SCOPE_VERIFIED=YES`
   - `READ_ONLY_DB_PREFLIGHT=YES`
6. PRE-WRITE:
   - `TARGET_ROWS=10`
   - `UNIQUE_SLUGS=10`
   - capture `ROWS_REQUIRING_MUTATION`
   - capture the 64-character `PRE_WRITE_SNAPSHOT`
   - capture each target's current vs desired artwork / rights values
7. If APPLY runs:
   - `TRANSACTION_STARTED=YES`
   - `TRANSACTION_COMMITTED=YES`
   - capture `ROWS_CHANGED`
   - `TARGET_ROWS_FINAL=10`
   - `SOURCE_OF_TRUTH_MATCH=10/10`
   - `NON_TARGET_FIELD_CHANGES=0`
8. POST-WRITE:
   - `TARGET_ROWS=10`
   - `UNIQUE_SLUGS=10`
   - `ROWS_REQUIRING_MUTATION=0`
   - `SOURCE_OF_TRUTH_MATCH=10/10`

If the workflow fails at any point, STOP and report the exact failing gate and logs. Do not retry and do not make an alternate production mutation.

## Scope

Do not modify gameplay, balance, card text, effects, rarity, cost, faction, Prisma schema, migrations, Railway configuration, Vercel configuration, Battlefield layout, or unrelated card data.

Do not change the approved Card 04 artwork.

## Delivery

After the run completes, create the required GitHub handoff record under the permanent `CLAUDE.md` protocol.

The handoff must include:

- workflow run ID and URL
- job ID
- immutable source SHA
- PRE-WRITE rows requiring mutation and snapshot
- APPLY result / rows changed
- POST-WRITE result
- all required production-scope signals
- exact final ten-card source-of-truth result
- confirmation that non-target fields changed = 0
- confirmation whether production DB was mutated
- confirmation that no unrelated repository files were changed

Finally update `docs/AGENT_STATE.md` last, fetch it back from GitHub and verify it before declaring completion.
