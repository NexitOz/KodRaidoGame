# CURRENT TASK — Art Pack 03 Card 03: await explicit production sync authorization

## Status

Card 03 `warden-of-the-barrier` / «Хранительница Барьера» is FINAL OWNER APPROVED, repository-integrated, and post-merge immutable-source repinning is complete on `main`.

Repository integration PR #39 merge commit:

`8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`

Post-merge repin PR #40 merge commit:

`c3c6e0c491fb4e48c94b32749bd0474b047305c9`

All three active immutable-source pins now point to the exact Card 03 integration merge commit:

`8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`

The 13-card sync is technically prepared. It is **NOT AUTHORIZED TO RUN**.

`SYNC-13-CARD-ART-PRODUCTION` is **RESERVED, NOT AUTHORIZED, NOT CONSUMED**.

## Current instruction

Do nothing operational until the owner provides a fresh explicit authorization containing the exact confirmation string:

`SYNC-13-CARD-ART-PRODUCTION`

A generic instruction such as “continue”, “run the current task”, “go ahead”, “Claude finished”, or any earlier approval is **not** production authorization.

Until the exact fresh authorization is supplied, do not create a production execution branch/task and do not dispatch the workflow.

## Verified readiness

Repository review has already established:

- Card 03 production artwork path: `apps/web/public/art/cards/warden-of-the-barrier.webp`
- approved Git blob SHA: `c4cb3f4e41f349e86b044712f267f9fdc678aa86`
- byte size: `193038`
- SHA-256: `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`
- seed fields: `/art/cards/warden-of-the-barrier.webp` + `rightsStatus: 'owned'`
- target list: 13 unique cards
- confirmation string: `SYNC-13-CARD-ART-PRODUCTION`
- workflow/source pins: `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`
- local read-only derivation: `SOURCE_OF_TRUTH_MATCH=13/13`
- pin enforcement negative controls: PASS
- PR #40 CI: run `33431221072` success
- independent repin review: PASS

These readiness checks do not establish current production database state and do not authorize production access.

## If fresh authorization is later supplied

Only then may a production execution task be created. It must use the existing controlled workflow and preserve all established safeguards:

1. verify current `main` and immutable pins before dispatch;
2. verify the exact confirmation string;
3. use the existing Railway production identity/scope gates;
4. perform the workflow's read-only PRE-WRITE phase first;
5. require the exact PRE-WRITE snapshot for APPLY;
6. allow changes only to `artworkUrl` and `rightsStatus` for the 13 allowlisted slugs;
7. require `NON_TARGET_FIELD_CHANGES=0`;
8. run independent POST-WRITE verification;
9. record the exact workflow run/job IDs, rows changed, source-of-truth match, and consumed confirmation state;
10. stop and report on any failed gate rather than weakening a check.

Expected production intent for Card 03 is one metadata change if production still reflects the current 12-card state, but the actual PRE-WRITE result must be measured rather than assumed.

## Hard exclusions while authorization is absent

Do NOT:

- dispatch `.github/workflows/production-card-art-sync.yml`;
- access Railway production merely to inspect readiness;
- read or mutate the production database;
- treat the reserved confirmation string in repository files as authorization;
- reuse `SYNC-12-CARD-ART-PRODUCTION`;
- alter Card 03 artwork, gameplay, balance, schema, or migrations;
- begin Card 04 as part of this task.

## Current final status

**AWAITING FRESH EXPLICIT OWNER AUTHORIZATION**
