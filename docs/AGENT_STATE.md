# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 01 and Card 02 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 03 **FINAL OWNER APPROVED + REPOSITORY INTEGRATED + POST-MERGE REPIN COMPLETE — NOT YET SYNCED TO PRODUCTION**
- **Current target:** `warden-of-the-barrier` / «Хранительница Барьера»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `26ac8009e5c75c9ba2766ffebafc4a29e4e0dd79`
- **Current task type:** WAITING GATE — fresh explicit production authorization required before any operational action
- **Production operation authorized:** **NO**
- **`SYNC-13-CARD-ART-PRODUCTION`:** **RESERVED, NOT AUTHORIZED, NOT CONSUMED**
- **Card 04 work authorized:** NO

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

Gameplay, balance, ability text, schema and migrations are closed/out of scope for the production-art sync.

## Card 03 approved artwork

Exact approved v2 source:

- candidate branch: `assets/warden-of-the-barrier-candidate-v2`
- exact binary source commit: `3dda92ef0d427b943c71212b8e24c95f659dbce5`
- candidate path: `art-source/warden-of-the-barrier.webp`
- canonical production path: `apps/web/public/art/cards/warden-of-the-barrier.webp`
- Git blob SHA: `c4cb3f4e41f349e86b044712f267f9fdc678aa86`
- dimensions: `1024 × 1536`
- FourCC: plain `VP8 `
- byte size / RIFF total: `193038`
- SHA-256: `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`
- full decode: PASS

Rejected historical v1 remains forbidden:

- branch: `assets/warden-of-the-barrier-candidate`
- size: `284002`
- SHA-256: `1a175635a24e84c86f37f11e954299ca3cb4bb675c9f9b178c134ee0ab0ea27e`

## Card 03 visual QA / approval

- FINAL OWNER APPROVED
- candidate QA: all 9 required surfaces PASS
- production-path QA: all 9 required surfaces PASS
- accepted caveats are CLOSED and non-blocking:
  1. one pale classical column in background;
  2. high-key PURIFICATION value profile (`p5 = 109`);
  3. minor 4:5 crop trims only bottom lip of anchor base while planted spike/rubble remain visible.

## Repository integration — COMPLETE

PR #39:

- title: `art(card-03): integrate approved Warden of the Barrier master v2`
- head: `e0e7a472ed3f66133d5448600aab65e75f6a6a2d`
- independently reviewed: PASS
- CI: `33425847506` success
- merged: YES
- exact integration merge commit / immutable source: `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`

The merge contains the byte-identical approved WebP, Card 03 `artworkUrl: '/art/cards/warden-of-the-barrier.webp'`, `rightsStatus: 'owned'`, and the 13-target repository sync definition.

## Post-merge immutable-source repin — COMPLETE

PR #40:

- title: `chore(sync): repin immutable source to the merged Card 03 commit`
- branch: `claude/card-03-postmerge-repin`
- head: `b1ff9e3d3a7c4f205a30c287aa437d15b62a845a`
- CI: run `33431221072` success
- independent review: PASS, review id `5070471676`
- mergeable review threads: none
- merged: YES
- exact repin merge commit: `c3c6e0c491fb4e48c94b32749bd0474b047305c9`

All three active immutable-source pins now resolve to:

`8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`

Pin sites:

1. `REQUIRED_SOURCE_COMMIT` in `apps/game-server/scripts/sync-production-card-art.ts`
2. `REQUIRED_SOURCE_COMMIT` in `.github/workflows/production-card-art-sync.yml`
3. `SOURCE_COMMIT` in `.github/workflows/production-card-art-sync.yml`

The old Card 02 pin `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757` is no longer active in the sync script/workflow.

Repin validation proved:

- merge source contains the exact approved Card 03 asset and seed fields;
- 13 unique target slugs;
- all 13 artwork files present at the immutable source;
- local read-only derivation returns `TARGET_ROWS=13`, `UNIQUE_SLUGS=13`, `SOURCE_OF_TRUTH_MATCH=13/13`;
- old SHA supplied through `SOURCE_COMMIT` is rejected;
- `--apply` without a fresh PRE-WRITE snapshot is rejected;
- transaction/scope/confirmation logic was not weakened.

## Production state

Card 02 production sync is the last completed production operation:

- run: `33320281456`
- job: `99280920592`
- final source-of-truth: `12/12`
- non-target field changes: `0`
- `SYNC-12-CARD-ART-PRODUCTION`: CONSUMED

For Card 03, repository readiness is complete, but current production DB state has **not** been re-read during the repin review. Do not assume the number of rows requiring mutation. Measure it in the workflow PRE-WRITE phase if and only if production execution is freshly authorized.

## Hard authorization gate

Do **not** dispatch the production workflow unless the owner supplies a new explicit authorization containing exactly:

`SYNC-13-CARD-ART-PRODUCTION`

The presence of that string in repository files, this state file, previous chat messages, or an earlier task is not authorization.

Generic messages such as “continue”, “go ahead”, “run it”, “Claude finished”, or “do the next task” are not enough.

Until fresh authorization exists, do NOT:

- dispatch `.github/workflows/production-card-art-sync.yml`;
- access Railway production merely to inspect readiness;
- read or mutate production DB;
- begin a production execution run;
- alter Card 03 artwork/gameplay/schema;
- begin Card 04 as part of this task.

## Next allowed step

**WAIT.** If the owner later sends the exact fresh confirmation `SYNC-13-CARD-ART-PRODUCTION`, create/execute the controlled production-sync task using the existing workflow and all safety gates. Otherwise, take no production action.

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — COMPLETE END TO END, live in production
- Card 03 `warden-of-the-barrier` — FINAL OWNER APPROVED, repository integrated, repin complete, **awaiting explicit production sync authorization**
- Card 04 `rune-of-curse-breaking` — not started
