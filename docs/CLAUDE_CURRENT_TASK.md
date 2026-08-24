# CURRENT TASK — Run 9-card production art sync

## Goal

Execute the already-reviewed and merged production card-art sync for 9 cards, including `keeper-of-smoldering-embers`.

This is an **operations-only** task. Do not edit code, do not create a branch/PR, and do not make any repository changes.

## Baseline

Latest merged `main` must contain PR #33 and merge commit:

`8feda41a5cc2c9ce8c0164535e909804f60939d8`

The workflow must be:

`.github/workflows/production-card-art-sync.yml`

Before dispatching, verify from `origin/main` that it is the 9-card version and that:

- confirmation input is `SYNC-9-CARD-ART-PRODUCTION`
- `REQUIRED_SOURCE_COMMIT` = `d40e034eaacac6d86c8ccefa384322f432a98c5d`
- `SOURCE_COMMIT` = `d40e034eaacac6d86c8ccefa384322f432a98c5d`
- Keeper is present in the 9 artwork slugs
- PRE-WRITE / APPLY / POST-WRITE assertions are all 9-card assertions

If any of these differ, STOP and report the mismatch. Do not dispatch.

## Execute

Dispatch `production-card-art-sync.yml` on `main` with the exact input:

`confirmation = SYNC-9-CARD-ART-PRODUCTION`

Wait for the workflow to complete. Do not start a second run while the first is active.

## Required verification

Inspect the actual workflow run, jobs and logs. Confirm all of the following:

- exact manual confirmation passed
- immutable source SHA verification passed
- `ARTWORK_FILES_PRESENT=9/9`
- Railway token present
- production project/environment/database scope verification passed
- read-only connectivity preflight passed
- PRE-WRITE: `TARGET_ROWS=9`, `UNIQUE_SLUGS=9`
- record `ROWS_REQUIRING_MUTATION` and `PRE_WRITE_SNAPSHOT`
- if mutation was required, Atomic APPLY completed with:
  - `TRANSACTION_STARTED=YES`
  - `TRANSACTION_COMMITTED=YES`
  - `TARGET_ROWS_FINAL=9`
  - `SOURCE_OF_TRUTH_MATCH=9/9`
  - `NON_TARGET_FIELD_CHANGES=0`
- if no mutation was required, confirm `DATABASE_ALREADY_SYNCHRONIZED=YES`
- independent POST-WRITE:
  - `TARGET_ROWS=9`
  - `UNIQUE_SLUGS=9`
  - `ROWS_REQUIRING_MUTATION=0`
  - `SOURCE_OF_TRUTH_MATCH=9/9`

For `keeper-of-smoldering-embers`, confirm the final production values are:

- `artworkUrl = /art/cards/keeper-of-smoldering-embers.webp`
- `rightsStatus = owned`

Do not expose Railway tokens, DB credentials, connection strings, or other secrets in the report/chat.

## Stop conditions

If the workflow fails at any step, do not retry automatically and do not make manual DB changes. Report the failed step, run ID and relevant safe log lines, then stop.

## Delivery

No repository changes are expected from this task.

Return a short operator summary only:

- workflow run ID / URL
- conclusion
- rows requiring mutation
- rows changed
- post-write source-of-truth result
- Keeper final production state

Do not merge or modify anything else.
