# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 01 **FINAL APPROVED — READY FOR REPOSITORY INTEGRATION**
- **Current target:** `acolyte-of-the-white-rune` / «Послушник Белой Руны»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `5f6cdddad3420a9c898a72d6e405d605b7cf9e8d`
- **Latest decision handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-01-owner-approval-transition.md`
- **Decision handoff commit:** `7bfc6a077d2655588989468cab170e30e1723285`
- **Full candidate QA:** `docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-review.md`
- **Branch:** `main`
- **PR:** none for the approval transition

## Owner-approved candidate — FINAL

Use only:

- candidate branch: `assets/acolyte-of-the-white-rune-candidate` (**unmerged**)
- verified candidate commit: `69e176e`
- candidate path: `art-source/acolyte-of-the-white-rune.webp`
- byte size: `214378`
- dimensions: `1024 × 1536`
- container: plain `VP8 `
- SHA-256: `cb76658416628f91b721c826a451342319bcfe39ff3b5f770a5f8ca73ba499fe`
- full decode: PASS

The earlier truncated commit `1652efaa` is superseded and must never be used.

## QA result

All required surfaces PASS against the verified exact master:

- raw master
- `CardView` 3:4
- `CardDetailDrawer` 4:5
- `HandCardPreview` 7:9
- `CreatureSlot` 3:4
- `/admin/art-review` desktop
- `/admin/art-review` 390 px mobile
- 92 px thumbnail
- side-by-side COMMON-vs-LEGENDARY hierarchy vs. `high-warden-of-the-white-rune`

The full §15 checklist passes.

Two caveats are accepted as non-blocking for the current shipped surfaces:

1. head clearance under the binding 4:5 crop is only ~2–4 px; nothing is clipped today, but any future tighter surface requires re-checking this card;
2. the render is more photographic than the older painterly Art Pack 01/02 baseline; this exact image was explicitly liked/accepted by the owner and its faction/rank readability passes.

## Current task — INTEGRATION ONLY

Execute `docs/CLAUDE_CURRENT_TASK.md` exactly as written.

Required integration scope:

- copy the verified exact master to `apps/web/public/art/cards/acolyte-of-the-white-rune.webp`
- update only this card's `artworkUrl` and `rightsStatus: 'owned'` in `apps/game-server/prisma/seed.ts`
- create/update Art Pack 03 documentation and mark Card 01 FINAL APPROVED
- update this card's `/admin/art-review` status from candidate wording to approved production-art review if needed
- validate exact byte identity, lint/typecheck/tests/build and real production-path visual surfaces
- deliver through a dedicated branch/PR with full handoff

## Production sync — NOT AUTHORISED IN THIS TASK

Do not modify or dispatch:

- `apps/game-server/scripts/sync-production-card-art.ts`
- `.github/workflows/production-card-art-sync.yml`
- `REQUIRED_SOURCE_COMMIT`
- `TARGET_SLUGS`
- confirmation string
- count assertions
- production database

The 10→11 production-art sync is a **separate post-merge follow-up**. Its immutable source pin must reference the already-merged Card 01 integration commit, so it cannot be correctly finalised before this integration PR merges.

## Confirmed untouched by the approval transition

No artwork file, seed data, schema, gameplay, production sync, Railway/Vercel configuration, or production database was changed while recording the approval and moving to the integration task.

## Previous milestone

SHADOW Art Pack 02 remains complete end to end. Its prior ten-card production sync was already executed successfully. The old `SYNC-10-CARD-ART-PRODUCTION` confirmation is consumed and is not standing authorization for future syncs.

## Recommended next action

Have Claude execute the current integration task, open the dedicated PR, validate it fully, and stop before merge/production sync unless separately authorised.

## Reader protocol

1. Read this file.
2. Read `docs/CLAUDE_CURRENT_TASK.md`.
3. Read `docs/agent-reports/2026-08-27-art-pack-03-card-01-owner-approval-transition.md` for the approval decision.
4. Read `docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-review.md` for full QA evidence.
5. Resolve fresh `main` and candidate commit `69e176e` from GitHub before acting.
6. Repository state is authoritative over stale chat summaries.