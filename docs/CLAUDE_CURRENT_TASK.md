# CURRENT TASK — 11-card production art sync: WAIT FOR OWNER AUTHORIZATION

## State

The 10 → 11 controlled production-art sync preparation is complete and merged.

- preparation PR: #36
- reviewed head: `0ef199b5f389e6811a0dcd74711d67ea37bb2fb6`
- preparation merge commit: `a3810c4bbc91c1a4c684e79b64433cfa7c1e51c4`
- immutable artwork/seed source pin used by the sync: `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`
- target count: 11
- new target: `acolyte-of-the-white-rune`
- dormant confirmation gate: `SYNC-11-CARD-ART-PRODUCTION`

Transition record:

`docs/agent-reports/2026-08-27-art-pack-03-card-01-sync-preparation-merged-transition.md`

## Goal

**Do nothing operational until the owner gives fresh explicit authorization for the actual 11-card production sync.**

This file is intentionally a hard waiting gate. The presence of `SYNC-11-CARD-ART-PRODUCTION` in the workflow is not authorization by itself.

## Forbidden until explicit owner authorization

Do not:

- dispatch `.github/workflows/production-card-art-sync.yml`
- connect to Railway production
- run the production-scope command
- use a production `DATABASE_URL`
- run a production `--check`
- run `--apply`
- query the production database, including read-only queries
- mutate the production database
- create another authorization or dispatch on the owner's behalf

Do not begin PURIFICATION Card 02 inside this waiting task unless a separate new task explicitly moves the project there.

## When authorization is eventually supplied

Fresh owner authorization must be a separate explicit decision after this merged preparation. The required one-use confirmation value is:

`SYNC-11-CARD-ART-PRODUCTION`

Only after that explicit authorization should the repository be transitioned to an execution task. The execution must retain the existing controlled workflow gates and independently inspect the PRE-WRITE report. Expected normal state is one row requiring mutation, but that is an expectation, not permission to continue blindly: if `ROWS_REQUIRING_MUTATION` is greater than 1, stop and investigate production drift before any APPLY.

Successful completion criteria for the later authorized run remain:

- `TARGET_ROWS=11`
- `UNIQUE_SLUGS=11`
- expected `ROWS_REQUIRING_MUTATION=1` before APPLY if only Card 01 is stale
- `TRANSACTION_COMMITTED=YES` if APPLY is needed
- `TARGET_ROWS_FINAL=11`
- `SOURCE_OF_TRUTH_MATCH=11/11`
- `NON_TARGET_FIELD_CHANGES=0`
- independent POST-WRITE `ROWS_REQUIRING_MUTATION=0`

## Stop condition

Stop immediately with status:

**AWAITING EXPLICIT OWNER AUTHORIZATION — PRODUCTION SYNC NOT RUN.**

Do not make repository changes merely to restate this waiting status.