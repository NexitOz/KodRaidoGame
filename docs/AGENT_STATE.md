# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Cards 01, 02 and 03 **ALL COMPLETE END TO END — LIVE IN PRODUCTION**
- **Current target:** `warden-of-the-barrier` / «Хранительница Барьера»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `c9abf5307ace3960eb90b4988948d3c97e87b6cb`
- **Current task type:** controlled 13-card production artwork sync execution
- **Fresh owner authorization received:** YES, 2026-08-31 — **USED**
- **Authorized exact string:** `SYNC-13-CARD-ART-PRODUCTION`
- **Authorization scope:** exactly one new manual dispatch of `.github/workflows/production-card-art-sync.yml` on `main`
- **Authorization consumption rule:** CONSUMED immediately when GitHub accepts the dispatch, even if the run later fails or is cancelled; any retry requires a fresh exact owner authorization
- **Production sync run:** `33436786024` (run #9) — job `99635055417` — conclusion **success**
- **Dispatched on:** `main` @ `80a751be8737a12e23f235989b2ca435bc30b420`
- **Rows changed:** exactly **1**, only `warden-of-the-barrier` — non-target field changes: **0**
- **Final source of truth:** **13/13**
- **Execution report:** `docs/agent-reports/2026-08-31-art-pack-03-card-03-production-sync.md`
- **Production operation authorized:** NO — the single authorized dispatch has been used
- **`SYNC-13-CARD-ART-PRODUCTION`:** **CONSUMED** — must never be reused; a further sync needs a fresh explicit owner authorization
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

- old branch: `assets/warden-of-the-barrier-candidate`
- old size: `284002`
- old SHA-256: `1a175635a24e84c86f37f11e954299ca3cb4bb675c9f9b178c134ee0ab0ea27e`

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
- independently reviewed: PASS
- CI: `33425847506` success
- merged: YES
- exact integration merge commit / immutable source: `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`

The merge contains the byte-identical approved WebP, Card 03 `artworkUrl: '/art/cards/warden-of-the-barrier.webp'`, `rightsStatus: 'owned'`, and the 13-target repository sync definition.

## Post-merge immutable-source repin — COMPLETE

PR #40:

- title: `chore(sync): repin immutable source to the merged Card 03 commit`
- head: `b1ff9e3d3a7c4f205a30c287aa437d15b62a845a`
- CI: `33431221072` success
- independent review: PASS, review id `5070471676`
- merged: YES
- exact repin merge commit: `c3c6e0c491fb4e48c94b32749bd0474b047305c9`

All three active immutable-source pins resolve to:

`8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`

Pin sites:

1. `REQUIRED_SOURCE_COMMIT` in `apps/game-server/scripts/sync-production-card-art.ts`
2. `REQUIRED_SOURCE_COMMIT` in `.github/workflows/production-card-art-sync.yml`
3. `SOURCE_COMMIT` in `.github/workflows/production-card-art-sync.yml`

Repin validation proved 13 unique targets, all 13 art files present, local read-only `SOURCE_OF_TRUTH_MATCH=13/13`, old-SHA rejection, snapshot-gated apply protection, and unchanged transaction/scope controls.

## Production state before authorized run

The last completed production operation is Card 02:

- run: `33320281456`
- job: `99280920592`
- final source-of-truth: `12/12`
- non-target field changes: `0`
- `SYNC-12-CARD-ART-PRODUCTION`: CONSUMED

## Production sync 12 → 13 — COMPLETED

Card 03 is live in production. The controlled sync was extended 12 → 13 and executed successfully.

- run: `33436786024` (run #9)
- job: `99635055417`
- conclusion: success
- dispatched on: `main` @ `80a751be8737a12e23f235989b2ca435bc30b420`
- immutable source verified: `IMMUTABLE_SOURCE_SHA_VERIFIED=8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`
- `ARTWORK_FILES_PRESENT=13/13`
- `PRODUCTION_SCOPE_VERIFIED=YES`, `READ_ONLY_DB_PREFLIGHT=YES`
- PRE-WRITE: `TARGET_ROWS=13`, `UNIQUE_SLUGS=13`, `ROWS_REQUIRING_MUTATION=1`, `SOURCE_OF_TRUTH_MATCH=12/13`
- APPLY: `TRANSACTION_COMMITTED=YES`, `ROWS_CHANGED=1`, `TARGET_ROWS_FINAL=13`, `SOURCE_OF_TRUTH_MATCH=13/13`, `NON_TARGET_FIELD_CHANGES=0`
- POST-WRITE (independent re-read): `ROWS_REQUIRING_MUTATION=0`, `SOURCE_OF_TRUTH_MATCH=13/13`
- `SYNC-13-CARD-ART-PRODUCTION`: **CONSUMED**

The single changed row moved from an inline SVG placeholder with `rightsStatus: placeholder` to
`/art/cards/warden-of-the-barrier.webp` with `rightsStatus: owned`. The other twelve targets
reported `needsChange=NO` and were not written.

**Card 03 is complete end to end:** briefed → generated → byte-verified → surface-reviewed →
owner-approved → integrated → merged → repinned → synced to production.

## Authorized production execution rules — CONSUMED, HISTORICAL

The owner's single authorization was used on run `33436786024`. `SYNC-13-CARD-ART-PRODUCTION` is
**CONSUMED and must never be reused.** The rules below are retained as the standing contract for any
_future_ sync, which requires a fresh explicit owner authorization:

- verify fresh `main` and immutable pins before dispatch;
- dispatch `.github/workflows/production-card-art-sync.yml` exactly once on `main` with `confirmation=SYNC-13-CARD-ART-PRODUCTION`;
- mark authorization CONSUMED immediately after dispatch is accepted;
- identify the exact new workflow run/job IDs;
- require Railway production scope + DB linkage verification and read-only connectivity preflight;
- require PRE-WRITE `TARGET_ROWS=13`, `UNIQUE_SLUGS=13` and measure `ROWS_REQUIRING_MUTATION` plus snapshot;
- if mutations are required, use only the existing snapshot-gated Atomic APPLY;
- require `TARGET_ROWS_FINAL=13`, `SOURCE_OF_TRUTH_MATCH=13/13`, `NON_TARGET_FIELD_CHANGES=0` after APPLY;
- require independent POST-WRITE `TARGET_ROWS=13`, `UNIQUE_SLUGS=13`, `ROWS_REQUIRING_MUTATION=0`, `SOURCE_OF_TRUTH_MATCH=13/13`;
- never rerun under this same authorization if any gate fails;
- any retry requires a fresh exact owner authorization.

## Hard exclusions

Do NOT:

- dispatch more than once;
- reuse the authorization for retry;
- weaken workflow gates or edit around a failed production check;
- manually invoke production `--apply` outside the workflow;
- change non-art fields, schema, migrations or gameplay;
- seed/migrate production;
- alter Card 03 artwork;
- begin Card 04 in this task.

## Durable handoff — WRITTEN

`docs/agent-reports/2026-08-31-art-pack-03-card-03-production-sync.md`

## Final gate — reached

The task ended at **COMPLETE END TO END — LIVE IN PRODUCTION**.

## Next

Art Pack 03 Card 04 `rune-of-curse-breaking` is the next unstarted item and is **NOT authorized**.

Optional cleanup, not done in this task: delete `transport/card03-v2-github-actions` (carries a
`contents: write` workflow, must never be merged) and the superseded
`assets/warden-of-the-barrier-candidate` branch (still holds the rejected v1 binary).
