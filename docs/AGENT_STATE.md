# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first; after each completed task update it last and verify it from GitHub

## Current project state

- **Phase:** SHADOW Art Pack 02 — Card 04 master candidate review
- **Status:** READY FOR VERIFICATION AND OWNER REVIEW
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Latest handoff report:** `docs/agent-reports/2026-08-24-shadow-card-04-master-generated.md`
- **Approved concept:** `docs/agent-reports/2026-08-24-shadow-card-04-concept-review.md`
- **Candidate branch:** `assets/rune-of-the-echoing-dusk-candidate`
- **Candidate HEAD:** `f702bd2ab60eae32d0fdbd2bf91504995f75c48f`
- **Candidate asset:** `art-source/rune-of-the-echoing-dusk.webp`
- **Source note:** `docs/art-sources/2026-08-24-shadow-card-04-master-prompt.md`
- **PR:** none yet
- **Promotion:** not performed

## Candidate integrity

- dimensions: `1024x1536`
- format: WebP (`VP8 `)
- file size: `351690` bytes
- RIFF total: `351690` bytes
- SHA-256: `319bdccc4dad399e3f048bf4aa095910c1fd255f453387a8604e1022734eb858`

The image-generation blocker is resolved: the master candidate is now in GitHub on the candidate branch.

## Remaining work

1. Independently verify the candidate integrity.
2. Add the minimum non-CHARACTER path to `/admin/art-review` so a RUNE does not render the meaningless 0/0 `CreatureSlot` panel; preserve CHARACTER behavior.
3. Review the live RUNE surfaces: Collection/hand `CardView` 3:4, `CardDetailDrawer` 4:5, `HandCardPreview` 7:9, including 92 px hand legibility.
4. Open a PR for the review-support change and provide the full repository handoff.
5. Stop for owner visual approval before any promotion.

Do not change `artworkUrl`, `rightsStatus`, production DB or production sync until owner approval.

## Reader protocol

Read this file, then `docs/CLAUDE_CURRENT_TASK.md`, then the latest handoff report or PR, and resolve current `main` HEAD directly from GitHub.
