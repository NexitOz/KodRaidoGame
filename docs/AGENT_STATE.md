# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first; after each completed task update it last and verify it from GitHub

## Current project state

- **Phase:** SHADOW Art Pack 02 — Card 04 approved integration
- **Status:** OWNER VISUAL APPROVED — ready for mechanical repository integration. Nothing promoted or merged yet.
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Latest handoff report:** PR #34 comment `5401067896` (`## AGENT HANDOFF — FINAL REPORT`)
- **Owner visual approval:** PR #34 comment `5401140209`
- **Review-support PR:** #34 — `claude/card-04-rune-review-support` @ `b4ecdc259febb747fe7f17a8fdd932a070d94a61`, OPEN / NOT MERGED
- **Approved concept:** `docs/agent-reports/2026-08-24-shadow-card-04-concept-review.md`
- **Verified candidate branch:** `assets/rune-of-the-echoing-dusk-candidate-v2`
- **Verified candidate HEAD:** `941fe2381a97e72406f6ba4809c455088c231cf0` (blob `794c3b22`)
- **Superseded / DO NOT USE:** `assets/rune-of-the-echoing-dusk-candidate` @ `f702bd2` — invalid non-image data
- **Candidate asset:** `art-source/rune-of-the-echoing-dusk.webp`
- **Target production artwork path:** `apps/web/public/art/cards/rune-of-the-echoing-dusk.webp`
- **PR:** #34
- **Promotion:** not performed
- **Production sync:** remains at 9 targets and has not been dispatched for Card 04

## Approved candidate integrity — VERIFIED 5/5

The owner-approved v2 master was independently verified from git:

- SHA-256: `319bdccc4dad399e3f048bf4aa095910c1fd255f453387a8604e1022734eb858`
- file size: `351690` bytes
- RIFF total: `351690` bytes
- dimensions: `1024x1536`
- container: WebP `VP8 `

## Owner decision — FINAL VISUAL APPROVAL

The owner approved Card 04 for integration on 2026-08-24.

Accepted non-blocking caveats:

1. The fractured crown tip is clipped in the 4:5 Card Detail crop; no essential information is lost.
2. At 92 px the mask is not individually legible, but the monolith silhouette plus dead-blue/crimson two-tone remains distinctive and readable enough for the hand fan.

These caveats are accepted and must not be treated as blockers unless a new regression appears after promotion to the production artwork path.

## Remaining work

1. Continue PR #34 and copy the verified v2 master byte-for-byte to `apps/web/public/art/cards/rune-of-the-echoing-dusk.webp`.
2. Verify the production-path copy remains byte-identical to the approved candidate.
3. Update only the `rune-of-the-echoing-dusk` seed record: `artworkUrl` to `/art/cards/rune-of-the-echoing-dusk.webp` and `rightsStatus: 'owned'`.
4. Reseed local/dev data and repeat the four RUNE surface checks against the production artwork path.
5. Mark Card 04 FINAL APPROVED in `docs/art-pack-02.md`.
6. Extend the controlled production card-art sync from 9 -> 10 targets using the existing invariant pattern, but do not dispatch it yet.
7. Run lint, typecheck, tests, build, diff checks and non-mutating sync/preflight validation.
8. Update the PR #34 handoff and stop for final repository review before merge / production synchronization.

## Hard stop

- Do not merge PR #34 yet.
- Do not dispatch production card-art sync yet.
- Do not mutate production DB yet.
- Do not alter unrelated cards, gameplay, balance or infrastructure.

## Reader protocol

Read this file, then `docs/CLAUDE_CURRENT_TASK.md`, then PR #34 and its latest handoff / owner-approval comments. Resolve current `main` HEAD and PR head directly from GitHub before making changes.
