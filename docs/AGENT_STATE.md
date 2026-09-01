# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Cards 01, 02 and 03 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 04 **REPOSITORY INTEGRATED ON `main` — NOT YET LIVE IN PRODUCTION**
- **Current target:** `rune-of-curse-breaking` / «Руна Разрушения Проклятий»
- **Integration PR:** **#41 — MERGED**
- **Integration merge commit / immutable repository source:** `b792be37b32f73906d104642689afaa88a47b1c2`
- **Integration head before merge:** `b69b3893d359ccb8b1742b901969a0d3a23e4b5f`
- **Integration CI:** run `33555928983` — success
- **Latest owner approval:** `docs/agent-reports/2026-09-01-art-pack-03-card-04-post-qa-owner-approval.md`
- **Latest QA report:** `docs/agent-reports/2026-08-31-art-pack-03-card-04-candidate-qa.md`
- **Open blocker:** controlled production-sync preparation has **not** yet been authorized/executed for Card 04
- **Production operation authorized:** NO
- **Card 04 production sync authorized:** NO
- **`SYNC-13-CARD-ART-PRODUCTION`:** **CONSUMED — MUST NOT BE REUSED**
- **Next production confirmation:** does not exist yet; when the 14-card sync is fully prepared and audited, it must be a fresh one-use owner confirmation

`docs/CLAUDE_CURRENT_TASK.md` still describes the now-completed integration-PR task and must be treated as **STALE / DO NOT RE-RUN** until explicitly replaced for the next authorized task.

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 02 `seal-of-the-curse` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 03 `warden-of-the-barrier` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 04 `rune-of-curse-breaking` — **FINAL OWNER APPROVED, REPOSITORY INTEGRATED ON `main`, NOT YET LIVE IN PRODUCTION**

## Card 04 integration merge record

Owner explicitly authorized merging PR #41 on 2026-09-01.

GitHub merge result:

- PR: `#41`
- state: merged / closed
- merge commit: `b792be37b32f73906d104642689afaa88a47b1c2`
- merged head: `b69b3893d359ccb8b1742b901969a0d3a23e4b5f`
- changed files: exactly 4
- production sync logic: untouched
- Railway / Vercel / production DB: untouched
- production artwork sync: NOT run

The merge commit message explicitly states that this is repository integration only and production sync remains unauthorized.

## Card 04 canonical card facts

- slug: `rune-of-curse-breaking`
- name: «Руна Разрушения Проклятий»
- faction/tag: PURIFICATION / `Purification`
- type: `RUNE`
- rarity: `EPIC`
- cost: `3`
- ability: `В начале каждого вашего хода снимите Проклятие и Заглушение со всех союзников.`
- mechanic: `TURN_START` → `CLEANSE` / `FRIENDLY_ALL`

Gameplay facts are locked and were not changed during art integration.

## Card 04 exact approved artwork

Chosen concept: **The cleansing font**.

Approved geometry:

- low, wide, faceted purification basin / reservoir;
- short stepped stone base;
- elongated / faceted / octagonal rather than circular;
- no church-font read, decorative park-fountain read, tall pedestal, central column, upward jet or circular symmetrical fountain;
- water is a cold, clear physical cleansing medium, not blue elemental magic;
- straight off-frame channels communicate `FRIENDLY_ALL` reach;
- no people or figures.

Generation id:

`f2e3d336-6db5-4d45-9d64-6bfebd8e9196`

Exact binary:

- candidate branch: `assets/rune-of-curse-breaking-candidate-v1`
- candidate HEAD: `185126c8b402dc4134245f984d9d0e7cddc6db8a`
- candidate path: `art-source/rune-of-curse-breaking.webp`
- production repository path: `apps/web/public/art/cards/rune-of-curse-breaking.webp`
- dimensions: `1024 × 1536`
- byte size / RIFF total: `438894`
- FourCC: plain `VP8 `
- SHA-256: `6f07380f1f64bee0efd8ec9819de1951dd14fd9dc127dd173ddda909b1c49dd5`
- Git blob SHA: `e1ea12a2f03cc84e9931600e978cc8bf6b1eaccb`
- full decode: PASS

The production repository copy is byte-identical to the approved candidate and was promoted without regeneration, crop, resize or re-encode.

## Card 04 eight-surface QA and owner ruling

Verified surfaces:

1. raw master 2:3
2. CardView 3:4
3. CardDetailDrawer 4:5
4. HandCardPreview 7:9
5. `/admin/art-review` desktop
6. `/admin/art-review` 390 px
7. 92 px thumbnail
8. 92 px grayscale

`CreatureSlot` is N/A for RUNE and was confirmed empirically.

Key QA facts:

- no figure;
- continuous laminar overflow;
- straight radiating channels and no closed floor rune-circle;
- rim marks ornamental rather than script;
- no text/watermark/UI;
- gold `0.00%` against a 4% limit;
- grayscale spread `142` against the >122 target;
- binding 4:5 crop fully safe;
- unique low-wide silhouette at 92 px;
- no horizontal overflow at 1440 or 390.

Owner final ruling on 2026-09-01:

1. **Dark basin/water lip accepted.** It is the highest-contrast zone but not the brightest zone. Accepted as the intentional dark anchor.
2. **Soft upper-third architecture accepted.** It exceeds the brief's literal information ceiling but remains pale, low-contrast and non-monumental.

These caveats are closed for the exact approved bytes and must not be reopened unless the artwork or rendering surfaces change.

## Card 04 repository integration on `main`

PR #41 merged these exact four files:

- `apps/web/public/art/cards/rune-of-curse-breaking.webp` — exact approved binary
- `apps/game-server/prisma/seed.ts` — Card 04 art fields only: production `artworkUrl` + `rightsStatus: 'owned'`
- `apps/web/src/app/admin/art-review/page.tsx` — Card 04 approved review row on production artwork path
- `docs/art-pack-03.md` — Card 04 repository-integration documentation

No gameplay, balance, ability text, cost, rarity, schema, migrations or other card rows were changed.

`apps/game-server/scripts/sync-production-card-art.ts` and `.github/workflows/production-card-art-sync.yml` were deliberately **not** changed in PR #41.

## Production boundary — HARD GATE

Card 04 is **not live in production yet**.

The next sequence is separate from the completed integration merge and must happen in order:

1. explicitly authorize a new repository-only task to extend the controlled sync definition from 13 → 14;
2. repoint every immutable-source pin to exact merge commit `b792be37b32f73906d104642689afaa88a47b1c2` and revalidate the full 14-card source-of-truth set;
3. audit that preparation and stop;
4. obtain a **fresh explicit one-use owner authorization** for the 14-card production sync;
5. only then dispatch the production workflow and verify pre-write / apply / post-write evidence.

Until step 4 is explicitly completed:

- do NOT dispatch production sync;
- do NOT access or mutate Railway / production DB for Card 04;
- do NOT create or consume a production confirmation string prematurely;
- do NOT reuse `SYNC-13-CARD-ART-PRODUCTION`.

## Card 03 closed production record

- PR #39 integration merge / immutable source: `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`
- PR #40 repin merge: `c3c6e0c491fb4e48c94b32749bd0474b047305c9`
- production run: `33436786024` (run #9)
- job: `99635055417`
- conclusion: success
- rows changed: exactly 1, only `warden-of-the-barrier`
- final source-of-truth: `13/13`
- `NON_TARGET_FIELD_CHANGES=0`
- `SYNC-13-CARD-ART-PRODUCTION`: CONSUMED

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

Optional cleanup once Card 04 is fully promoted: delete `transport/card04-github-actions` because it carries a `contents: write` workflow and must never be merged.
