# CURRENT TASK — Art Pack 03 Card 04: prepare controlled 14-card production sync

## Status

Card 04 `rune-of-curse-breaking` / «Руна Разрушения Проклятий» is **FINAL OWNER APPROVED** and **REPOSITORY INTEGRATED ON `main`**, but is **NOT LIVE IN PRODUCTION**.

Owner explicitly authorized this next **repository-only preparation task** on 2026-09-01.

Canonical integration source:

- PR `#41`: MERGED
- exact merge commit / immutable source candidate: `b792be37b32f73906d104642689afaa88a47b1c2`
- approved Card 04 artwork path: `apps/web/public/art/cards/rune-of-curse-breaking.webp`
- Card 04 artwork Git blob: `e1ea12a2f03cc84e9931600e978cc8bf6b1eaccb`
- byte size: `438894`
- SHA-256: `6f07380f1f64bee0efd8ec9819de1951dd14fd9dc127dd173ddda909b1c49dd5`

Cards 01–03 are already live. The current controlled production-art sync is still the consumed 13-card definition and is pinned to Card 03 source commit `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`.

`SYNC-13-CARD-ART-PRODUCTION` is **CONSUMED — MUST NOT BE REUSED**.

## Authorization boundary

This task authorizes **repository preparation and PR creation only**.

It does **NOT** authorize:

- dispatching any production workflow;
- accessing Railway or the production database, including read-only preflight;
- mutating production;
- treating `SYNC-14-CARD-ART-PRODUCTION` as owner-authorized;
- consuming any production confirmation.

If the existing workflow shape requires the future exact phrase to be present in code, it may be changed to:

`SYNC-14-CARD-ART-PRODUCTION`

but it must be documented everywhere as **RESERVED / NOT AUTHORIZED / NOT CONSUMED**. Merely placing the future phrase in repository code is not production authorization.

## Goal

Prepare one narrow, auditable PR that upgrades the controlled artwork sync definition from 13 targets to 14 targets and repins every immutable source-of-truth reference to the exact Card 04 integration merge commit:

`b792be37b32f73906d104642689afaa88a47b1c2`

The prepared workflow must remain **NOT DISPATCHED**. Stop for owner review of the preparation PR.

## Required sequence

1. Read `CLAUDE.md`, `docs/AGENT_STATE.md`, this task, the Card 04 owner-approval report, candidate QA report, PR #41 handoff, and the Card 03 production-sync report.
2. Sync a fresh `main`. Confirm PR #41 is actually merged and `b792be37b32f73906d104642689afaa88a47b1c2` is reachable from current `main`.
3. Independently verify at commit `b792be37...` that:
   - Card 04 seed has `artworkUrl: '/art/cards/rune-of-curse-breaking.webp'`;
   - Card 04 seed has `rightsStatus: 'owned'`;
   - the exact Card 04 artwork exists at the production path;
   - its Git blob is `e1ea12a2f03cc84e9931600e978cc8bf6b1eaccb`;
   - the existing thirteen target cards are still present and valid.
4. Create a fresh branch from current `main`, preferably:
   `claude/prepare-14-card-art-sync`
5. Update `apps/game-server/scripts/sync-production-card-art.ts` narrowly:
   - repin `REQUIRED_SOURCE_COMMIT` to `b792be37b32f73906d104642689afaa88a47b1c2`;
   - add `rune-of-curse-breaking` as the fourteenth and only new target slug;
   - update comments/count wording from thirteen to fourteen;
   - remove stale claims that `SYNC-13...` is reserved; record it as CONSUMED;
   - if mentioning the next phrase, record `SYNC-14-CARD-ART-PRODUCTION` as RESERVED / NOT AUTHORIZED / NOT CONSUMED;
   - preserve all transaction, snapshot, non-target fingerprint, source-of-truth and fail-closed semantics.
6. Update `.github/workflows/production-card-art-sync.yml` narrowly:
   - repin both immutable-source env values to `b792be37b32f73906d104642689afaa88a47b1c2`;
   - update job/step wording and all hard count assertions from 13 to 14;
   - add only `rune-of-curse-breaking` to the committed-artwork slug list;
   - require `ARTWORK_FILES_PRESENT=14/14`;
   - require `TARGET_ROWS=14`, `UNIQUE_SLUGS=14`, mutation count `0..14`, `TARGET_ROWS_FINAL=14`, and `SOURCE_OF_TRUTH_MATCH=14/14` where applicable;
   - replace the consumed 13-card confirmation gate with the future 14-card exact gate only if needed by the existing design;
   - clearly document `SYNC-14-CARD-ART-PRODUCTION` as RESERVED / NOT AUTHORIZED / NOT CONSUMED;
   - do not weaken production-scope verification, snapshot locking, serializable transaction checks, post-write verification, immutable-source drift checks or non-target-field protection.
7. Verify the immutable-source safety boundary statically:
   - `b792be37...` is ancestor of current `main` and task branch;
   - no commit after `b792be37...` on the task branch changes `apps/game-server/prisma/seed.ts`, `apps/game-server/prisma/schema.prisma`, or `apps/web/public/art/cards`;
   - all 14 production WebP paths exist at `b792be37...`;
   - all 14 seed rows at `b792be37...` resolve to `/art/cards/<slug>.webp` with `rightsStatus: 'owned'`;
   - Card 04 artwork still has the approved blob/hash tuple.
8. Do **not** run the production workflow, and do not run any command through Railway or production credentials. Static/local validation only.
9. Run repository-local validation appropriate to the two operational files: diff checks, formatting/YAML validation, TypeScript/lint/test/build checks where relevant. Do not broaden unrelated formatting drift.
10. Update `docs/art-pack-03.md` only as needed to say truthfully:
    - Card 04 repository integration is merged;
    - 14-card controlled sync is **prepared in PR / not yet authorized / not run**;
    - `SYNC-13...` is consumed;
    - future `SYNC-14...` remains reserved only until explicit owner authorization.
11. Verify final changed-file scope. Expected core files are:
    - `apps/game-server/scripts/sync-production-card-art.ts`
    - `.github/workflows/production-card-art-sync.yml`
    - `docs/art-pack-03.md`
    - minimal handoff/provenance documentation only
    No seed, schema, artwork, gameplay or application UI files should change.
12. Create a PR to `main`, preferably titled:
    `ops(card-04): prepare controlled 14-card artwork sync`
13. Add the standard PR comment:
    `## AGENT HANDOFF — FINAL REPORT`
    Include:
    - base/head SHA;
    - exact changed files;
    - immutable source SHA `b792be37...`;
    - proof of 14/14 committed artwork files and seed source-of-truth;
    - all validation results;
    - explicit statement `PRODUCTION WORKFLOW DISPATCHED=NO`;
    - explicit statement `RAILWAY / PRODUCTION DB ACCESSED=NO`;
    - `SYNC-13... = CONSUMED`;
    - `SYNC-14... = RESERVED / NOT AUTHORIZED / NOT CONSUMED`.
14. Update `docs/AGENT_STATE.md` **last** to status `READY FOR OWNER MERGE APPROVAL — 14-CARD SYNC PREP ONLY`, point to the PR/head/report, and state that production authorization remains NO.
15. Fetch `docs/AGENT_STATE.md` back from GitHub and verify it.
16. Stop. **Do not merge the PR. Do not dispatch production.**

## Hard exclusions

Do NOT:

- edit `apps/game-server/prisma/seed.ts`;
- edit `apps/game-server/prisma/schema.prisma` or migrations;
- edit, move, regenerate, resize, crop or re-encode any artwork;
- change gameplay, balance or UI;
- add/remove any target other than the single Card 04 slug;
- weaken any existing production safety assertion;
- reuse or re-authorize `SYNC-13-CARD-ART-PRODUCTION`;
- claim `SYNC-14-CARD-ART-PRODUCTION` is authorized;
- dispatch `.github/workflows/production-card-art-sync.yml`;
- use Railway credentials;
- read or mutate the production DB;
- access or mutate Vercel production state;
- merge the preparation PR;
- begin Card 05 or another art pack.

## Expected final status

End at exactly one of:

- **READY FOR OWNER MERGE APPROVAL — 14-CARD SYNC PREP ONLY**
- **REJECTED / BLOCKED**

No production action is authorized by this task.