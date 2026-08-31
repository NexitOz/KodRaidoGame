# CURRENT TASK — Art Pack 03 Card 03: post-merge immutable-source repin + validation

## Status

Card 03 `warden-of-the-barrier` / «Хранительница Барьера» is FINAL OWNER APPROVED and its repository integration PR #39 has been independently reviewed and merged.

Exact integration merge commit:

`8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`

PR #39 integration head before merge:

`e0e7a472ed3f66133d5448600aab65e75f6a6a2d`

Production synchronization is still **NOT AUTHORIZED**. `SYNC-13-CARD-ART-PRODUCTION` remains **RESERVED, NOT AUTHORIZED, NOT CONSUMED**.

## Goal

Repoint every 13-card production artwork immutable-source pin from the old 12-card Card 02 source commit to the exact merged Card 03 integration commit, then prove the merged 13-card source of truth is internally valid and production-ready without performing any production mutation.

This is a repository-only safety task. It must stop before any production workflow dispatch or DB write.

## Required source commit

All immutable-source pins must become exactly:

`8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`

Do not use the PR head SHA, candidate branch SHA, a later docs-only main SHA, or any other commit as the immutable Card 03 integration source.

The reason is deliberate: the required source must be the exact merge commit that first contains the independently reviewed Card 03 repository integration on `main`.

## Required work

1. Read `CLAUDE.md`, `docs/AGENT_STATE.md`, this task, PR #39, its final handoff, and the Card 03 owner approval / QA records before editing.
2. Start from fresh current `main`.
3. Verify PR #39 is merged and verify merge commit `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b` exists on `main` history.
4. Verify at that exact merge commit:
   - `apps/web/public/art/cards/warden-of-the-barrier.webp` exists;
   - Git blob SHA is `c4cb3f4e41f349e86b044712f267f9fdc678aa86`;
   - byte size is `193038`;
   - SHA-256 is `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`;
   - `apps/game-server/prisma/seed.ts` contains Card 03 `artworkUrl: '/art/cards/warden-of-the-barrier.webp'` and `rightsStatus: 'owned'`;
   - the 13-target sync definition includes only the intended added target `warden-of-the-barrier` beyond the previous twelve.
5. Update only the immutable-source pins/comments required for the post-merge state:
   - `REQUIRED_SOURCE_COMMIT` in `apps/game-server/scripts/sync-production-card-art.ts` → `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`;
   - `.github/workflows/production-card-art-sync.yml` `REQUIRED_SOURCE_COMMIT` → the same merge SHA;
   - `.github/workflows/production-card-art-sync.yml` `SOURCE_COMMIT` → the same merge SHA;
   - replace the temporary deliberately-stale-pin comments with accurate post-merge immutable-source comments.
6. Do not change the 13 target list, confirmation string, mutation logic, production scope checks, transaction logic or artwork paths except if an objective validation failure proves an integration defect. If such a defect exists, stop and report it rather than broadening scope silently.
7. Run repository validation relevant to these files:
   - `git diff --check`;
   - targeted formatting check without rewriting unrelated pre-existing drift;
   - lint / typecheck / tests / build as appropriate;
   - any existing static or unit coverage for the sync script/workflow.
8. Prove the merged source now passes source-of-truth derivation from the exact immutable merge commit without mutating production. A local/test environment read-only check is allowed. Production Railway/DB access is not required and must not be used merely to prove repository correctness.
9. Verify the workflow is structurally ready for a future 13-card production run:
   - exact confirmation string remains `SYNC-13-CARD-ART-PRODUCTION`;
   - target rows/assertions remain 13;
   - artwork existence check covers all 13 files;
   - immutable source verification resolves to `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`;
   - no 12-card stale pin remains anywhere in the sync script/workflow.
10. Audit the diff. Expected functional changes are only the three immutable-source pin values plus their directly associated comments/documentation required to describe the new state.
11. Commit and push on a narrow branch, open a PR to `main`, and do **not** merge it yourself.
12. Leave the standard durable handoff on the PR headed exactly `## AGENT HANDOFF — FINAL REPORT`.
13. Update `docs/AGENT_STATE.md` LAST, then fetch it back from GitHub and verify it.

## Hard exclusions

Do NOT:

- dispatch `.github/workflows/production-card-art-sync.yml`;
- treat `SYNC-13-CARD-ART-PRODUCTION` as owner authorization;
- mutate production DB;
- access/mutate Railway or Vercel production;
- alter Card 03 artwork bytes;
- alter Card 03 gameplay, balance, ability, stats, schema or migrations;
- change any Card 01/02 artwork or production data;
- begin Card 04;
- delete transport/candidate branches in this task unless explicitly instructed later.

## Final status

End at exactly one of:

- **READY FOR INDEPENDENT REPIN PR REVIEW**
- **BLOCKED / REJECTED**

If READY, report:

- branch;
- exact head SHA;
- PR number;
- exact changed files;
- old → new pin values at all three pin sites;
- proof the merge commit contains the exact approved Card 03 asset and seed fields;
- validation results;
- proof no production workflow or DB mutation occurred;
- final status.
