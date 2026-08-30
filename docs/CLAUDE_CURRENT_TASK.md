# CURRENT TASK — Art Pack 03 Card 02: production synchronization gate

## Current status

Card 02 `seal-of-the-curse` / «Печать Проклятия» is fully integrated into `main`.

- owner visual approval: recorded and final
- integration PR: #37
- integration PR head: `6b668d8ba73ede0899f4cba3e5362fd74f10f2b1`
- merge commit / immutable 12-card source: `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`
- production artwork path: `apps/web/public/art/cards/seal-of-the-curse.webp`
- `artworkUrl`: `/art/cards/seal-of-the-curse.webp`
- `rightsStatus`: `owned`
- production sync target count: `12`
- required confirmation string: `SYNC-12-CARD-ART-PRODUCTION`

The approved artwork remains byte-identical to candidate-v2:

- source branch: `assets/seal-of-the-curse-candidate-v2`
- source commit: `67405697628a3dec3fa8e9dab2cdb27c273b6af1`
- Git blob SHA: `95940017577f7152a28bf76122912c37e548c7e0`
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- size: `326508`
- RIFF total: `326508`
- dimensions: `1024x1536`
- FourCC: plain `VP8 `

## Repository review result

PR #37 passed repository review and was merged.

Post-merge, all three immutable-source pins were repointed to the merge commit `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`:

- `.github/workflows/production-card-art-sync.yml`
  - `REQUIRED_SOURCE_COMMIT`
  - `SOURCE_COMMIT`
- `apps/game-server/scripts/sync-production-card-art.ts`
  - `REQUIRED_SOURCE_COMMIT`

A compare from the immutable source commit to the pin-complete `main` shows only the workflow and sync script changed after the merge. Therefore `seed.ts`, Prisma schema, and `apps/web/public/art/cards` remain immutable relative to the source commit.

## Production authorization gate

No production operation is currently authorized.

Do not dispatch the workflow until the owner explicitly supplies the exact confirmation string:

`SYNC-12-CARD-ART-PRODUCTION`

Do not reuse the consumed `SYNC-11-CARD-ART-PRODUCTION` authorization.

## After explicit owner authorization

1. Resolve current `main` directly from GitHub.
2. Verify the three pins still equal `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`.
3. Verify no post-source change touched:
   - `apps/game-server/prisma/seed.ts`
   - `apps/game-server/prisma/schema.prisma`
   - `apps/web/public/art/cards`
4. Dispatch `.github/workflows/production-card-art-sync.yml` with exact input `SYNC-12-CARD-ART-PRODUCTION`.
5. Require all safety signals:
   - exact confirmation accepted
   - immutable source SHA verified
   - artwork files `12/12`
   - Railway token present
   - production scope verified
   - read-only DB preflight PASS
   - PRE-WRITE `TARGET_ROWS=12`, `UNIQUE_SLUGS=12`, snapshot captured
   - mutation count within `0..12`
   - if APPLY runs: transaction started + committed, `TARGET_ROWS_FINAL=12`, `SOURCE_OF_TRUTH_MATCH=12/12`, `NON_TARGET_FIELD_CHANGES=0`
   - POST-WRITE `ROWS_REQUIRING_MUTATION=0`, `SOURCE_OF_TRUTH_MATCH=12/12`
6. Record run/job IDs and mutation count in the durable handoff.
7. Update `docs/AGENT_STATE.md` last and verify it back from GitHub.

## Hard stop

Until exact owner authorization is supplied:

- production sync: NOT authorized
- production DB mutation: NOT authorized
- Card 03 `warden-of-the-barrier`: do not begin yet
