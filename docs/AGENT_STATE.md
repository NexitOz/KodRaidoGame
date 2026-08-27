# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 01 **REPOSITORY INTEGRATION MERGED — 11-CARD PRODUCTION-SYNC PREPARATION READY FOR AGENT EXECUTION**
- **Current target:** post-merge controlled production-art sync preparation for `acolyte-of-the-white-rune` / «Послушник Белой Руны»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `4b8caa44b53857e2789b4b3f8ee24a856bb57a7d`
- **Latest transition report:** `docs/agent-reports/2026-08-27-art-pack-03-card-01-integration-merged-transition.md`
- **Transition report commit:** `ec16f77b41783ca0f375f2330583537192621256`
- **Branch:** `main`
- **Current preparation PR:** none yet

## Card 01 repository integration — MERGED

PR #35, `Integrate approved PURIFICATION Card 01 production artwork (acolyte-of-the-white-rune)`, was independently reviewed and merged.

- reviewed PR head: `7e8778b826924f53b69771d36f8a850dae4462c5`
- squash merge commit / immutable merged source: `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`
- GitHub Actions CI on reviewed head: PASS (`33076310764`)
- Vercel status on reviewed head: PASS
- changed files in integration PR: exactly 4

Integrated production art:

- path: `apps/web/public/art/cards/acolyte-of-the-white-rune.webp`
- dimensions: `1024 × 1536`
- byte size: `214378`
- container: plain `VP8 `
- SHA-256: `cb76658416628f91b721c826a451342319bcfe39ff3b5f770a5f8ca73ba499fe`

`apps/game-server/prisma/seed.ts` now records only this card's approved production art fields:

- `artworkUrl: '/art/cards/acolyte-of-the-white-rune.webp'`
- `rightsStatus: 'owned'`

`docs/art-pack-03.md` records Card 01 as FINAL APPROVED. `/admin/art-review` now reviews the production path rather than the candidate path.

## Card 01 visual QA — COMPLETE

All required surfaces passed against the exact approved master:

- raw master
- `CardView` 3:4
- `CardDetailDrawer` 4:5
- `HandCardPreview` 7:9
- `CreatureSlot` 3:4
- `/admin/art-review` desktop
- `/admin/art-review` 390 px mobile
- 92 px thumbnail
- COMMON-vs-LEGENDARY hierarchy vs. `high-warden-of-the-white-rune`

The §15 checklist passed in full.

Owner-accepted caveats remain documented:

1. head clearance under the binding 4:5 crop is only ~2–4 px; current shipped crops pass, but any tighter future crop must re-check this card;
2. rendering is more photographic than the older painterly baseline; the exact image was explicitly accepted.

## Current task — PREPARE CONTROLLED SYNC 10 → 11 ONLY

Execute `docs/CLAUDE_CURRENT_TASK.md` exactly as written.

The preparation must use this exact immutable merged source:

`92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`

Required preparation scope:

- extend `apps/game-server/scripts/sync-production-card-art.ts` from 10 to 11 targets by adding `acolyte-of-the-white-rune`
- repoint `REQUIRED_SOURCE_COMMIT` to the merge commit above
- extend `.github/workflows/production-card-art-sync.yml` to the same 11-card target set
- update `SOURCE_COMMIT` to the same immutable SHA
- move every controlled target-count assertion from 10 to 11
- replace the consumed old confirmation gate with the fresh dormant string `SYNC-11-CARD-ART-PRODUCTION`
- open a dedicated preparation PR with full handoff

### Critical authorization boundary

This task is **configuration preparation only**.

The new confirmation string being present in the workflow is **not authorization to use it**.

The agent must NOT:

- connect to Railway production
- run the production scope command
- run a production `--check`
- run `--apply`
- query the production DB, even read-only
- dispatch the workflow
- mutate the production database

After the preparation PR is reviewed and merged, the owner must separately provide fresh explicit authorization before any production sync run.

## Current controlled production-sync state before preparation

The repository still contains the already-executed ten-card configuration:

- source pin: `23e83c9978a9045059d3009eb1983b17f005d1d3`
- ten target slugs
- confirmation string: `SYNC-10-CARD-ART-PRODUCTION`

That old confirmation is **CONSUMED** and grants nothing for future runs.

## Previous milestones

### SHADOW Art Pack 02 — COMPLETE

Cards 01–04 are FINAL APPROVED and the prior controlled ten-card production sync completed successfully. Do not reopen it as current work.

### PURIFICATION Art Pack 03

- Card 01 `acolyte-of-the-white-rune` — FINAL APPROVED, repository integration MERGED
- Card 02 `seal-of-the-curse` — not started
- Card 03 `warden-of-the-barrier` — not started
- Card 04 `rune-of-curse-breaking` — not started

Do not begin Card 02 inside the sync-preparation task.

## Recommended next action

Have Claude execute the current sync-preparation task and stop with the dedicated PR open for review. Do not authorize or dispatch production sync yet.

## Reader protocol

1. Read this file.
2. Read `docs/CLAUDE_CURRENT_TASK.md`.
3. Read `docs/agent-reports/2026-08-27-art-pack-03-card-01-integration-merged-transition.md` for the post-merge transition.
4. Read `docs/art-pack-03.md` for the durable Card 01 record.
5. Resolve fresh `main` and verify merge commit `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9` before acting.
6. Repository state is authoritative over stale chat summaries.
