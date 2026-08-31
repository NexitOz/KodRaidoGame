# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 03 **INTEGRATED ON MAIN + REPIN PR OPEN — READY FOR INDEPENDENT REPIN PR REVIEW, NOT SYNCED TO PRODUCTION**
- **Current target:** `warden-of-the-barrier` / «Хранительница Барьера»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `a78114815197268d10cf8a2a6b1331009d97410d`
- **Current task type:** post-merge immutable-source repin + validation; repository only; no production dispatch
- **Owner approval report:** `docs/agent-reports/2026-08-31-art-pack-03-card-03-owner-approval.md`
- **Candidate QA report:** `docs/agent-reports/2026-08-31-art-pack-03-card-03-candidate-v2-visual-qa.md`
- **Integration PR:** #39 — **MERGED**
- **Integration head SHA:** `e0e7a472ed3f66133d5448600aab65e75f6a6a2d`
- **Exact integration merge commit / immutable source to repin to:** `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`
- **Independent review:** PASS; durable PR review submitted as review id `5070287737`
- **Integration CI:** run `33425847506` — success
- **Repin PR:** **#40** — OPEN / NOT MERGED — `https://github.com/NexitOz/KodRaidoGame/pull/40`
- **Repin branch:** `claude/card-03-postmerge-repin`
- **Repin base SHA:** `28b2ccab3f92c6d6de39ad2436f2e3d7c9d48acd`
- **Latest task-result commit:** `b1ff9e3d3a7c4f205a30c287aa437d15b62a845a`
- **Repin PR handoff report:** PR #40 comment `## AGENT HANDOFF — FINAL REPORT` (`#issuecomment-5483495877`)
- **Repin CI:** run `33431221072` — success
- **Repin status:** all three pins now `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`; no `8d41b657` reference remains in the active sync script or workflow
- **Open blocker:** **INDEPENDENT REVIEW OF REPIN PR #40.** Until it is reviewed and merged, `main` still carries the stale 12-card pin and the 13-card sync stays fail-closed.
- **Repository integration authorized:** completed
- **Post-merge repin authorized:** completed on branch; **awaiting independent review of PR #40**
- **Production operation authorized:** NO
- **`SYNC-13-CARD-ART-PRODUCTION`:** RESERVED, NOT AUTHORIZED, NOT CONSUMED
- **Card 04 work authorized:** NO

## Card 02 — COMPLETE END TO END

`seal-of-the-curse` / «Печать Проклятия» is FINAL OWNER APPROVED, repository-integrated and live in production.

- production sync run: `33320281456`
- job: `99280920592`
- conclusion: success
- rows changed: exactly 1, only `seal-of-the-curse`
- final source of truth: `12/12`
- non-target field changes: `0`
- `SYNC-12-CARD-ART-PRODUCTION`: **CONSUMED**
- previous immutable 12-card source commit: `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`

## Card 03 canonical facts

- slug: `warden-of-the-barrier`
- name: «Хранительница Барьера»
- faction: PURIFICATION
- type: CHARACTER
- rarity: RARE
- cost: 3
- attack / health: 2 / 5
- ability: `При выходе: получает Щит. При Резонансе 5+: снимите Проклятие и Заглушение со всех союзников.`
- mechanics:
  - `ON_PLAY` → `SHIELD` / `SELF`
  - `ON_PLAY` + `RESONANCE_TIER_AT_LEAST 5` → `CLEANSE` / `FRIENDLY_ALL`

Gameplay, balance, ability text, schema and migrations are outside the current task.

## Card 03 — FINAL OWNER APPROVED master v2

Exact approved source:

- candidate branch: `assets/warden-of-the-barrier-candidate-v2`
- candidate QA head: `b4f35bb379d82584f0e0f28c92f3776d332752a8`
- exact binary source commit: `3dda92ef0d427b943c71212b8e24c95f659dbce5`
- candidate path: `art-source/warden-of-the-barrier.webp`
- Git blob SHA: `c4cb3f4e41f349e86b044712f267f9fdc678aa86`
- dimensions: `1024 × 1536`
- FourCC: plain `VP8 `
- byte size: `193038`
- RIFF total: `193038`
- SHA-256: `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`
- full decode: PASS

Canonical integrated production path:

`apps/web/public/art/cards/warden-of-the-barrier.webp`

Independent review verified that the merged integration branch file uses the identical Git blob SHA `c4cb3f4e41f349e86b044712f267f9fdc678aa86`, proving byte identity with the approved candidate.

Rejected historical v1 remains forbidden:

- old branch: `assets/warden-of-the-barrier-candidate`
- old size: `284002` bytes
- old SHA-256: `1a175635a24e84c86f37f11e954299ca3cb4bb675c9f9b178c134ee0ab0ea27e`

Temporary transport branch `transport/card03-v2-github-actions` is transport-only, carries a `contents: write` workflow and must never be merged into `main`.

## Card 03 QA and owner judgement — CLOSED

Candidate QA and production-path QA both passed all nine required surfaces:

1. raw 2:3
2. CardView 3:4
3. CreatureSlot 3:4
4. CardDetailDrawer 4:5
5. HandCardPreview 7:9
6. `/admin/art-review` desktop
7. `/admin/art-review` 390 px
8. 92 px thumbnail
9. 92 px grayscale

The owner explicitly accepted and closed these non-blocking judgement items:

1. one pale classical column remains in the background;
2. high-key PURIFICATION value profile (`p5 = 109`);
3. the 4:5 crop trims only the very bottom lip of the anchor base plate while preserving the planted spike and displaced rubble.

Do not reopen them unless a new regression appears.

## Card 03 repository integration — COMPLETE

PR #39 `art(card-03): integrate approved Warden of the Barrier master v2` was independently reviewed and merged.

Independent review verified:

- exactly six integration files changed;
- production WebP Git blob equals the approved candidate blob `c4cb3f4e41f349e86b044712f267f9fdc678aa86`;
- Card 03 `seed.ts` change is art metadata only: canonical artwork path + `rightsStatus: 'owned'`;
- `/admin/art-review` uses the canonical production path and preserves CHARACTER / CreatureSlot behavior;
- 12 → 13 target extension is internally consistent;
- CI `33425847506` passes lint, dependency builds, typecheck, tests and build;
- Vercel check is success;
- no production workflow was dispatched and no production DB/Railway mutation occurred.

Exact merge commit:

`8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`

This is the only correct immutable source commit for the 13-card sync. Do not pin to the integration head, candidate branch, or later docs-only commits. The repin to this SHA is **done on branch** and open for review as PR #40.

## Production sync 12 → 13 — REPIN DONE ON BRANCH, AWAITING REVIEW

The merged repository code contains the intended 13-target definition and reserved confirmation string `SYNC-13-CARD-ART-PRODUCTION`.

However, the integration PR deliberately kept the old 12-card immutable source pin `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757` because the merge commit did not exist before merge. That pre-merge state was intentionally fail-closed.

All three pin sites were repointed to `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b` on PR #40:

- `REQUIRED_SOURCE_COMMIT` in `apps/game-server/scripts/sync-production-card-art.ts`;
- `REQUIRED_SOURCE_COMMIT` in `.github/workflows/production-card-art-sync.yml`;
- `SOURCE_COMMIT` in `.github/workflows/production-card-art-sync.yml`.

No `8d41b657` reference remains in the active sync script or workflow on that branch. The
deliberately-stale-pin comments were replaced with accurate post-merge ones.

Verified at the merge commit: art blob `c4cb3f4e41f349e86b044712f267f9fdc678aa86`, `193038` bytes,
SHA-256 `bf5814d3…`; seed carries `/art/cards/warden-of-the-barrier.webp` and `rightsStatus: 'owned'`;
exactly one target added beyond the previous twelve; `ARTWORK_FILES_PRESENT=13/13`.

Derivation now succeeds where it previously failed closed — read-only `--check` against a local test
database returned `TARGET_ROWS=13`, `UNIQUE_SLUGS=13`, `SOURCE_OF_TRUTH_MATCH=13/13`,
`ROWS_REQUIRING_MUTATION=0`, exit 0. Pin enforcement was re-verified by negative control: the old
SHA is still rejected, and `--apply` still demands a fresh snapshot. No check was weakened.

**`main` itself still carries the stale 12-card pin until PR #40 merges**, so the 13-card sync
remains fail-closed on `main` right now.

Still forbidden until PR #40 is reviewed and merged:

- workflow dispatch;
- production DB mutation;
- Railway/Vercel production access or mutation;
- any artwork/gameplay/schema change;
- Card 04 work.

Only after PR #40 is independently reviewed and merged may the owner separately consider authorizing
the exact string `SYNC-13-CARD-ART-PRODUCTION`.

## Current task final gate

The post-merge repin task must end at exactly one of:

- **READY FOR INDEPENDENT REPIN PR REVIEW**
- **BLOCKED / REJECTED**

It ended at **READY FOR INDEPENDENT REPIN PR REVIEW**. PR #40 is open and unmerged. No production
workflow was dispatched and no production database or Railway endpoint was accessed; the only
database touched was the local test Postgres, read-only.

## Next task after PR #40 merges

Nothing further is required in the repository. The 13-card sync becomes technically runnable, but it
must not run until the owner separately and explicitly authorizes `SYNC-13-CARD-ART-PRODUCTION`,
which remains RESERVED, NOT AUTHORIZED, NOT CONSUMED.

Optional cleanup, once Card 03 is fully promoted: delete `transport/card03-v2-github-actions`
(carries a `contents: write` workflow, must never be merged) and the superseded
`assets/warden-of-the-barrier-candidate` branch (still holds the rejected v1 binary).

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — COMPLETE END TO END, live in production
- Card 03 `warden-of-the-barrier` — **FINAL OWNER APPROVED + repository integrated on main; repin PR #40 OPEN awaiting independent review; not yet synced to production**
- Card 04 `rune-of-curse-breaking` — not started
