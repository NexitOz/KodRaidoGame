# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first; after each completed task update it last and verify it from GitHub

## Current project state

- **Phase:** SHADOW Art Pack 02 — Card 04 merged; ten-card production sync AUTHORIZED
- **Status:** OWNER AUTHORIZED PRODUCTION SYNC — repository integration complete, immutable source pinned, dispatch pending execution. Production sync has not yet been dispatched from this bridge; production DB has not yet been mutated by this step.
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task authorization commit:** `bb367de1e075860c56ad4bdf00b74eef31ecb7e0`
- **Latest integration handoff:** PR #34 comment `5401303175`
- **Owner visual approval:** PR #34 comment `5401140209`
- **PR #34:** **MERGED**
- **Merged PR head:** `6eb44cf46497f5303de433dae2d717a9f843d1c6`
- **Merge commit / immutable source:** `23e83c9978a9045059d3009eb1983b17f005d1d3`
- **Workflow pin commit:** `216ba3ff2cca050890b4bba56485db14e809af3a`
- **Sync-script pin commit:** `5dc0fd80e3e72db20c7953800924515b0c4389b6`
- **Production artwork:** `apps/web/public/art/cards/rune-of-the-echoing-dusk.webp`
- **Production sync target count:** `10`
- **Owner confirmation supplied:** `SYNC-10-CARD-ART-PRODUCTION`

## Card 04 final repository result

Card 04 `rune-of-the-echoing-dusk` / «Рунный Страж Эха» is fully integrated into the repository and marked FINAL APPROVED.

Approved master integrity:

- SHA-256: `319bdccc4dad399e3f048bf4aa095910c1fd255f453387a8604e1022734eb858`
- file size: `351690` bytes
- RIFF total: `351690` bytes
- dimensions: `1024x1536`
- container: WebP `VP8 `

The merged integration includes:

- owner-approved Card 04 artwork at the production path
- `artworkUrl: '/art/cards/rune-of-the-echoing-dusk.webp'`
- `rightsStatus: 'owned'`
- correct non-CHARACTER RUNE path in `/admin/art-review`
- `docs/art-pack-02.md` Card 04 FINAL APPROVED
- production sync extended from 9 to 10 targets

Production-path QA passed on Collection/hand `CardView` 3:4, `CardDetailDrawer` 4:5, `HandCardPreview` 7:9, 92 px `xs`, `/admin/art-review`, mobile 390×844, and the real Collection page. The two previously owner-accepted visual caveats remain non-blocking and no new regression was found.

## Immutable source pin — COMPLETE

All three production sync pins resolve to the merge commit `23e83c9978a9045059d3009eb1983b17f005d1d3`:

- `.github/workflows/production-card-art-sync.yml`
  - `REQUIRED_SOURCE_COMMIT`
  - `SOURCE_COMMIT`
- `apps/game-server/scripts/sync-production-card-art.ts`
  - `REQUIRED_SOURCE_COMMIT`

The immutable source commit contains the approved ten-card seed/art state. Post-merge operational changes did not alter `seed.ts`, Prisma schema, or `apps/web/public/art/cards`.

## Owner authorization — ACTIVE FOR ONE DISPATCH

The owner explicitly supplied the exact production confirmation string on 2026-08-25:

`SYNC-10-CARD-ART-PRODUCTION`

Do not ask the owner to repeat it.

Authorization scope: one controlled dispatch of `.github/workflows/production-card-art-sync.yml` on `main` using that exact input.

## Required execution

Read `docs/CLAUDE_CURRENT_TASK.md` and execute the authorized production workflow exactly as written there.

Before dispatch, independently verify current `main`, the three immutable-source pins, and that no post-source change touched:

- `apps/game-server/prisma/seed.ts`
- `apps/game-server/prisma/schema.prisma`
- `apps/web/public/art/cards`

Then dispatch only the ten-card production artwork sync and inspect the actual run to completion.

Required final signals include:

- exact manual confirmation accepted
- immutable source SHA verified
- `ARTWORK_FILES_PRESENT=10/10`
- `RAILWAY_TOKEN_PRESENT=YES`
- all production-scope checks PASS
- PRE-WRITE `TARGET_ROWS=10`, `UNIQUE_SLUGS=10`, mutation count and snapshot captured
- APPLY transaction committed if needed
- `TARGET_ROWS_FINAL=10`
- `SOURCE_OF_TRUTH_MATCH=10/10`
- `NON_TARGET_FIELD_CHANGES=0`
- POST-WRITE `ROWS_REQUIRING_MUTATION=0`
- POST-WRITE `SOURCE_OF_TRUTH_MATCH=10/10`

If any gate fails, stop and report it. Do not automatically retry and do not use an alternate production mutation path.

## Current hard status

- Owner authorization: **YES**
- Production sync dispatched from this bridge: **NO**
- Production DB mutated by this authorization step: **NO**
- Next action: execute the authorized workflow, verify all gates, write the final GitHub handoff, then update this file last.

## Reader protocol

Read this file, then `docs/CLAUDE_CURRENT_TASK.md`. Resolve current `main` HEAD directly from GitHub before acting. PR #34 is merged; do not rely on stale pre-merge PR text.
