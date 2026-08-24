# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first; after each completed task update it last and verify it from GitHub

## Current project state

- **Phase:** SHADOW Art Pack 02 — Card 04 master candidate review
- **Status:** AWAITING OWNER VISUAL APPROVAL — replacement master v2 verified 5/5, all four live RUNE surfaces validated. Nothing promoted.
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Latest handoff report:** PR #34 comment `5401067896` (`## AGENT HANDOFF — FINAL REPORT`, supersedes `5400625933`)
- **Review-support PR:** #34 — `claude/card-04-rune-review-support` @ `b4ecdc259febb747fe7f17a8fdd932a070d94a61`, OPEN / NOT MERGED
- **Prior generation report (integrity claims now disproven):** `docs/agent-reports/2026-08-24-shadow-card-04-master-generated.md`
- **Approved concept:** `docs/agent-reports/2026-08-24-shadow-card-04-concept-review.md`
- **Candidate branch:** `assets/rune-of-the-echoing-dusk-candidate-v2`
- **Candidate HEAD:** `941fe2381a97e72406f6ba4809c455088c231cf0` (blob `794c3b22`)
- **Superseded / DO NOT USE:** `assets/rune-of-the-echoing-dusk-candidate` @ `f702bd2` — 14,999 bytes of non-image data; delete it
- **Candidate asset:** `art-source/rune-of-the-echoing-dusk.webp`
- **Source note:** `docs/art-sources/2026-08-24-shadow-card-04-master-prompt.md`
- **PR:** #34 (review support only)
- **Promotion:** not performed. Sync remains at 9 targets.

## Candidate integrity — VERIFIED 5/5 (v2)

Independently verified by reading the blob out of git on `assets/rune-of-the-echoing-dusk-candidate-v2`.

| Check | Expected | Actual | Verdict |
| --- | --- | --- | --- |
| SHA-256 | `319bdccc4dad399e3f048bf4aa095910c1fd255f453387a8604e1022734eb858` | identical | PASS |
| file size | `351690` | `351690` | PASS |
| RIFF total | `351690` | `351690` | PASS |
| dimensions | `1024x1536` | `1024x1536` | PASS |
| container | WebP `VP8 ` | `RIFF`…`WEBP`, `VP8 ` | PASS |

Plain `VP8 `, matching the rest of the pack — an original export, not a re-encode. The transport blocker is genuinely resolved.

**The v1 branch `assets/rune-of-the-echoing-dusk-candidate` @ `f702bd2` is superseded and must not be used**: 14,999 bytes, no image magic at any offset, entropy 7.987 bits/byte. Its source note asserts integrity values that never matched its bytes. Delete the branch.

## Visual QA — all four live RUNE surfaces PASS

Validated on the PR #34 review path against a live stack, candidate served from the gitignored review slot:

- Collection / hand `CardView` 3:4 — PASS
- `CardDetailDrawer` 4:5 — PASS
- `HandCardPreview` 7:9 — PASS
- `CardView size="xs"` / 92 px hand legibility — PASS
- RUNE row renders 4 panels, no `CreatureSlot`; CHARACTER row still 5; no page errors; mobile 390×844 clean

Concept conformance checked against the approved "Owner decision": inverted taper, mask at ~47% height rather than the apex, dead-blue confined to fractures, crimson confined to mask glyph / eye-slits / rune channel / base seal, Echo-Shadow grey and secondary, black-fill silhouette break from the three humanoid SHADOW cards — all hold.

Two non-blocking caveats: the stele's crown tip is clipped by the 4:5 crop (nothing essential lost), and at 92 px the surviving mark is the dark monolith plus the blue/crimson two-tone rather than the mask itself, which deviates from the concept's prediction without failing the requirement.

## Remaining work

1. ~~Verify the candidate integrity.~~ **DONE — v2 PASSES 5/5.**
2. ~~Add the non-CHARACTER path to `/admin/art-review`.~~ **DONE** in PR #34 (`b4ecdc2`), OPEN / NOT MERGED. Gates green: lint 0, typecheck 0, 349/349, build 0.
3. ~~Validate the live RUNE surfaces.~~ **DONE — all four PASS.**
4. **BLOCKED ON OWNER — visual approval of the Card 04 artwork.** Nothing further should happen until the owner approves.
5. On approval only: copy the master to `apps/web/public/art/cards/rune-of-the-echoing-dusk.webp`, add `artworkUrl` + `rightsStatus: 'owned'` to the `rune-of-the-echoing-dusk` entry in `seed.ts` (that card only), reseed, re-capture the four surfaces against the production path, set `docs/art-pack-02.md` Card 04 to FINAL APPROVED, then extend the production sync 9 -> 10.

Do not change `artworkUrl`, `rightsStatus`, production DB or production sync until owner approval. Sync currently remains at 9 targets.

## Reader protocol

Read this file, then `docs/CLAUDE_CURRENT_TASK.md`, then the latest handoff report or PR, and resolve current `main` HEAD directly from GitHub.
