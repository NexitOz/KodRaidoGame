# CURRENT TASK — Art Pack 03 Card 01: prepare controlled production-art sync 10 → 11

## Goal

Prepare the repository changes required to extend the controlled production card-art sync from ten cards to eleven by adding the already-approved and already-merged PURIFICATION Card 01.

**This task is PREPARATION ONLY. Do not connect to production, dispatch the workflow, run a production `--check`, run `--apply`, or mutate the production database.**

## Immutable source

Card 01 repository integration is already merged on `main`.

Use this exact immutable production source commit:

`92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`

It contains the approved production asset and matching `seed.ts` source of truth for:

- slug: `acolyte-of-the-white-rune`
- artwork: `/art/cards/acolyte-of-the-white-rune.webp`
- rights: `owned`

Post-merge transition record:

`docs/agent-reports/2026-08-27-art-pack-03-card-01-integration-merged-transition.md`

Durable Art Pack 03 record:

`docs/art-pack-03.md`

## Current controlled-sync state

Before changing anything, read fresh versions of:

- `apps/game-server/scripts/sync-production-card-art.ts`
- `.github/workflows/production-card-art-sync.yml`

The current configuration is intentionally still the previously executed ten-card version:

- `REQUIRED_SOURCE_COMMIT = 23e83c9978a9045059d3009eb1983b17f005d1d3`
- 10 target slugs
- workflow confirmation `SYNC-10-CARD-ART-PRODUCTION`
- all workflow file/count assertions use 10

That old confirmation string is **CONSUMED**. It is not standing authorization.

## Required work

Create a dedicated branch and PR from fresh `main`. Change only the controlled sync configuration and the minimal durable documentation/handoff required by protocol.

### 1. Sync script

In `apps/game-server/scripts/sync-production-card-art.ts`:

- repoint `REQUIRED_SOURCE_COMMIT` to:
  `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`
- add `acolyte-of-the-white-rune` to `TARGET_SLUGS`
- preserve all existing safety properties:
  - desired values derived only from the immutable pinned `seed.ts`
  - exact target-row invariant
  - pre-write snapshot gate
  - Serializable transaction
  - non-target-field fingerprints
  - post-write source-of-truth verification
- update comments that explicitly say "ten" so they accurately say eleven where applicable
- do not change card data or general sync semantics beyond the 10 → 11 extension

### 2. Workflow

In `.github/workflows/production-card-art-sync.yml`, move the complete configuration together:

- `REQUIRED_SOURCE_COMMIT` → `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`
- `SOURCE_COMMIT` → the same SHA
- add `acolyte-of-the-white-rune` to the committed-artwork verification slug list
- update the job/step wording from ten to eleven where it describes the target count
- update **every** numerical assertion from 10 to 11 where it is asserting the controlled target set, including:
  - artwork-files-present result
  - `TARGET_ROWS`
  - `UNIQUE_SLUGS`
  - maximum `ROWS_REQUIRING_MUTATION`
  - `TARGET_ROWS_FINAL`
  - `SOURCE_OF_TRUTH_MATCH`
  - independent POST-WRITE assertions

Use the fresh one-use confirmation string:

`SYNC-11-CARD-ART-PRODUCTION`

Update both the workflow input description and exact manual-confirmation gate to that value.

**Important:** placing this string in the workflow does not authorize its use. It remains dormant until the owner separately gives that exact confirmation after this preparation PR is reviewed and merged.

### 3. Documentation

Update `docs/art-pack-03.md` only as needed to state that the eleven-card production sync is PREPARED / AWAITING OWNER AUTHORIZATION once the PR work is complete. Do not claim the production DB has been changed.

Do not mark Card 02 started as part of this task.

## Validation — repository/local only

Validation must not require production credentials or production connectivity.

At minimum:

- `git diff --check`
- Prettier on changed text/config files where applicable
- lint / typecheck for the game-server script if repository commands support it
- inspect the pinned commit with local git and prove all 11 target seed definitions contain the required production `artworkUrl` and `rightsStatus: owned`
- prove all 11 committed WebP paths exist at the pinned source commit
- static audit that every workflow target-count assertion moved consistently from 10 → 11
- static audit that the old confirmation string is absent from the prepared workflow and the new string appears only where expected
- run any safe unit/static test that does not connect to production

**Forbidden during validation:**

- Railway production scope command
- production `DATABASE_URL`
- production `--check`
- `--apply`
- workflow dispatch
- any production DB query, including read-only connectivity checks

## Hard scope exclusions

Do not modify:

- `apps/game-server/prisma/seed.ts`
- any artwork file
- any `artworkUrl` / `rightsStatus`
- Prisma schema or migrations
- gameplay / balance / card text / stats / rarity / faction / effects
- Battlefield or player-facing UI
- Railway / Vercel configuration
- production database
- Art Pack 01 / 02 approved assets

Do not begin Card 02 artwork work in this task.

## Delivery

Open a dedicated PR. Follow the permanent `CLAUDE.md` Agent Handoff Protocol and post the full final report on the PR under:

`## AGENT HANDOFF — FINAL REPORT`

The handoff must explicitly include:

- base and head SHA
- exact changed files
- the new pinned immutable source SHA
- final 11-slug list
- every updated count assertion
- the fresh confirmation string
- validation results
- explicit confirmation that **no production connection, workflow dispatch, `--check`, `--apply`, or database mutation occurred**

## Stop condition

Stop with the preparation PR open for review.

Do **not** merge the preparation PR automatically unless separately authorized, and under no circumstances dispatch the production sync as part of this task.
