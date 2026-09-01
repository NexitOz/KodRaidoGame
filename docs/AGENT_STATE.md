# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Cards 01, 02 and 03 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 04 **FINAL OWNER APPROVED + REPOSITORY INTEGRATED ON `main` — NOT YET LIVE IN PRODUCTION**
- **Current target:** controlled production-art sync preparation for Card 04 / 14 total targets
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `2db532372ef68ea0691ddba360c65baa1360b746`
- **Current task type:** repository-only preparation PR: extend controlled sync 13 → 14 + immutable-source repin; no merge, no production dispatch
- **Card 04 integration PR:** `#41` — MERGED
- **Card 04 integration merge commit / required immutable source:** `b792be37b32f73906d104642689afaa88a47b1c2`
- **Card 04 integration CI:** run `33555928983` — success
- **Production operation authorized:** **NO**
- **Card 04 production sync authorized:** **NO**
- **`SYNC-13-CARD-ART-PRODUCTION`:** **CONSUMED — MUST NOT BE REUSED**
- **Future `SYNC-14-CARD-ART-PRODUCTION`:** may be reserved in repository code by the current preparation task if required by the workflow shape, but remains **NOT AUTHORIZED / NOT CONSUMED** until a later explicit owner decision
- **Open blocker after this task:** owner audit/merge approval of the 14-card sync-preparation PR, followed later by a fresh explicit production authorization

## Current authorized task — 14-card sync preparation only

Execute `docs/CLAUDE_CURRENT_TASK.md` @ `2db532372ef68ea0691ddba360c65baa1360b746`.

Required intent:

1. fresh `main`;
2. verify PR #41 merge and immutable source `b792be37b32f73906d104642689afaa88a47b1c2`;
3. create a fresh preparation branch;
4. extend `apps/game-server/scripts/sync-production-card-art.ts` from 13 to 14 targets by adding only `rune-of-curse-breaking`;
5. repin script immutable source to `b792be37b32f73906d104642689afaa88a47b1c2`;
6. extend `.github/workflows/production-card-art-sync.yml` from 13 to 14 counts/slugs and repin both immutable-source env values to the same merge SHA;
7. preserve all existing fail-closed production-scope, snapshot, transaction, drift, post-write and non-target-field protections;
8. statically prove 14/14 committed art paths and 14/14 seed art source-of-truth at the immutable merge commit;
9. do not touch seed/schema/art/gameplay/UI;
10. do not access Railway or production DB, even read-only;
11. do not dispatch the production workflow;
12. create a narrow PR and stop at `READY FOR OWNER MERGE APPROVAL — 14-CARD SYNC PREP ONLY`;
13. update this file last and fetch-verify it.

## Hard production boundary

This task is repository preparation only.

Do NOT:

- dispatch production artwork sync;
- access or mutate Railway / production DB;
- access or mutate Vercel production state;
- edit seed, schema, migrations, artwork, gameplay or application UI;
- weaken production safety assertions;
- reuse `SYNC-13-CARD-ART-PRODUCTION`;
- claim `SYNC-14-CARD-ART-PRODUCTION` is owner-authorized or consumed;
- merge the preparation PR without a new owner decision;
- begin another card.

If `SYNC-14-CARD-ART-PRODUCTION` is placed into workflow code during preparation, that is only a **RESERVED exact future gate**. It does not authorize dispatch.

## Card 04 repository integration record

Owner approved Card 04 after eight-surface QA and explicitly accepted both reported visual caveats for the exact approved bytes.

PR #41 was explicitly owner-approved and merged on 2026-09-01.

- merge commit: `b792be37b32f73906d104642689afaa88a47b1c2`
- merged head: `b69b3893d359ccb8b1742b901969a0d3a23e4b5f`
- changed files: exactly 4
- production sync logic in PR #41: untouched
- production sync run: NO
- Railway / production DB: untouched

Exact approved Card 04 artwork:

- slug: `rune-of-curse-breaking`
- production path: `apps/web/public/art/cards/rune-of-curse-breaking.webp`
- dimensions: `1024 × 1536`
- byte size / RIFF total: `438894`
- FourCC: plain `VP8 `
- SHA-256: `6f07380f1f64bee0efd8ec9819de1951dd14fd9dc127dd173ddda909b1c49dd5`
- Git blob SHA: `e1ea12a2f03cc84e9931600e978cc8bf6b1eaccb`
- full decode: PASS
- seed path after integration: `/art/cards/rune-of-curse-breaking.webp`
- rights status after integration: `owned`

Gameplay facts are locked and must not change during sync preparation:

- type / rarity / cost: `RUNE / EPIC / 3`
- faction/tag: `PURIFICATION / Purification`
- ability: `В начале каждого вашего хода снимите Проклятие и Заглушение со всех союзников.`
- mechanic: `TURN_START` → `CLEANSE` / `FRIENDLY_ALL`

## Existing 13-card sync state before current task

Current script/workflow on `main` before the preparation task:

- targets: 13
- immutable source: Card 03 integration commit `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`
- workflow exact gate: consumed `SYNC-13-CARD-ART-PRODUCTION`
- Card 04 absent from target list

The current task must update this repository definition safely to 14 while performing **zero production operations**.

## Card 03 closed production record

- integration merge / old immutable source: `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`
- repin merge: `c3c6e0c491fb4e48c94b32749bd0474b047305c9`
- production run: `33436786024` (run #9)
- job: `99635055417`
- conclusion: success
- rows changed: exactly 1, only `warden-of-the-barrier`
- final source-of-truth: `13/13`
- `NON_TARGET_FIELD_CHANGES=0`
- `SYNC-13-CARD-ART-PRODUCTION`: **CONSUMED**

Card 03 is closed. Do not reopen it without a new owner decision.

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 02 `seal-of-the-curse` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 03 `warden-of-the-barrier` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 04 `rune-of-curse-breaking` — **FINAL OWNER APPROVED, REPOSITORY INTEGRATED, PRODUCTION SYNC PREPARATION AUTHORIZED, NOT LIVE IN PRODUCTION**

## Art binary transport standing rule

The user is not a manual file courier.

For generated masters when Claude Code has GitHub-only egress:

1. keep/upload exact bytes through a provider with a machine-readable raw file API;
2. use an isolated GitHub Actions transport branch to fetch raw bytes on a GitHub-hosted runner;
3. hard-gate size + SHA-256 + Git blob SHA + RIFF/FourCC + dimensions + full decode before Git;
4. commit exact bytes via normal git, push, fetch back and re-verify remote bytes;
5. never merge temporary transport workflows into `main`;
6. Claude/Codex independently verifies candidate bytes before QA/integration;
7. manual owner upload is fallback-only.

Never use GitHub Contents-API binary/base64 transport for generated masters; this project has already observed truncation through that route.

Optional cleanup after Card 04 is fully live: delete `transport/card04-github-actions`; it carries a `contents: write` workflow and must never be merged.