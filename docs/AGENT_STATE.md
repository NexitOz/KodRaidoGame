# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 01 **INTEGRATED — PR #35 OPEN, NOT MERGED**
- **Current target:** `acolyte-of-the-white-rune` / «Послушник Белой Руны»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `5f6cdddad3420a9c898a72d6e405d605b7cf9e8d`
- **Integration branch:** `claude/integrate-acolyte-of-the-white-rune-art` @ `7e8778b`
- **Integration PR:** #35 — https://github.com/NexitOz/KodRaidoGame/pull/35 (OPEN, **not merged**)
- **Integration handoff:** full final report posted as a comment on PR #35
- **Latest decision handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-01-owner-approval-transition.md`
- **Decision handoff commit:** `7bfc6a077d2655588989468cab170e30e1723285`
- **Full candidate QA:** `docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-review.md`
- **Branch:** `main`
- **PR:** #35 (integration), unmerged

## Integration status — PR #35, awaiting merge

Card 01 is integrated in the repository on `claude/integrate-acolyte-of-the-white-rune-art`
(`7e8778b`) and recorded in `docs/art-pack-03.md` as FINAL APPROVED. **The PR is deliberately
unmerged** — no standing authorisation for agent merge applies to this task.

Four files: the production artwork at `apps/web/public/art/cards/acolyte-of-the-white-rune.webp`
(214378 bytes, SHA-256 `cb766584…`, copied byte-for-byte out of the candidate git object and
re-verified at the production path), three lines in `seed.ts` on this card only (`artworkUrl` +
`rightsStatus: 'owned'`), the `/admin/art-review` target flipped from candidate to production art,
and the new `docs/art-pack-03.md`.

`git cat-file -s HEAD:apps/web/public/art/cards/acolyte-of-the-white-rune.webp` returns **214378**.

Validation all PASS: `git diff --check`, Prettier, ESLint (web + game-server), typecheck (0 errors),
game-server tests 156/156, game-engine tests 88/88, and the `apps/web` production build. Two honest
notes: `seed.ts` was deliberately not run through `prettier --write` (already dirty on `main`; a
write would reformat 58 unrelated lines, and the added lines already match Prettier's output), and
typecheck/build require `packages/shared` and `packages/ui` to be built first, without which 4
pre-existing errors in untouched files appear as a build-order artifact.

Visual confirmation came from the **production** path: the gitignored candidate file was deleted
first so no fallback was possible, and the network trace inverted correctly — only
`/art/cards/acolyte-of-the-white-rune.webp` is requested, the candidate path 404s and is not
requested at all. Badges read `rightsStatus: owned` / `PRODUCTION ASSET — REVIEW`.

### Owner-accepted caveats, carried forward

1. **Head clearance ~2–4 px under the 4:5 crop** (hair crown at master row ~130, cut at row 128).
   Nothing clipped in any shipped crop. **Treat 4:5 as the hard floor for this asset** — if a
   tighter crop is ever introduced, re-check this card first.
2. **Rendering is more photographic than the older painterly baseline.** Worth settling as a
   house-style question when Art Pack 03 Cards 02–04 are briefed.

Both are recorded in `docs/art-pack-03.md`.

### Production sync — NOT started, and correctly so

`apps/game-server/scripts/sync-production-card-art.ts`,
`.github/workflows/production-card-art-sync.yml`, `REQUIRED_SOURCE_COMMIT`, `TARGET_SLUGS`, the
confirmation string and every count assertion are untouched. The script is still pinned to
`23e83c9978a9045059d3009eb1983b17f005d1d3` with ten slugs and `SYNC-10-CARD-ART-PRODUCTION`, which
is **consumed** and is not standing authorization.

The 10 → 11 extension is a **post-merge** task: its immutable source pin must point at an
already-merged integration commit, which does not exist until PR #35 lands.

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

**Owner review and merge of PR #35.** The integration task is complete; the PR is intentionally left
unmerged.

Once it lands, the separate 10 → 11 production-sync extension can begin: repoint
`REQUIRED_SOURCE_COMMIT` at the merge commit and move `TARGET_SLUGS`, the workflow confirmation
string and **every** count assertion together in one change. It needs a fresh owner confirmation —
`SYNC-10-CARD-ART-PRODUCTION` is consumed and grants nothing.

## Reader protocol

1. Read this file.
2. Read `docs/CLAUDE_CURRENT_TASK.md`.
3. The integration handoff is the **final report comment on PR #35**; `docs/art-pack-03.md` is the
   durable record. `…-owner-approval-transition.md` holds the approval decision and
   `…-candidate-review.md` the full QA evidence.
4. Read `docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-review.md` for full QA evidence.
5. Resolve fresh `main` and candidate commit `69e176e` from GitHub before acting.
6. Repository state is authoritative over stale chat summaries.
