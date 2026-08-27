# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 01 candidate v1 **REJECTED — truncated file. Re-transport required.**
- **Current target:** `acolyte-of-the-white-rune` / «Послушник Белой Руны»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Latest handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-rejected.md`
- **Superseded generation handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-generated.md` — its
  reported integrity values describe the generator's **local** file, not the blob that reached git
- **Branch:** `main`
- **PR:** none

## Candidate source — v1 REJECTED, DO NOT USE

- branch: `assets/acolyte-of-the-white-rune-candidate`
- candidate commit: `1652efaa1bc47771a08246bb9b498d9b737b7092`
- candidate path: `art-source/acolyte-of-the-white-rune.webp`
- source note: `docs/art-sources/2026-08-27-purification-card-01-master-prompt.md`

**This candidate failed independent byte verification and must not be used, staged, promoted or
merged.**

| Check                      | Expected    | Actual                              | Result   |
| -------------------------- | ----------- | ----------------------------------- | -------- |
| Container fourcc           | `VP8 `      | `VP8 `                              | PASS     |
| Dimensions                 | 1024 × 1536 | 1024 × 1536                         | PASS     |
| RIFF-declared == byte size | 214,378     | declared 214,378, actual **15,042** | **FAIL** |
| SHA-256                    | `cb766584…` | `7822d32a…`                         | **FAIL** |
| Full decode                | succeeds    | `could not create decoder object`   | **FAIL** |

Only 7.0% of the file arrived. The truncation is baked into the commit: `git cat-file -s` returns
15042, GitHub's API reports the blob as 15042, and the commit diffstat records
`Bin 0 -> 15042 bytes`. Not a fetch artifact.

**The art itself is fine — do not regenerate.** The surviving RIFF header declares exactly 214,378,
matching the source note, which confirms the export was real and complete. Only the transport failed.

**No visual judgement of the artwork has been made.** The five review surfaces and the §15 checklist
were not run — there is no decodable image — so brief compliance remains unknown.

### Second ~15 KB truncation on this project

SHADOW Card 04 v1 was 14,999 bytes; this is 15,042. Two uploads landing within 43 bytes of each
other is a repeatable size cap in the upload path, not random corruption. Card 04 was recovered by
switching routes to a `-v2` branch; do the same here.

### Required fix

1. Do not regenerate. On the machine holding the real file, confirm `sha256sum` prints `cb766584…`.
2. Commit with the **git CLI from local disk** — not a web-UI upload, not an API create-file call,
   not a base64 payload.
3. **Before pushing:** `git cat-file -s HEAD:art-source/acolyte-of-the-white-rune.webp` must print
   `214378`. This reads the size back out of the object git actually stored; run before either
   truncation it would have caught both.
4. Push to `assets/acolyte-of-the-white-rune-candidate-v2`. Leave the broken branch as evidence; do
   not force-push over it.

When v2 lands, walk §15 strictly against the real file — the generator recorded that its refinement
prompt was not a byte-for-byte copy of §13/§14, so compliance must not be inferred from prompt text.

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
