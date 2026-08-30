# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **PRODUCTION SYNC AUTHORIZED FOR ONE DISPATCH — EXECUTION PENDING**
- **Current target:** `seal-of-the-curse` / «Печать Проклятия»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Integration PR:** #37 — MERGED
- **Integration PR head:** `6b668d8ba73ede0899f4cba3e5362fd74f10f2b1`
- **Merge commit / immutable 12-card source:** `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`
- **Workflow pin commit:** `3bff9b6bb49ede3dff5e96d889c55eb39af1239a`
- **Sync-script pin commit:** `9fb36bb2ad104e099f4e8a75fd9fbd799f0fe626`
- **Authorization task commit:** `4eb4985d1228d3657df7b184422339666b3740cb`
- **Production sync target count:** `12`
- **Owner confirmation supplied:** `SYNC-12-CARD-ART-PRODUCTION`
- **Authorization scope:** exactly one controlled workflow dispatch
- **Production sync dispatched from ChatGPT bridge:** NO
- **Production DB mutated by authorization-record step:** NO

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

## Immutable source and pre-dispatch verification

All three operational pins equal:

`8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`

Verified immediately before recording this authorization:

- current `main` was `8664dd429beb4f8d3ad75d4fe19420d7912d8689`
- workflow `REQUIRED_SOURCE_COMMIT` = immutable source
- workflow `SOURCE_COMMIT` = immutable source
- sync-script `REQUIRED_SOURCE_COMMIT` = immutable source
- compare from immutable source to pre-authorization `main` changed only workflow, sync script, and coordination docs
- no post-source change touched `apps/game-server/prisma/seed.ts`, `apps/game-server/prisma/schema.prisma`, or `apps/web/public/art/cards`

## Owner production authorization — ACTIVE FOR ONE DISPATCH

The owner explicitly supplied the exact confirmation string on 2026-08-30:

`SYNC-12-CARD-ART-PRODUCTION`

Do not ask the owner to repeat it.

Authorization is limited to one dispatch of `.github/workflows/production-card-art-sync.yml` on `main` with that exact input. If any safety gate fails, stop. Do not automatically retry and do not use another production mutation route.

## Required next action

Read `docs/CLAUDE_CURRENT_TASK.md`, re-verify current `main` and immutable paths, then execute the authorized workflow and inspect it to completion.

Required final signals:

- exact confirmation accepted
- immutable source verified
- artwork files `12/12`
- Railway token present
- production scope + read-only preflight PASS
- PRE-WRITE `TARGET_ROWS=12`, `UNIQUE_SLUGS=12`
- valid snapshot and mutation count
- APPLY transaction committed if needed
- `TARGET_ROWS_FINAL=12`
- `SOURCE_OF_TRUTH_MATCH=12/12`
- `NON_TARGET_FIELD_CHANGES=0`
- POST-WRITE `ROWS_REQUIRING_MUTATION=0`
- POST-WRITE `SOURCE_OF_TRUTH_MATCH=12/12`

After a successful run, record run/job IDs and exact mutation count, then transition the project to Card 03 `warden-of-the-barrier` planning. Update this file last and verify it back from GitHub.

## Art Pack 03 remaining cards

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — MERGED and FINAL APPROVED; production sync authorized, execution pending
- Card 03 `warden-of-the-barrier` — next after successful Card 02 production sync
- Card 04 `rune-of-curse-breaking` — not started
