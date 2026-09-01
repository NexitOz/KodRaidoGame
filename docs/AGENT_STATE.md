# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** **READY FOR OWNER MERGE APPROVAL — 14-CARD SYNC PREP ONLY**
- **Detail:** Cards 01, 02 and 03 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 04 **FINAL OWNER APPROVED + REPOSITORY INTEGRATED ON `main`, 14-CARD SYNC PREPARED IN PR — NOT AUTHORIZED, NOT RUN, NOT LIVE IN PRODUCTION**
- **Current target:** owner audit and merge decision on the 14-card sync-preparation PR
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `2db532372ef68ea0691ddba360c65baa1360b746`
- **Current task type:** repository-only preparation PR: extend controlled sync 13 → 14 + immutable-source repin; no merge, no production dispatch — **COMPLETED, PR OPEN**
- **Latest task-result commit:** `404dc6271721e950c4b5b74d9467c49f1aa25050`
- **Branch / PR:** `claude/prepare-14-card-art-sync` → PR `#42` — OPEN / NOT MERGED
- **Base SHA:** `798e1430ac833934caf83b797599caa1506f78f9`
- **Latest report:** PR #42 comment `## AGENT HANDOFF — FINAL REPORT` — https://github.com/NexitOz/KodRaidoGame/pull/42#issuecomment-5500388293
- **Exact scope of changes (3 files):** `apps/game-server/scripts/sync-production-card-art.ts`, `.github/workflows/production-card-art-sync.yml`, `docs/art-pack-03.md`. No seed, schema, migration, artwork, gameplay or UI file changed.
- **Card 04 integration PR:** `#41` — MERGED
- **Card 04 integration merge commit / required immutable source:** `b792be37b32f73906d104642689afaa88a47b1c2` — now pinned at all three sites
- **Card 04 integration CI:** run `33555928983` — success
- **Production operation authorized:** **NO**
- **Card 04 production sync authorized:** **NO**
- **Production workflow dispatched:** **NO**
- **Railway / production DB accessed:** **NO** (not even read-only preflight)
- **`SYNC-13-CARD-ART-PRODUCTION`:** **CONSUMED — MUST NOT BE REUSED**
- **`SYNC-14-CARD-ART-PRODUCTION`:** present in the workflow gate as a **RESERVED exact literal** only — **NOT AUTHORIZED / NOT CONSUMED** until a later explicit owner decision at dispatch time
- **Open blocker:** owner audit/merge approval of PR #42, followed later by a separate fresh explicit production authorization
- **Recommended next action:** owner reviews and merges PR #42. Do not dispatch the sync workflow on the strength of this preparation; a fourteen-card run needs a new explicit owner confirmation. After merge the pin is already correct and will not need repinning again for Card 04.

## Completed task record — 14-card sync preparation

Executed `docs/CLAUDE_CURRENT_TASK.md` @ `2db532372ef68ea0691ddba360c65baa1360b746`. Result: PR #42, head `404dc6271721e950c4b5b74d9467c49f1aa25050`.

What was verified and done:

1. fresh `main` synced; PR #41 confirmed merged as `b792be37b32f73906d104642689afaa88a47b1c2` (parents `1a2b7ea` + `b69b389`), an ancestor of both `main` and the task branch;
2. at the pinned commit: `ARTWORK_FILES_PRESENT=14/14`, `SEED_SOURCE_OF_TRUTH=14/14`, Card 04 blob `e1ea12a2f03cc84e9931600e978cc8bf6b1eaccb` / `438894` bytes / SHA-256 `6f07380f…c1b49dd5`;
3. `sync-production-card-art.ts` repinned and extended by exactly one slug (`rune-of-curse-breaking`); target-list diff versus the old pin is a single added line;
4. `production-card-art-sync.yml` repinned at both env values; the same single slug added; every hard count assertion raised 13 → 14 (`ARTWORK_FILES_PRESENT`, `TARGET_ROWS`, `UNIQUE_SLUGS`, mutation bound, `TARGET_ROWS_FINAL`, `SOURCE_OF_TRUTH_MATCH`) plus the confirmation gate;
5. no safety semantics weakened — production-scope verification, snapshot gate, Serializable transaction, non-target fingerprints, drift checks and POST-WRITE re-read all unchanged; both negative controls still fail closed (old pin rejected; `--apply` without a preceding-`--check` snapshot refused);
6. no drift on `seed.ts`, `schema.prisma` or `apps/web/public/art/cards` between the pin and either `main` or HEAD;
7. validation: Prettier clean on all three changed files, pre-existing script drift unchanged at 7 hunks, YAML parses, `tsc --strict` and `eslint` clean on the script, `npm run lint -w apps/game-server` pass, `npm run test -w apps/game-server` **156/156 pass**, `git diff --check` clean;
8. read-only derivation against a **local test Postgres only**: `TARGET_ROWS=14`, `UNIQUE_SLUGS=14`, `SOURCE_OF_TRUTH_MATCH=14/14`, exit 0.

## Hard production boundary — still in force

The completed task was repository preparation only, and no production authorization follows from it.

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

## Sync definition state

On `main` (before PR #42 merges):

- targets: 13
- immutable source: Card 03 integration commit `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`
- workflow exact gate: consumed `SYNC-13-CARD-ART-PRODUCTION`
- Card 04 absent from target list

On `claude/prepare-14-card-art-sync` (PR #42, open):

- targets: 14 — the single addition is `rune-of-curse-breaking`
- immutable source: `b792be37b32f73906d104642689afaa88a47b1c2` at all three pin sites
- workflow exact gate: `SYNC-14-CARD-ART-PRODUCTION` — RESERVED, NOT AUTHORIZED, NOT CONSUMED
- zero production operations were performed to produce this state

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
- Card 04 `rune-of-curse-breaking` — **FINAL OWNER APPROVED, REPOSITORY INTEGRATED, 14-CARD SYNC PREPARED IN PR #42 — NOT AUTHORIZED, NOT RUN, NOT LIVE IN PRODUCTION**

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
