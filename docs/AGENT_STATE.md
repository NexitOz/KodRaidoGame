# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first; after each completed task update it last and verify it from GitHub

## Current project state

- **Phase:** SHADOW Art Pack 02 — Card 04 integrated, awaiting final repository review
- **Status:** INTEGRATION COMPLETE — artwork promoted in-repo, sync extended 9 -> 10, all gates green. NOT merged, sync NOT dispatched, production DB NOT mutated.
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Latest handoff report:** PR #34 comment `5401303175` (`## AGENT HANDOFF — FINAL REPORT`, supersedes `5400625933` and `5401067896`)
- **Owner visual approval:** PR #34 comment `5401140209`
- **Integration PR:** #34 — `claude/card-04-rune-review-support` @ `6eb44cf46497f5303de433dae2d717a9f843d1c6`, OPEN / NOT MERGED
- **Reviewed head before integration:** `b4ecdc259febb747fe7f17a8fdd932a070d94a61`
- **Approved concept:** `docs/agent-reports/2026-08-24-shadow-card-04-concept-review.md`
- **Verified candidate branch:** `assets/rune-of-the-echoing-dusk-candidate-v2`
- **Verified candidate HEAD:** `941fe2381a97e72406f6ba4809c455088c231cf0` (blob `794c3b22`)
- **Superseded / DO NOT USE:** `assets/rune-of-the-echoing-dusk-candidate` @ `f702bd2` — invalid non-image data
- **Candidate asset:** `art-source/rune-of-the-echoing-dusk.webp`
- **Target production artwork path:** `apps/web/public/art/cards/rune-of-the-echoing-dusk.webp`
- **PR:** #34
- **Promotion:** in-repo promotion DONE on the PR branch (`artworkUrl` + `rightsStatus: 'owned'` for this card only). Not on `main` until PR #34 merges.
- **Production sync:** target list extended to **10** in PR #34, **not dispatched**. Production DB untouched; it still reports `placeholder` for this card.

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

## Integration result — COMPLETE on PR #34

All seven required steps done; every gate green.

- Master copied byte-for-byte out of git and re-verified at the production path: sha256 `319bdccc…`, 351,690 bytes, RIFF total 351,690, 1024×1536, container plain `VP8 `. `cmp` against the candidate blob reports IDENTICAL.
- `seed.ts`: three lines in the `rune-of-the-echoing-dusk` entry only — `artworkUrl` + `rightsStatus: 'owned'`. No other card; none of this card's own gameplay data changed.
- `/admin/art-review`: Card 04 promoted to `APPROVED 04` with `reviewArtworkUrl`; the non-CHARACTER `hasBoardSlot` support is preserved and CHARACTER behaviour is unchanged.
- `docs/art-pack-02.md`: Card 04 recorded **FINAL APPROVED**.
- Production sync extended **9 → 10** targets; **not dispatched**.
- Gates: lint 0, typecheck 0, **349/349** tests, build 0, `git diff --check` clean.
- Sync preflight (non-mutating): 10 unique slugs in script and workflow with the two lists identical, 10/10 artwork files present, 10/10 seed entries resolving to `/art/cards/<slug>.webp` with `owned`, no stale nine-card assertion, all safeguards intact.

## Production-path visual QA — PASS

The gitignored candidate file was deleted before QA so the surfaces could only resolve through the production path. Collection / hand `CardView` 3:4, `CardDetailDrawer` 4:5, `HandCardPreview` 7:9, 92 px `xs`, `/admin/art-review` (4 panels, no `CreatureSlot`), mobile 390×844 and the real `/collection` page all PASS; CHARACTER rows still render 5 panels.

Proven by a network trace showing the only URL requested for this card was `/art/cards/rune-of-the-echoing-dusk.webp` with zero candidate-slot requests, and by the badge reading `rightsStatus: owned` / `PRODUCTION ASSET — REVIEW`. Only the two owner-accepted caveats remain; **no new regression**.

## Required follow-up before the sync can run

`REQUIRED_SOURCE_COMMIT` in both the script and the workflow still names the Card 03 merge (`d40e034`). Card 04's seed entry and artwork do not exist at that commit, so dispatching today fails the workflow's immutable-source check **by design** — a safe, loud failure rather than a silent one. The correct SHA cannot exist until PR #34 merges. A comment at the constant and a note in `docs/art-pack-02.md` both record this. After merge: repoint both, then dispatch with confirmation `SYNC-10-CARD-ART-PRODUCTION`.

## Hard stop

- PR #34 is **NOT merged**. Awaiting final repository review.
- Production card-art sync **NOT dispatched**. Confirmation string is now `SYNC-10-CARD-ART-PRODUCTION`.
- Production database **NOT mutated**; it still reports `placeholder` for this card.
- No unrelated card, gameplay, balance or infrastructure was altered.

## Reader protocol

Read this file, then `docs/CLAUDE_CURRENT_TASK.md`, then PR #34 and its latest handoff / owner-approval comments. Resolve current `main` HEAD and PR head directly from GitHub before making changes.
