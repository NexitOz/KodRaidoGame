# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 01 candidate GENERATED — READY FOR REPOSITORY VISUAL QA
- **Current target:** `acolyte-of-the-white-rune` / «Послушник Белой Руны»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `2bdb69b9828b3ae1ce1374c65e60741e7420d28f`
- **Latest generation handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-generated.md`
- **Generation handoff commit:** `911a9206b527fff1868d1d891fc9b45dde1f4443`
- **Branch:** `main`
- **PR:** none for the generation handoff

## Candidate source

The external master candidate is committed on an unmerged branch:

- branch: `assets/acolyte-of-the-white-rune-candidate`
- candidate commit: `1652efaa1bc47771a08246bb9b498d9b737b7092`
- candidate path: `art-source/acolyte-of-the-white-rune.webp`
- source note: `docs/art-sources/2026-08-27-purification-card-01-master-prompt.md`
- branch vs main at creation: ahead by 1, behind by 0
- changed files vs main: exactly 2
- merged: **NO**

Candidate integrity recorded before upload:

- dimensions: `1024 × 1536`
- byte size: `214378`
- RIFF-declared total: `214378`
- container fourcc: plain `VP8 `
- SHA-256: `cb76658416628f91b721c826a451342319bcfe39ff3b5f770a5f8ca73ba499fe`

The next agent must verify these independently from the committed bytes before any visual review.

## Owner-approved visual direction

The final brief is:

`docs/art-review/acolyte-of-the-white-rune-master-art-brief.md`

Locked owner decisions:

- light plain standard-issue armor, not robes
- three-quarter framing cut at mid-thigh
- bare head, no crown/head ornament
- no weapon / shield / cape
- small white-stone rune tablet in both bare hands
- white / silver / ivory PURIFICATION palette
- cold pale-blue-white material-bound rune glow
- restrained gold, two hairlines / ~3% maximum
- modest cloister architecture, no flagship cathedral/crowd devices

The candidate direction was selected by the owner for continuation. Exact generation/refinement provenance is recorded honestly in the candidate source note.

## Current review task

The current task is now **verification + real-surface visual QA only**.

Required review surfaces:

- raw master
- `CardView` 3:4
- `CardDetailDrawer` 4:5
- `HandCardPreview` 7:9
- `CreatureSlot` 3:4
- `/admin/art-review` desktop
- `/admin/art-review` 390px mobile
- 92px thumbnail
- side-by-side hierarchy check vs `high-warden-of-the-white-rune`

The current `/admin/art-review` target list does not yet include `acolyte-of-the-white-rune`; adding exactly that one review target is authorised if required for QA. It must remain a candidate path, not a production `reviewArtworkUrl`.

The review must walk §15 of the approved brief and finish with one status:

- **READY FOR OWNER VISUAL APPROVAL**, or
- **REJECTED / BLOCKED**

## Hard stop

No promotion is authorised.

Do not:

- merge `assets/acolyte-of-the-white-rune-candidate`
- copy the candidate into `apps/web/public/art/cards/`
- change `seed.ts`
- change any `artworkUrl` / `rightsStatus`
- change Prisma schema/migrations
- change gameplay, balance, card data, stats, rarity, faction or effects
- change Battlefield gameplay/layout
- change production sync script/workflow
- change Railway/Vercel configuration
- touch the production DB
- run production sync

## Previous milestone

SHADOW Art Pack 02 remains complete end to end. Its ten-card production sync was already executed successfully. The old confirmation `SYNC-10-CARD-ART-PRODUCTION` is consumed and is not standing authorization for any future sync.

## Recommended next action

Execute `docs/CLAUDE_CURRENT_TASK.md` exactly as written. Verify candidate commit `1652efaa...`, perform the real-surface QA, write the GitHub handoff, update this file last, and stop for owner visual approval.

## Reader protocol

1. Read this file.
2. Read `docs/CLAUDE_CURRENT_TASK.md`.
3. Read `docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-generated.md` if generation/transport context is needed.
4. Resolve fresh `main` and candidate branch refs from GitHub before acting.
5. Repository state is authoritative over stale chat summaries.