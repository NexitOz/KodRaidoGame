# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Cards 01, 02 and 03 **COMPLETE END TO END — LIVE IN PRODUCTION**
- **Current target:** none active; Card 03 is closed
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `005a6cb59ac114210f5aeab1c13716bd4dbca442`
- **Current task type:** waiting gate / documentation housekeeping remains; Card 04 not authorized
- **Production operation authorized:** **NO**
- **`SYNC-13-CARD-ART-PRODUCTION`:** **CONSUMED — MUST NOT BE REUSED**
- **Card 04 work authorized:** **NO**

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 02 `seal-of-the-curse` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 03 `warden-of-the-barrier` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 04 `rune-of-curse-breaking` — **NOT STARTED / NOT AUTHORIZED**

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

## Card 03 approved artwork

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
- owner approval: FINAL APPROVED
- candidate QA: all 9 required surfaces PASS
- production-path QA: all 9 required surfaces PASS

Rejected historical v1 remains forbidden:

- branch: `assets/warden-of-the-barrier-candidate`
- size: `284002`
- SHA-256: `1a175635a24e84c86f37f11e954299ca3cb4bb675c9f9b178c134ee0ab0ea27e`

## Repository integration — COMPLETE

PR #39 `art(card-03): integrate approved Warden of the Barrier master v2`:

- integration head: `e0e7a472ed3f66133d5448600aab65e75f6a6a2d`
- independent review: PASS
- CI: `33425847506` success
- merged: YES
- exact integration merge commit / immutable source: `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`

## Post-merge immutable-source repin — COMPLETE

PR #40 `chore(sync): repin immutable source to the merged Card 03 commit`:

- head: `b1ff9e3d3a7c4f205a30c287aa437d15b62a845a`
- CI: `33431221072` success
- independent review: PASS, review id `5070471676`
- merged: YES
- repin merge commit: `c3c6e0c491fb4e48c94b32749bd0474b047305c9`

All three active immutable-source pins resolve to:

`8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`

## Production sync 12 → 13 — COMPLETE

The owner supplied one explicit authorization `SYNC-13-CARD-ART-PRODUCTION`. It was single-use and is now consumed.

Verified actual GitHub Actions execution:

- workflow: `One-time production card artwork sync`
- run: `33436786024` (run #9)
- job: `99635055417`
- event: `workflow_dispatch`
- conclusion: **success**
- dispatched on `main` @ `80a751be8737a12e23f235989b2ca435bc30b420`
- immutable source: `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`
- `ARTWORK_FILES_PRESENT=13/13`
- `TOKEN_PROJECT_ID_VERIFIED=YES`
- `TOKEN_ENVIRONMENT_ID_VERIFIED=YES`
- `GAME_SERVER_DB_LINK_VERIFIED=YES`
- `PRODUCTION_SCOPE_VERIFIED=YES`
- `READ_ONLY_DB_PREFLIGHT=YES`

PRE-WRITE:

- `TARGET_ROWS=13`
- `UNIQUE_SLUGS=13`
- `ROWS_REQUIRING_MUTATION=1`
- `SOURCE_OF_TRUTH_MATCH=12/13`
- changed candidate: only `warden-of-the-barrier`
- before: inline SVG placeholder + `rightsStatus=placeholder`
- desired: `/art/cards/warden-of-the-barrier.webp` + `rightsStatus=owned`

APPLY:

- `TRANSACTION_STARTED=YES`
- `TRANSACTION_COMMITTED=YES`
- `ROWS_CHANGED=1`
- `TARGET_ROWS_FINAL=13`
- `SOURCE_OF_TRUTH_MATCH=13/13`
- `NON_TARGET_FIELD_CHANGES=0`

Independent POST-WRITE:

- `TARGET_ROWS=13`
- `UNIQUE_SLUGS=13`
- `ROWS_REQUIRING_MUTATION=0`
- `SOURCE_OF_TRUTH_MATCH=13/13`

Durable execution report:

`docs/agent-reports/2026-08-31-art-pack-03-card-03-production-sync.md`

**Card 03 is COMPLETE END TO END — LIVE IN PRODUCTION.**

## Authorization state

`SYNC-13-CARD-ART-PRODUCTION` is **CONSUMED**. Do not dispatch again using this authorization, even for a no-op retry. Any future production operation requires a fresh explicit owner authorization.

## Open housekeeping

`docs/art-pack-03.md` still contains stale pre-production wording for Card 03 and should be corrected in a dedicated documentation housekeeping pass before Card 04 begins.

Optional branch cleanup remains unperformed and requires explicit owner approval:

- `transport/card03-v2-github-actions` is transport-only, carries a `contents: write` workflow, and must never be merged;
- `assets/warden-of-the-barrier-candidate` contains rejected v1 and is superseded.

## Final gate

**AWAITING OWNER DIRECTION — CARD 03 CLOSED / CARD 04 NOT AUTHORIZED**
