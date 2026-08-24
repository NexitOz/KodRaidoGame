# CURRENT TASK — SHADOW Card 04 production synchronization

## Goal

Complete the final production synchronization for owner-approved **Рунный Страж Эха** — `rune-of-the-echoing-dusk` — only after explicit owner authorization.

Card 04 integration is merged into `main` and the controlled ten-card production sync is pinned to the immutable merge source.

## Canonical repository state

- PR #34: **MERGED**
- PR head before merge: `6eb44cf46497f5303de433dae2d717a9f843d1c6`
- merge commit / immutable source: `23e83c9978a9045059d3009eb1983b17f005d1d3`
- workflow pin update: `216ba3ff2cca050890b4bba56485db14e809af3a`
- sync-script pin update: `5dc0fd80e3e72db20c7953800924515b0c4389b6`
- current production-art target count: `10`
- confirmation string: `SYNC-10-CARD-ART-PRODUCTION`

Both `.github/workflows/production-card-art-sync.yml` and `apps/game-server/scripts/sync-production-card-art.ts` now use `23e83c9978a9045059d3009eb1983b17f005d1d3` as the immutable source commit. The only repository changes after that merge commit are the two pin-only operational edits, so the workflow's immutable seed/art checks remain valid.

## Required work after owner authorization

Do not dispatch anything until the owner explicitly authorizes the production mutation with the exact confirmation string:

`SYNC-10-CARD-ART-PRODUCTION`

After authorization:

1. Resolve current `main` HEAD directly from GitHub and verify no changes after the immutable source touched:
   - `apps/game-server/prisma/seed.ts`
   - `apps/game-server/prisma/schema.prisma`
   - `apps/web/public/art/cards`
2. Dispatch the existing `production-card-art-sync.yml` workflow with exact confirmation `SYNC-10-CARD-ART-PRODUCTION`.
3. Inspect the read-only production scope and PRE-WRITE results before relying on APPLY results.
4. Require all workflow safety signals:
   - immutable source SHA verified
   - production scope verified
   - artwork files `10/10`
   - target rows `10`
   - unique slugs `10`
   - PRE-WRITE snapshot present
   - `ROWS_REQUIRING_MUTATION` within `0..10`
5. If APPLY runs, require:
   - transaction started and committed
   - `TARGET_ROWS_FINAL=10`
   - `SOURCE_OF_TRUTH_MATCH=10/10`
   - `NON_TARGET_FIELD_CHANGES=0`
6. Require independent POST-WRITE verification with `ROWS_REQUIRING_MUTATION=0` and `SOURCE_OF_TRUTH_MATCH=10/10`.
7. Record workflow run/job IDs and mutation count in the repository handoff.
8. Update `docs/AGENT_STATE.md` last and verify it back from GitHub.

## Hard stop

Until the owner supplies the exact confirmation string:

- production sync must **not** be dispatched
- production DB must **not** be mutated
- no unrelated code or card data may be changed

The repository integration itself is complete; only the controlled production synchronization remains.