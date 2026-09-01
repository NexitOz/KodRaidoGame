# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 04 **FINAL OWNER APPROVED + REPOSITORY INTEGRATED + 14-CARD SYNC PREPARATION MERGED ON `main` — NOT YET LIVE IN PRODUCTION**
- **Current target:** production authorization gate for the controlled 14-card artwork sync
- **Card 04 integration PR:** `#41` — MERGED
- **Card 04 integration merge / immutable artwork source:** `b792be37b32f73906d104642689afaa88a47b1c2`
- **14-card sync preparation PR:** `#42` — MERGED
- **14-card sync preparation merge commit:** `81a550200b06a889a751f3c78535c1b917bd5b41`
- **Prepared target count:** `14`
- **Prepared workflow gate:** `SYNC-14-CARD-ART-PRODUCTION`
- **Production operation authorized:** **NO**
- **Card 04 production sync authorized:** **NO**
- **Production workflow dispatched:** **NO**
- **Railway / production DB accessed for Card 04 sync:** **NO**
- **`SYNC-13-CARD-ART-PRODUCTION`:** **CONSUMED — MUST NOT BE REUSED**
- **`SYNC-14-CARD-ART-PRODUCTION`:** **RESERVED / NOT AUTHORIZED / NOT CONSUMED**
- **Open blocker:** fresh explicit owner authorization of the exact 14-card production confirmation string

`docs/CLAUDE_CURRENT_TASK.md` describes the now-completed sync-preparation task and must be treated as **STALE / DO NOT RE-RUN** until explicitly replaced.

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 02 `seal-of-the-curse` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 03 `warden-of-the-barrier` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 04 `rune-of-curse-breaking` — **FINAL OWNER APPROVED, REPOSITORY INTEGRATED, 14-CARD SYNC PREPARED ON `main`, NOT LIVE IN PRODUCTION**

## Card 04 repository integration record

Owner approved Card 04 after eight-surface QA and explicitly accepted both reported visual caveats for the exact approved bytes.

PR #41 was owner-approved and merged on 2026-09-01.

- merge commit: `b792be37b32f73906d104642689afaa88a47b1c2`
- production path: `apps/web/public/art/cards/rune-of-curse-breaking.webp`
- dimensions: `1024 × 1536`
- byte size / RIFF total: `438894`
- FourCC: plain `VP8 `
- SHA-256: `6f07380f1f64bee0efd8ec9819de1951dd14fd9dc127dd173ddda909b1c49dd5`
- Git blob SHA: `e1ea12a2f03cc84e9931600e978cc8bf6b1eaccb`
- seed artwork path: `/art/cards/rune-of-curse-breaking.webp`
- rights status: `owned`

Gameplay facts remain locked:

- type / rarity / cost: `RUNE / EPIC / 3`
- faction/tag: `PURIFICATION / Purification`
- mechanic: `TURN_START` → `CLEANSE` / `FRIENDLY_ALL`

## 14-card controlled sync preparation — MERGED

PR #42 was explicitly owner-approved and merged on 2026-09-01.

Merge commit:

`81a550200b06a889a751f3c78535c1b917bd5b41`

Repository state after merge:

- `apps/game-server/scripts/sync-production-card-art.ts` targets 14 cards;
- the only new target versus the previous production set is `rune-of-curse-breaking`;
- script `REQUIRED_SOURCE_COMMIT` is pinned to `b792be37b32f73906d104642689afaa88a47b1c2`;
- workflow `REQUIRED_SOURCE_COMMIT` and `SOURCE_COMMIT` are pinned to the same immutable Card 04 integration merge;
- committed-art verification expects `14/14` files;
- PRE-WRITE expects `TARGET_ROWS=14` and `UNIQUE_SLUGS=14`;
- APPLY expects `TARGET_ROWS_FINAL=14`, `SOURCE_OF_TRUTH_MATCH=14/14`, `NON_TARGET_FIELD_CHANGES=0`;
- POST-WRITE expects `TARGET_ROWS=14`, `UNIQUE_SLUGS=14`, `ROWS_REQUIRING_MUTATION=0`, `SOURCE_OF_TRUTH_MATCH=14/14`;
- exact workflow confirmation literal is `SYNC-14-CARD-ART-PRODUCTION`.

Safety semantics remain intact: production-scope verification, immutable-source drift checks, pre-write snapshot gate, Serializable transaction, non-target fingerprints and independent post-write verification were not weakened.

Preparation validation before merge established:

- `ARTWORK_FILES_PRESENT=14/14` at the immutable source;
- `SEED_SOURCE_OF_TRUTH=14/14` at the immutable source;
- Card 04 exact blob and seed fields present;
- old pin fails closed;
- `--apply` without the immediately preceding snapshot refuses to run;
- repository CI green.

## Production boundary — HARD GATE

The 14-card sync is technically prepared but **not authorized**.

Do NOT:

- dispatch `.github/workflows/production-card-art-sync.yml`;
- access or mutate Railway / production DB for this sync;
- treat the presence of `SYNC-14-CARD-ART-PRODUCTION` in repository code as authorization;
- reuse `SYNC-13-CARD-ART-PRODUCTION`;
- begin Card 05 before Card 04 production closeout unless the owner explicitly changes priority.

The next production action requires the owner to explicitly provide the exact one-use confirmation:

`SYNC-14-CARD-ART-PRODUCTION`

Only after that explicit authorization may the controlled workflow be dispatched. The run must then be audited through PRE-WRITE, APPLY (if required), and POST-WRITE evidence before Card 04 can be marked live in production.

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
