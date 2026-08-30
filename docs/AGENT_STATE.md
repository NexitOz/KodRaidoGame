# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **COMPLETE END TO END — LIVE IN PRODUCTION.** Next: Card 03 `warden-of-the-barrier` **planning only**
- **Current target:** Card 03 `warden-of-the-barrier` (CHARACTER / RARE / cost 3)
- **Latest handoff:** `docs/agent-reports/2026-08-30-art-pack-03-card-02-production-sync-executed.md`
- **Latest task-result commit:** `eb603ff`
- **Branch for current coordination:** `main`
- **Open blocker:** NONE
- **Production sync dispatched:** **YES — run `33320281456`, conclusion success**
- **Production DB mutated:** **YES — exactly 1 row (`seal-of-the-curse`)**
- **`SYNC-12-CARD-ART-PRODUCTION`:** **CONSUMED**

## Card 02 — PRODUCTION SYNC COMPLETE (2026-08-30)

Full evidence: `docs/agent-reports/2026-08-30-art-pack-03-card-02-production-sync-executed.md`

| Item                 | Value                                                                 |
| -------------------- | --------------------------------------------------------------------- |
| Workflow run         | **33320281456** (run 8), job **99280920592** — conclusion **success** |
| Executed             | 2026-08-30 15:39:56 → 15:40:41 UTC                                    |
| Immutable source pin | `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757` (PR #37 merge)             |
| Dispatch ref         | `main` @ `2cd0a64ab8ba746a766ecd26b2f92bcc99e6d29f`                   |
| Target slugs         | 12                                                                    |
| Rows changed         | **1** — `seal-of-the-curse` (`84dd1893-4cf1-45d4-8d36-bbff3abb5781`)  |

The changed row moved from an inline SVG placeholder with `rightsStatus: placeholder` to
`/art/cards/seal-of-the-curse.webp` with `rightsStatus: owned`. The other eleven targets reported
`needsChange=NO` in both the PRE-WRITE and POST-WRITE passes and were untouched.

Gates read from the actual job logs, not the run conclusion:

- **Pre-dispatch (verified independently by Claude Code before dispatching)** — all three source
  pins equal `8d41b657…`; no post-source commit touched `seed.ts`, `schema.prisma` or
  `apps/web/public/art/cards`; 12 unique slugs; source-of-truth 12/12; artwork files 12/12.
- **Source / assets** — `IMMUTABLE_SOURCE_SHA_VERIFIED=8d41b657…`, `CURRENT_MAIN_SHA=2cd0a64…`,
  `ARTWORK_FILES_PRESENT=12/12`
- **Scope** — `RAILWAY_TOKEN_PRESENT=YES`, `TOKEN_PROJECT_ID_VERIFIED=YES`,
  `TOKEN_ENVIRONMENT_ID_VERIFIED=YES`, `PROJECT_NAME=gleaming-eagerness`,
  `ENVIRONMENT_NAME=production`, `GAME_SERVER_DB_LINK_VERIFIED=YES`,
  `DATABASE_ROUTE=RAILWAY_PRIVATE`, `PRODUCTION_SCOPE_VERIFIED=YES`, `READ_ONLY_DB_PREFLIGHT=YES`
- **PRE-WRITE** — `TARGET_ROWS=12`, `UNIQUE_SLUGS=12`, `ROWS_REQUIRING_MUTATION=1`,
  `SOURCE_OF_TRUTH_MATCH=11/12`, 64-char snapshot `9304451d…`, `NON_TARGET_FINGERPRINTS=12`
- **APPLY** — `TRANSACTION_STARTED=YES`, `TRANSACTION_COMMITTED=YES`, `ROWS_CHANGED=1`,
  `TARGET_ROWS_FINAL=12`, `SOURCE_OF_TRUTH_MATCH=12/12`, **`NON_TARGET_FIELD_CHANGES=0`**
- **Independent POST-WRITE re-read** — `TARGET_ROWS=12`, `UNIQUE_SLUGS=12`,
  `ROWS_REQUIRING_MUTATION=0`, `SOURCE_OF_TRUTH_MATCH=12/12`

`SYNC-12-CARD-ART-PRODUCTION` authorized exactly that one run and is **consumed**. It is not standing
authorization. A thirteenth card needs a fresh owner confirmation string and an immutable-source pin
repointed to a new already-merged integration commit.

## Card 02 — complete end to end

`seal-of-the-curse` / «Печать Проклятия» — briefed → generated → byte-verified → surface-reviewed →
owner-approved → integrated (PR #37) → merged (`8d41b657`) → synced to production (run
`33320281456`).

Approved master integrity, for the permanent record:

- size `326508`, SHA-256 `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- Git blob SHA `95940017577f7152a28bf76122912c37e548c7e0`
- `1024 × 1536`, RIFF total `326508`, FourCC plain `VP8 `, full decode PASS

Two owner-accepted, non-blocking caveats stand: the background describes an interior arcade rather
than the brief's near-abstract space, and the enemy pommel carries an unlit star relief.

## Next — Card 03 `warden-of-the-barrier`, PLANNING ONLY

No Card 03 art was generated, promoted or reviewed in the sync task.

- slug: `warden-of-the-barrier`
- type / rarity / cost: CHARACTER / RARE / 3
- faction: PURIFICATION
- first step: a master-art brief at `docs/art-review/warden-of-the-barrier-master-art-brief.md`,
  written against the repository's real card data and the locked PURIFICATION language, then owner
  review **before** any generation

Two lessons to carry into that brief:

1. **Keep the stricter crop rule.** Card 01 cleared the binding 4:5 cut by 2–4 px; Card 02's
   y≈260–1280 working rule produced ~134 px of real clearance.
2. **Be explicit about environment detail.** Card 02's only real divergence from its brief was a
   background that described an interior arcade where §7 asked for near-abstract. Decide the
   intended level of environment description up front rather than discovering it at QA.

## Production hard gate

**No production operation is currently authorized.** `SYNC-12-CARD-ART-PRODUCTION` is consumed. Do
not dispatch any production workflow, mutate the production DB, or reuse a spent confirmation
string.

## Card 01

`acolyte-of-the-white-rune` / «Послушник Белой Руны» is FINAL APPROVED and live in production.

- production sync run: `33091769787`
- final source of truth: `11/11`
- `SYNC-11-CARD-ART-PRODUCTION`: CONSUMED

## Card 02 final repository result

`seal-of-the-curse` / «Печать Проклятия» is FINAL OWNER APPROVED and fully integrated into the repository.

Approved master integrity:

- candidate branch: `assets/seal-of-the-curse-candidate-v2`
- candidate commit: `67405697628a3dec3fa8e9dab2cdb27c273b6af1`
- Git blob SHA: `95940017577f7152a28bf76122912c37e548c7e0`
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- size: `326508`
- RIFF total: `326508`
- dimensions: `1024x1536`
- FourCC: plain `VP8 `
- full decode: PASS

Repository integration includes production art, `artworkUrl: '/art/cards/seal-of-the-curse.webp'`, `rightsStatus: 'owned'`, correct EVENT/non-CHARACTER review behavior, FINAL APPROVED docs, and production sync extended 11 → 12.

Production-path QA passed on all required surfaces with no new regression. The two owner-accepted caveats remain non-blocking.

## Historical — Card 02 immutable source and pre-dispatch verification

Retained as the permanent record of what the executed sync was pinned to. All three operational pins
equalled `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757` (the PR #37 merge), and no post-source change
touched `apps/game-server/prisma/seed.ts`, `apps/game-server/prisma/schema.prisma`, or
`apps/web/public/art/cards`. Re-verified independently by Claude Code immediately before dispatch,
against `main` @ `2cd0a64ab8ba746a766ecd26b2f92bcc99e6d29f`.

## Owner production authorization — CONSUMED

`SYNC-12-CARD-ART-PRODUCTION` was supplied by the owner on 2026-08-30 and authorized **exactly one**
dispatch. **That dispatch has been executed** — run `33320281456`, conclusion success.

**The string is now spent.** It is not standing authorization and must not be reused. A further
production sync requires a fresh owner confirmation string and an immutable-source pin repointed to
a new already-merged integration commit.

## Art Pack 03 remaining cards

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — COMPLETE END TO END, live in production (run `33320281456`)
- Card 03 `warden-of-the-barrier` — **next: master-art brief, planning only**
- Card 04 `rune-of-curse-breaking` — not started
