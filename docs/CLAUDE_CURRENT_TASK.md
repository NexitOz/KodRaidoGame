# CURRENT TASK — Art Pack 03 Card 01: execute controlled 11-card production-art sync

## Goal

Execute the already-prepared and merged controlled production card-art sync for eleven cards, adding the approved PURIFICATION Card 01 (`acolyte-of-the-white-rune`) to production.

## Fresh owner authorization

The owner supplied the exact one-use confirmation on 2026-08-27:

`SYNC-11-CARD-ART-PRODUCTION`

This authorizes exactly one execution of `.github/workflows/production-card-art-sync.yml` using the merged 11-card configuration. It does not authorize any unrelated production operation and must be treated as consumed after this authorized run.

## Required source/config

Use fresh `main` and verify before dispatch:

- merged preparation PR #36
- preparation merge commit: `a3810c4bbc91c1a4c684e79b64433cfa7c1e51c4`
- immutable source pin in both script/workflow: `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`
- target slugs: 11
- confirmation gate: `SYNC-11-CARD-ART-PRODUCTION`

Do not edit the sync script/workflow before execution unless fresh verification reveals a genuine blocker. If any guarded source path drifted since the immutable source pin, stop and report rather than weakening the guard.

## Execution

Dispatch `.github/workflows/production-card-art-sync.yml` on `main` with the exact confirmation:

`SYNC-11-CARD-ART-PRODUCTION`

Then inspect the actual run and logs.

### PRE-WRITE gate

Expected normal state:

- `PRODUCTION_SCOPE_VERIFIED=YES`
- `TARGET_ROWS=11`
- `UNIQUE_SLUGS=11`
- `ROWS_REQUIRING_MUTATION=1`

The expected single mutation is `acolyte-of-the-white-rune`.

**Critical stop rule:** if `ROWS_REQUIRING_MUTATION` is greater than 1, stop before APPLY and report production drift. Do not override safeguards or manually mutate the database.

If the workflow itself already enforces a stronger safe stop, preserve it.

### APPLY / POST-WRITE expected gates

On the normal one-row path, verify from logs:

- `TRANSACTION_STARTED=YES`
- `TRANSACTION_COMMITTED=YES`
- `TARGET_ROWS_FINAL=11`
- `SOURCE_OF_TRUTH_MATCH=11/11`
- `NON_TARGET_FIELD_CHANGES=0`
- independent POST-WRITE `TARGET_ROWS=11`
- independent POST-WRITE `UNIQUE_SLUGS=11`
- independent POST-WRITE `ROWS_REQUIRING_MUTATION=0`
- independent POST-WRITE `SOURCE_OF_TRUTH_MATCH=11/11`

If PRE-WRITE reports `ROWS_REQUIRING_MUTATION=0`, verify the already-synchronized path and independent readback; do not force a write.

## Hard prohibitions

- no manual SQL
- no ad-hoc production DB mutation
- no bypassing the immutable-source guard
- no weakening snapshot/non-target integrity gates
- no changes to card gameplay/balance/text/stats/rarity/faction/effects
- no artwork changes
- no Card 02 work in this task
- no reuse of `SYNC-11-CARD-ART-PRODUCTION` after this authorized run

## Delivery

After the run completes:

1. record workflow run ID, job ID, conclusion and key gate outputs;
2. record how many rows required mutation and which target changed if logs expose it;
3. explicitly confirm `NON_TARGET_FIELD_CHANGES=0` and final `SOURCE_OF_TRUTH_MATCH=11/11`;
4. create/update a durable execution report under `docs/agent-reports/`;
5. update `docs/art-pack-03.md` to state Card 01 production sync completed, only if the run is successful;
6. update `docs/AGENT_STATE.md` last and fetch it back from GitHub to verify.

After a successful run, mark the confirmation string consumed and move Card 01 to complete end-to-end. Do not begin Card 02 inside this task.
