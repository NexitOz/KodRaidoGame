# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first; after each completed task update it last and verify it from GitHub

## Current project state

- **Phase:** SHADOW Art Pack 02 — Card 04 merged; production sync awaiting explicit authorization
- **Status:** REPOSITORY INTEGRATION COMPLETE — PR #34 merged, immutable ten-card sync source pinned. Production sync NOT dispatched; production DB NOT mutated.
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Latest handoff report:** PR #34 comment `5401303175`
- **Owner visual approval:** PR #34 comment `5401140209`
- **PR #34:** **MERGED**
- **Merged PR head:** `6eb44cf46497f5303de433dae2d717a9f843d1c6`
- **Merge commit / immutable source:** `23e83c9978a9045059d3009eb1983b17f005d1d3`
- **Workflow pin commit:** `216ba3ff2cca050890b4bba56485db14e809af3a`
- **Sync-script pin commit:** `5dc0fd80e3e72db20c7953800924515b0c4389b6`
- **Task transition commit:** `c84fe448bc9fe8b162d569a0275bb4b281809291`
- **Production artwork:** `apps/web/public/art/cards/rune-of-the-echoing-dusk.webp`
- **Production sync target count:** `10`
- **Required confirmation:** `SYNC-10-CARD-ART-PRODUCTION`

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

After merge, both operational sync locations were repointed to the merge commit `23e83c9978a9045059d3009eb1983b17f005d1d3`:

- `.github/workflows/production-card-art-sync.yml`
  - `REQUIRED_SOURCE_COMMIT`
  - `SOURCE_COMMIT`
- `apps/game-server/scripts/sync-production-card-art.ts`
  - `REQUIRED_SOURCE_COMMIT`

Verification from GitHub confirms all three values are identical. A compare from the immutable source commit to the pin-complete main state shows only the workflow and sync script changed after the merge, so seed/schema/art remained immutable as required by the workflow gate.

## Remaining work

Only the controlled production synchronization remains.

**Do not dispatch until the owner explicitly supplies the exact confirmation string:**

`SYNC-10-CARD-ART-PRODUCTION`

After authorization, run the existing production workflow and require:

- immutable source verification
- production scope verification
- artwork files `10/10`
- target rows `10`
- unique slugs `10`
- PRE-WRITE snapshot
- APPLY transaction success if mutation is needed
- `TARGET_ROWS_FINAL=10`
- `SOURCE_OF_TRUTH_MATCH=10/10`
- `NON_TARGET_FIELD_CHANGES=0`
- POST-WRITE `ROWS_REQUIRING_MUTATION=0`

## Hard stop

- Production sync: **NOT dispatched**
- Production DB: **NOT mutated by this final merge/pin task**
- Await exact owner confirmation before production mutation

## Reader protocol

Read this file, then `docs/CLAUDE_CURRENT_TASK.md`. Resolve current `main` HEAD directly from GitHub before acting. Do not rely on stale PR state: PR #34 is merged.