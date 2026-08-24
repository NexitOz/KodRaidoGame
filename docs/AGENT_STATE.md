# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first; after each completed task update it last and verify it from GitHub

## Current project state

- **Phase:** SHADOW Art Pack 02 — Card 04 master candidate review
- **Status:** BLOCKED — the committed candidate FAILED integrity verification and is not an image. Review path is ready; a valid master is required.
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Latest handoff report:** PR #34 comment (`## AGENT HANDOFF — FINAL REPORT`)
- **Review-support PR:** #34 — `claude/card-04-rune-review-support` @ `b4ecdc259febb747fe7f17a8fdd932a070d94a61`, OPEN / NOT MERGED
- **Prior generation report (integrity claims now disproven):** `docs/agent-reports/2026-08-24-shadow-card-04-master-generated.md`
- **Approved concept:** `docs/agent-reports/2026-08-24-shadow-card-04-concept-review.md`
- **Candidate branch:** `assets/rune-of-the-echoing-dusk-candidate`
- **Candidate HEAD:** `f702bd2ab60eae32d0fdbd2bf91504995f75c48f`
- **Candidate asset:** `art-source/rune-of-the-echoing-dusk.webp`
- **Source note:** `docs/art-sources/2026-08-24-shadow-card-04-master-prompt.md`
- **PR:** #34 (review support only)
- **Promotion:** not performed. Sync remains at 9 targets.

## Candidate integrity — VERIFICATION FAILED

Independently verified by reading the blob out of git. **0 of 5 checks pass.**

| Check | Recorded | Actual | Verdict |
| --- | --- | --- | --- |
| SHA-256 | `319bdccc…` | `1ccbf855bb36be897c0e352049ec295b7cd3306db9a5a371adbfd9d2094fdd3d` | FAIL |
| file size | `351690` | **`14999`** | FAIL |
| RIFF total | `351690` | none — no RIFF header | FAIL |
| dimensions | `1024x1536` | undeterminable | FAIL |
| container | WebP `VP8 ` | none | FAIL |

`art-source/rune-of-the-echoing-dusk.webp` on `assets/rune-of-the-echoing-dusk-candidate` @ `f702bd2` **is not an image in any format**. No `RIFF`/`WEBP`/`VP8`/PNG/JPEG magic anywhere in the file, `file(1)` reports `data`, entropy 7.987 bits/byte. The candidate commit itself records `Bin 0 -> 14999 bytes`, so the wrong bytes were committed at creation — not corrupted in transit, not a Git LFS pointer.

The integrity block in `docs/art-sources/2026-08-24-shadow-card-04-master-prompt.md` asserts values that do not match the committed bytes. **The image-generation blocker is NOT resolved.**

## Remaining work

1. ~~Independently verify the candidate integrity.~~ **DONE — FAILED.** See above.
2. ~~Add the non-CHARACTER path to `/admin/art-review`.~~ **DONE** in PR #34. RUNE rows render 4 panels with no `CreatureSlot`; CHARACTER rows still render 5; verified live, no page errors. Gates green: lint 0, typecheck 0, 349/349, build 0.
3. **BLOCKED — re-export and commit a real Card 04 master.** The review path is ready and does not need repeating; only a valid `.webp` is missing. Record the sha256 at export time and re-check it after committing, which is the step that would have caught this hand-off.
4. Then review the live RUNE surfaces (Collection/hand `CardView` 3:4, `CardDetailDrawer` 4:5, `HandCardPreview` 7:9, 92 px hand legibility) and request owner visual approval.
5. Only after approval: promote `artworkUrl`/`rightsStatus`, set Art Pack 02 Card 04 FINAL APPROVED, extend the production sync 9 -> 10.

Do not change `artworkUrl`, `rightsStatus`, production DB or production sync until owner approval.

## Reader protocol

Read this file, then `docs/CLAUDE_CURRENT_TASK.md`, then the latest handoff report or PR, and resolve current `main` HEAD directly from GitHub.
