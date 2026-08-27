# CURRENT TASK — Art Pack 03 Card 01: integrate approved production artwork

## Goal

Integrate the owner-approved PURIFICATION Card 01 master into the repository and stop before any production database sync.

- **Slug:** `acolyte-of-the-white-rune`
- **Name:** `Послушник Белой Руны`
- **Type / rarity / cost:** CHARACTER / COMMON / 1
- **Stats:** 1/3

## Canonical approved source

Use only this verified candidate:

- branch: `assets/acolyte-of-the-white-rune-candidate`
- commit: `69e176e`
- source path: `art-source/acolyte-of-the-white-rune.webp`
- byte size: `214378`
- dimensions: `1024 × 1536`
- fourcc: plain `VP8 `
- SHA-256: `cb76658416628f91b721c826a451342319bcfe39ff3b5f770a5f8ca73ba499fe`

Do not regenerate, re-encode, resize, sharpen, or otherwise alter the master. Copy the bytes exactly.

Owner approval transition record:

`docs/agent-reports/2026-08-27-art-pack-03-card-01-owner-approval-transition.md`

Full visual QA:

`docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-review.md`

## Required work

1. Resolve fresh `main` and candidate commit `69e176e` from GitHub.
2. Create a dedicated integration branch from fresh `main`.
3. Independently verify the candidate bytes again before copying.
4. Copy the exact master to:

   `apps/web/public/art/cards/acolyte-of-the-white-rune.webp`

5. Verify the production-path copy is byte-identical to the source candidate:
   - SHA-256 identical
   - byte size `214378`
   - RIFF-declared total equals actual size
   - plain `VP8 `
   - decoded dimensions exactly 1024×1536
6. In `apps/game-server/prisma/seed.ts`, modify **only** `acolyte-of-the-white-rune`:
   - `artworkUrl: '/art/cards/acolyte-of-the-white-rune.webp'`
   - `rightsStatus: 'owned'`
   - add a concise Art Pack 03 owner-approved comment consistent with existing approved cards
7. Create `docs/art-pack-03.md` if it does not exist. Record Card 01 as **FINAL APPROVED**, including slug, card facts, artwork path, dimensions, byte size, SHA-256, QA PASS surfaces, and the two accepted caveats:
   - ~2–4 px head clearance under current 4:5 crop
   - more photographic rendering than older painterly baseline, explicitly owner-accepted
8. Update `/admin/art-review` for this card from candidate-review wording to approved production-art review if needed. Keep the change surgical and do not disturb other targets.
9. Run real validation and visual confirmation from the production artwork path, not the gitignored candidate path.

## Validation

At minimum:

- `git diff --check`
- Prettier on changed text/code files
- lint
- typecheck
- existing relevant test baseline
- production build
- independent artwork integrity check from `apps/web/public/art/cards/acolyte-of-the-white-rune.webp`
- confirm the real production-path art renders correctly in:
  - `CardView` 3:4
  - `CardDetailDrawer` 4:5
  - `HandCardPreview` 7:9
  - `CreatureSlot` 3:4
  - `/admin/art-review` desktop
  - `/admin/art-review` 390 px mobile
  - 92 px thumbnail

## Delivery

Use a dedicated branch and PR. Do not merge it automatically unless the owner's standing repository workflow clearly authorises agent merge for this task. Follow `CLAUDE.md` Agent Handoff Protocol and publish the full final report on the PR.

## Hard scope exclusions

Do not change:

- card name, ability text, effectJson, cost, attack, health, rarity, faction, tags
- Prisma schema or migrations
- gameplay or Battlefield logic/layout
- any other card's `artworkUrl` or `rightsStatus`
- Art Pack 01 / 02 approved assets
- Railway / Vercel configuration
- production database

### Production sync is explicitly OUT OF SCOPE

Do **not** modify in this task:

- `apps/game-server/scripts/sync-production-card-art.ts`
- `.github/workflows/production-card-art-sync.yml`
- `REQUIRED_SOURCE_COMMIT`
- `TARGET_SLUGS`
- the confirmation string
- any count assertion

Do not dispatch or run production sync.

The 10→11 production-sync extension is a separate post-merge task because its immutable source pin must point to an already-merged integration commit.

## Stop condition

Stop after the integration PR is fully validated and handed off. Do not perform the production DB sync in the same task.