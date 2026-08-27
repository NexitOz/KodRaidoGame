# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** 11-card production sync **PREPARED + MERGED — NOT AUTHORIZED, NOT RUN**
- **Current target:** explicit owner authorization gate for the controlled 11-card production-art sync
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `088da3d3f6e2c36cee808f3acc60313bb3051c1c`
- **Latest transition report:** `docs/agent-reports/2026-08-27-art-pack-03-card-01-sync-preparation-merged-transition.md`
- **Transition report commit:** `484f3ae9e16ed26f4a6442c9c9e11b5783e50291`
- **Branch:** `main`
- **Open preparation PR:** none; PR #36 is merged

## Card 01 — COMPLETE THROUGH REPOSITORY INTEGRATION

PURIFICATION Card 01:

- slug: `acolyte-of-the-white-rune`
- name: «Послушник Белой Руны»
- CHARACTER / COMMON / cost 1 / 1/3
- status: **FINAL APPROVED**
- integration PR #35: MERGED
- integration merge commit / immutable artwork+seed source: `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`

Production artwork:

- path: `apps/web/public/art/cards/acolyte-of-the-white-rune.webp`
- dimensions: `1024 × 1536`
- byte size: `214378`
- container: plain `VP8 `
- SHA-256: `cb76658416628f91b721c826a451342319bcfe39ff3b5f770a5f8ca73ba499fe`

All required visual surfaces and the full acceptance checklist passed. Durable record: `docs/art-pack-03.md`.

Owner-accepted caveats:

1. ~2–4 px head clearance under the current 4:5 crop; current shipped crops pass, but any tighter future crop must re-check this card.
2. Rendering is more photographic than the older painterly baseline; this exact image was explicitly accepted.

## 11-card controlled production-sync preparation — MERGED

PR #36, `Prepare controlled production card-art sync 10 → 11 (Art Pack 03 Card 01)`, was independently reviewed and merged.

- reviewed PR head: `0ef199b5f389e6811a0dcd74711d67ea37bb2fb6`
- squash merge commit: `a3810c4bbc91c1a4c684e79b64433cfa7c1e51c4`
- changed files: exactly 3
- reviewed-head CI: PASS, run `33077874418`
- reviewed-head Vercel status: PASS

Merged sync configuration:

- immutable source pin: `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`
- target slugs: 11
- new target: `acolyte-of-the-white-rune`
- confirmation gate: `SYNC-11-CARD-ART-PRODUCTION`
- all workflow target counts/assertions: 11
- script/workflow slug sets and order: matched during offline review

The source pin intentionally remains the Card 01 integration merge commit. Later docs/config-only commits are allowed by the workflow's guarded-path immutability check; drift in `seed.ts`, Prisma schema, or committed card artwork after that source pin would block the workflow.

## Production authorization boundary — HARD STOP

The 11-card configuration is merged, but **no 11-card production sync has been authorized or run**.

The string `SYNC-11-CARD-ART-PRODUCTION` existing in the workflow is a dormant gate value only. It is not standing authorization.

Independent review confirmed no new production card-art workflow dispatch occurred during Claude's preparation. The latest production card-art dispatch remains the previously authorized ten-card run:

- run: `32778836668`
- date: 2026-08-24
- result: success

Until the owner separately gives fresh explicit authorization, agents must NOT:

- dispatch `production-card-art-sync.yml`
- connect to Railway production
- execute the production-scope command
- use a production `DATABASE_URL`
- run production `--check`
- run `--apply`
- query the production database, including read-only queries
- mutate the production database

Current task is therefore a waiting gate, not an execution task.

## Expected later authorized run

Only after explicit owner authorization should the repository transition to execution. Normal expected PRE-WRITE state is `ROWS_REQUIRING_MUTATION=1`, because only `acolyte-of-the-white-rune` should be stale in production.

If the PRE-WRITE mutation count is greater than 1, stop and investigate drift before APPLY.

Later successful-run gates:

- `TARGET_ROWS=11`
- `UNIQUE_SLUGS=11`
- `TRANSACTION_COMMITTED=YES` if an APPLY occurs
- `TARGET_ROWS_FINAL=11`
- `SOURCE_OF_TRUTH_MATCH=11/11`
- `NON_TARGET_FIELD_CHANGES=0`
- independent POST-WRITE `ROWS_REQUIRING_MUTATION=0`

## Art Pack 03 remaining cards

- Card 01 `acolyte-of-the-white-rune` — FINAL APPROVED, integrated, 11-card sync prepared
- Card 02 `seal-of-the-curse` — not started
- Card 03 `warden-of-the-barrier` — not started
- Card 04 `rune-of-curse-breaking` — not started

Do not begin Card 02 as part of the authorization-wait task. A separate new task should move the project there when appropriate.

## Previous milestone

SHADOW Art Pack 02 remains complete end to end. Its prior ten-card production sync was executed successfully. `SYNC-10-CARD-ART-PRODUCTION` is consumed and grants no future authorization.

## Recommended next action

Await a separate owner decision:

- either explicitly authorize the 11-card production sync with the fresh one-use confirmation, then create an execution task;
- or leave production untouched and create a separate task to begin PURIFICATION Card 02.

Do not infer either choice from this state file.

## Reader protocol

1. Read this file.
2. Read `docs/CLAUDE_CURRENT_TASK.md`.
3. Read `docs/agent-reports/2026-08-27-art-pack-03-card-01-sync-preparation-merged-transition.md`.
4. Read `docs/art-pack-03.md` for the durable Card 01 record.
5. Resolve fresh `main` before acting.
6. Repository state is authoritative over stale chat summaries.