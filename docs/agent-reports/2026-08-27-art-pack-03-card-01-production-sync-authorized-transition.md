# Art Pack 03 Card 01 — production sync authorization transition

Date: 2026-08-27

## Owner decision

The owner supplied the exact fresh one-use production confirmation:

`SYNC-11-CARD-ART-PRODUCTION`

This is explicit authorization for exactly one execution of the already-prepared and merged eleven-card production-art sync for Card 01.

## Prepared configuration being authorized

- preparation PR: #36
- preparation merge commit: `a3810c4bbc91c1a4c684e79b64433cfa7c1e51c4`
- immutable source pin: `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`
- target count: 11
- new target: `acolyte-of-the-white-rune`
- confirmation gate: `SYNC-11-CARD-ART-PRODUCTION`

Independent review before this transition confirmed the preparation PR was clean, CI/Vercel passed, and no 11-card production workflow had been dispatched yet.

## Execution safety rule

Expected PRE-WRITE state is `ROWS_REQUIRING_MUTATION=1` for `acolyte-of-the-white-rune`.

If PRE-WRITE reports more than one row requiring mutation, stop before APPLY and investigate production drift. Do not weaken guards or perform manual database writes.

Successful completion requires final `SOURCE_OF_TRUTH_MATCH=11/11`, `NON_TARGET_FIELD_CHANGES=0`, and POST-WRITE `ROWS_REQUIRING_MUTATION=0`.

## Current state

Authorization is recorded. The production sync has not been run by this transition commit itself. Execution is delegated to the current task in `docs/CLAUDE_CURRENT_TASK.md` because the ChatGPT GitHub connector available in this session cannot initiate a new `workflow_dispatch`, while Claude's execution environment has previously exposed the Actions trigger required for this controlled workflow.

After the authorized run, the confirmation must be marked consumed and must not be reused.
