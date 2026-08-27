# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** 11-card production sync **AUTHORIZED FOR ONE EXECUTION — NOT YET RUN**
- **Current target:** execute controlled production-art sync for Card 01 `acolyte-of-the-white-rune`
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `95a95521046b0fb2d8c825718b4e3c3b8b2782a4`
- **Latest transition report:** `docs/agent-reports/2026-08-27-art-pack-03-card-01-production-sync-authorized-transition.md`
- **Transition report commit:** `b973141ab7578ed7f993d2e693032e884d710a1b`
- **Branch:** `main`

## Card 01 repository integration — COMPLETE

PURIFICATION Card 01:

- slug: `acolyte-of-the-white-rune`
- name: «Послушник Белой Руны»
- CHARACTER / COMMON / cost 1 / 1/3
- visual status: **FINAL APPROVED**
- repository integration PR #35: MERGED
- immutable artwork+seed source: `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`

Production artwork:

- path: `apps/web/public/art/cards/acolyte-of-the-white-rune.webp`
- dimensions: `1024 × 1536`
- byte size: `214378`
- container: plain `VP8 `
- SHA-256: `cb76658416628f91b721c826a451342319bcfe39ff3b5f770a5f8ca73ba499fe`

All required visual surfaces and the full acceptance checklist passed. Durable record: `docs/art-pack-03.md`.

Owner-accepted caveats remain:

1. ~2–4 px head clearance under the current 4:5 crop; current shipped crops pass, but any tighter future crop must re-check this card.
2. Rendering is more photographic than the older painterly baseline; this exact image was explicitly accepted.

## 11-card controlled production-sync preparation — MERGED

PR #36 was independently reviewed and merged.

- reviewed PR head: `0ef199b5f389e6811a0dcd74711d67ea37bb2fb6`
- merge commit: `a3810c4bbc91c1a4c684e79b64433cfa7c1e51c4`
- changed files: exactly 3
- reviewed-head CI: PASS, run `33077874418`
- reviewed-head Vercel status: PASS

Merged sync configuration:

- immutable source pin: `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`
- target slugs: 11
- new target: `acolyte-of-the-white-rune`
- all target-count assertions: 11
- confirmation gate: `SYNC-11-CARD-ART-PRODUCTION`

Independent review confirmed no 11-card production workflow dispatch occurred during preparation. The latest completed production card-art dispatch before this authorization remains the successful ten-card run `32778836668` from 2026-08-24.

## Fresh owner authorization — RECEIVED

On 2026-08-27 the owner explicitly supplied the exact one-use confirmation:

`SYNC-11-CARD-ART-PRODUCTION`

This authorizes exactly one execution of the merged 11-card workflow and no unrelated production operation.

**The authorization is active for the current execution task and must be marked CONSUMED after this authorized run. Do not reuse it.**

## Current execution task

Execute `docs/CLAUDE_CURRENT_TASK.md` exactly.

Before dispatch verify fresh `main`, the merged preparation configuration, and the immutable source pin. Then dispatch `.github/workflows/production-card-art-sync.yml` on `main` with the exact authorized confirmation.

Expected PRE-WRITE state:

- `PRODUCTION_SCOPE_VERIFIED=YES`
- `TARGET_ROWS=11`
- `UNIQUE_SLUGS=11`
- `ROWS_REQUIRING_MUTATION=1`

The expected single stale target is `acolyte-of-the-white-rune`.

### Critical production stop rule

If PRE-WRITE reports `ROWS_REQUIRING_MUTATION > 1`, stop before APPLY and investigate production drift. Do not override safeguards, weaken the workflow, or manually mutate production.

If PRE-WRITE reports `0`, verify the already-synchronized path and do not force a write.

Expected successful final gates when one APPLY is needed:

- `TRANSACTION_STARTED=YES`
- `TRANSACTION_COMMITTED=YES`
- `TARGET_ROWS_FINAL=11`
- `SOURCE_OF_TRUTH_MATCH=11/11`
- `NON_TARGET_FIELD_CHANGES=0`
- independent POST-WRITE `TARGET_ROWS=11`
- independent POST-WRITE `UNIQUE_SLUGS=11`
- independent POST-WRITE `ROWS_REQUIRING_MUTATION=0`
- independent POST-WRITE `SOURCE_OF_TRUTH_MATCH=11/11`

## Tooling note

The ChatGPT GitHub connector available during the authorization turn can inspect Actions and mutate repository files/PRs, but it does not expose creation of a new `workflow_dispatch`. The execution is therefore delegated through the canonical task to Claude's environment, which has previously exposed the required GitHub Actions trigger. This is not a new authorization request; the exact owner authorization above is already recorded.

## After successful execution

- record workflow run ID and job ID
- record PRE-WRITE mutation count
- verify final `11/11`, zero non-target changes, and zero remaining mutations
- update `docs/art-pack-03.md` to production-sync COMPLETE
- create durable execution handoff/report
- mark `SYNC-11-CARD-ART-PRODUCTION` **CONSUMED**
- update this file last
- do not begin Card 02 inside the sync execution task

## Art Pack 03 remaining cards

- Card 01 `acolyte-of-the-white-rune` — FINAL APPROVED, repository integrated, production sync AUTHORIZED / awaiting execution
- Card 02 `seal-of-the-curse` — not started
- Card 03 `warden-of-the-barrier` — not started
- Card 04 `rune-of-curse-breaking` — not started

## Previous milestone

SHADOW Art Pack 02 remains complete end to end. Its prior ten-card production sync completed successfully. `SYNC-10-CARD-ART-PRODUCTION` is consumed and grants nothing for future runs.

## Reader protocol

1. Read this file.
2. Read `docs/CLAUDE_CURRENT_TASK.md`.
3. Read `docs/agent-reports/2026-08-27-art-pack-03-card-01-production-sync-authorized-transition.md`.
4. Read `docs/art-pack-03.md` for the durable Card 01 record.
5. Resolve fresh `main` before acting.
6. Repository state is authoritative over stale chat summaries.
