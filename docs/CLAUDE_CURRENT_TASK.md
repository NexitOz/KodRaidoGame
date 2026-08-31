# CURRENT TASK — Art Pack 03 Card 03: execute authorized 13-card production artwork sync

## Authorization

The owner supplied a fresh explicit authorization on **2026-08-31** containing exactly:

`SYNC-13-CARD-ART-PRODUCTION`

This authorization permits **exactly one new manual dispatch** of the existing controlled workflow:

`.github/workflows/production-card-art-sync.yml`

for the Card 03 promotion / 13-card production artwork metadata synchronization.

Treat this authorization as **single-use**. It becomes **CONSUMED immediately when the workflow dispatch is accepted by GitHub**, regardless of whether the run later succeeds or fails. Never use the same authorization for a retry. Any retry after a failed/cancelled run requires a new explicit owner authorization.

## Canonical source

Card 03 repository integration PR #39 merge commit:

`8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`

Post-merge repin PR #40 merge commit:

`c3c6e0c491fb4e48c94b32749bd0474b047305c9`

All three active immutable-source pins must remain exactly:

`8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`

Approved Card 03 asset:

- slug: `warden-of-the-barrier`
- canonical artwork path: `apps/web/public/art/cards/warden-of-the-barrier.webp`
- Git blob SHA: `c4cb3f4e41f349e86b044712f267f9fdc678aa86`
- byte size: `193038`
- SHA-256: `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`
- seed artworkUrl: `/art/cards/warden-of-the-barrier.webp`
- seed rightsStatus: `owned`

## Required execution

1. Fetch fresh `main` and read `CLAUDE.md`, `docs/AGENT_STATE.md`, this task, and the existing workflow before any production action.
2. Verify PR #40 is merged and current `main` contains all three immutable-source pins set to `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`.
3. Verify there is no drift from the immutable source on the protected source paths used by the workflow: `apps/game-server/prisma/seed.ts`, `apps/game-server/prisma/schema.prisma`, `apps/web/public/art/cards`.
4. Verify the workflow still requires exact input `SYNC-13-CARD-ART-PRODUCTION`, has 13 unique target slugs, checks all 13 artwork files, and retains Railway scope verification, read-only PRE-WRITE, snapshot-gated APPLY, Serializable transaction, non-target fingerprint checks, and independent POST-WRITE verification.
5. Dispatch `.github/workflows/production-card-art-sync.yml` **once**, on `main`, with workflow input:

   `confirmation = SYNC-13-CARD-ART-PRODUCTION`

6. As soon as GitHub accepts the dispatch, consider this owner authorization **CONSUMED**. Do not dispatch again under any circumstance in this task.
7. Resolve the exact new workflow run ID and job ID. Do not confuse it with prior 12-card or CI runs.
8. Follow the run through completion. Do not modify workflow/code/secrets or weaken a gate if it fails.
9. Capture and report these gates from the actual production run logs:
   - exact confirmation gate PASS
   - `IMMUTABLE_SOURCE_SHA_VERIFIED=8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`
   - `ARTWORK_FILES_PRESENT=13/13`
   - Railway token/project/environment/game-server DB linkage verification
   - `PRODUCTION_SCOPE_VERIFIED=YES`
   - `READ_ONLY_DB_PREFLIGHT=YES`
   - PRE-WRITE `TARGET_ROWS=13`
   - PRE-WRITE `UNIQUE_SLUGS=13`
   - PRE-WRITE `ROWS_REQUIRING_MUTATION=<measured>`
   - PRE-WRITE snapshot value
10. If PRE-WRITE reports `ROWS_REQUIRING_MUTATION=0`, verify the workflow takes the already-synchronized branch and **does not run Atomic APPLY**.
11. If PRE-WRITE reports one or more mutations, allow the existing snapshot-gated `Atomic APPLY` step to run unchanged and require:
   - `TRANSACTION_STARTED=YES`
   - `TRANSACTION_COMMITTED=YES`
   - `ROWS_CHANGED=<measured>`
   - `TARGET_ROWS_FINAL=13`
   - `SOURCE_OF_TRUTH_MATCH=13/13`
   - `NON_TARGET_FIELD_CHANGES=0`
12. Require independent POST-WRITE verification to report:
   - `TARGET_ROWS=13`
   - `UNIQUE_SLUGS=13`
   - `ROWS_REQUIRING_MUTATION=0`
   - `SOURCE_OF_TRUTH_MATCH=13/13`
13. If any gate fails, stop and report the failure. **Do not rerun** with this authorization and do not patch around a failed gate.
14. Do not make repository changes merely to record success unless the permanent protocol explicitly requires a report/state update. No production data outside `artworkUrl` and `rightsStatus` for the 13 allowlisted slugs may be changed.
15. Leave a durable execution report at `docs/agent-reports/2026-08-31-art-pack-03-card-03-production-sync.md` recording run/job IDs, final conclusion, measured rows changed, all safety gates, post-write result, and that `SYNC-13-CARD-ART-PRODUCTION` is CONSUMED.
16. Update `docs/AGENT_STATE.md` **LAST**, then fetch it back from GitHub and verify it.

## Hard exclusions

Do NOT:

- dispatch more than once;
- reuse this confirmation for a retry;
- edit or bypass workflow safety gates;
- manually run `--apply` outside the controlled workflow;
- mutate non-art fields;
- seed or migrate production;
- alter Card 03 artwork bytes;
- change gameplay, balance, schema, migrations, or other cards;
- start Card 04 in this task.

## Final status

End at exactly one of:

- **COMPLETE END TO END — LIVE IN PRODUCTION**
- **PRODUCTION SYNC FAILED / BLOCKED — AUTHORIZATION CONSUMED, FRESH AUTH REQUIRED FOR RETRY**

The success status is allowed only if the workflow run itself concludes success and independent POST-WRITE reports `SOURCE_OF_TRUTH_MATCH=13/13`, `ROWS_REQUIRING_MUTATION=0`, with no non-target field changes.