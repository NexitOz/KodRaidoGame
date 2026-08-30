# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **MERGED AND PINNED — PRODUCTION SYNC AWAITING FRESH OWNER AUTHORIZATION**
- **Current target:** `seal-of-the-curse` / «Печать Проклятия»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Integration PR:** #37 — MERGED
- **Integration PR head:** `6b668d8ba73ede0899f4cba3e5362fd74f10f2b1`
- **Merge commit / immutable 12-card source:** `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`
- **Workflow pin commit:** `3bff9b6bb49ede3dff5e96d889c55eb39af1239a`
- **Sync-script pin commit:** `9fb36bb2ad104e099f4e8a75fd9fbd799f0fe626`
- **Production sync target count:** `12`
- **Required fresh confirmation:** `SYNC-12-CARD-ART-PRODUCTION`
- **Production sync dispatched:** NO
- **Production DB mutated by this merge/pin step:** NO

## Card 01

`acolyte-of-the-white-rune` / «Послушник Белой Руны» is FINAL APPROVED and live in production.

- production sync run: `33091769787`
- final source of truth: `11/11`
- `SYNC-11-CARD-ART-PRODUCTION`: CONSUMED

## Card 02 final repository result

`seal-of-the-curse` / «Печать Проклятия» is FINAL OWNER APPROVED and fully integrated into the repository.

Approved master integrity:

- candidate branch: `assets/seal-of-the-curse-candidate-v2`
- candidate commit: `67405697628a3dec3fa8e9dab2cdb27c273b6af1`
- Git blob SHA: `95940017577f7152a28bf76122912c37e548c7e0`
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- size: `326508`
- RIFF total: `326508`
- dimensions: `1024x1536`
- FourCC: plain `VP8 `
- full decode: PASS

Repository integration includes:

- production art at `apps/web/public/art/cards/seal-of-the-curse.webp`
- `artworkUrl: '/art/cards/seal-of-the-curse.webp'`
- `rightsStatus: 'owned'`
- correct EVENT/non-CHARACTER `/admin/art-review` path
- Card 02 marked FINAL APPROVED in `docs/art-pack-03.md`
- production sync extended 11 → 12

Production-path QA passed on raw 2:3, `CardView` 3:4, `CardDetailDrawer` 4:5, `HandCardPreview` 7:9, `/admin/art-review` desktop, 390px, 92px thumbnail, 92px grayscale, and real Collection. No new regression appeared. The two owner-accepted caveats remain non-blocking.

## Repository review and immutable source pin

PR #37 passed repository review. GitHub reported `mergeable: true`, `mergeable_state: clean`; Vercel status was success. The PR was merged using expected head protection.

After merge, all three operational pins were set to the merge commit `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`:

- `.github/workflows/production-card-art-sync.yml`
  - `REQUIRED_SOURCE_COMMIT`
  - `SOURCE_COMMIT`
- `apps/game-server/scripts/sync-production-card-art.ts`
  - `REQUIRED_SOURCE_COMMIT`

A GitHub compare from the immutable source commit to the pin-complete main state shows only these two files changed after merge:

- `.github/workflows/production-card-art-sync.yml`
- `apps/game-server/scripts/sync-production-card-art.ts`

Therefore the source-of-truth `seed.ts`, Prisma schema, and committed card artwork remain unchanged after the immutable source commit.

## Production authorization gate

No production operation is currently authorized.

The next production action requires a **fresh explicit owner confirmation** of exactly:

`SYNC-12-CARD-ART-PRODUCTION`

Do not infer this authorization from prior approvals and do not reuse `SYNC-11-CARD-ART-PRODUCTION`.

After exact authorization, follow `docs/CLAUDE_CURRENT_TASK.md` and require the full immutable-source, production-scope, PRE-WRITE, Atomic APPLY, and POST-WRITE safety sequence.

## Hard stop

Until the fresh confirmation is supplied:

- do not dispatch production sync
- do not mutate production DB
- do not begin Card 03

## Art Pack 03 remaining cards

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — MERGED, repository-integrated, awaiting production sync authorization
- Card 03 `warden-of-the-barrier` — not started
- Card 04 `rune-of-curse-breaking` — not started
