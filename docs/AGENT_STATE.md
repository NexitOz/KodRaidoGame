# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Cards 01, 02 and 03 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 04 **INTEGRATION PR OPEN — READY FOR OWNER MERGE APPROVAL**, not merged, not synced
- **Current target:** `rune-of-curse-breaking` / «Руна Разрушения Проклятий»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `1c7470dd8c17f64a294b600aa302429ad8c4f6ac`
- **Current task type:** prepare narrow Card 04 repository integration PR; no merge and no production sync
- **Latest owner approval:** `docs/agent-reports/2026-09-01-art-pack-03-card-04-post-qa-owner-approval.md`
- **Latest QA report:** `docs/agent-reports/2026-08-31-art-pack-03-card-04-candidate-qa.md`
- **Candidate branch:** `assets/rune-of-curse-breaking-candidate-v1`
- **Candidate HEAD:** `185126c8b402dc4134245f984d9d0e7cddc6db8a`
- **Integration PR:** **#41** — OPEN / NOT MERGED — `https://github.com/NexitOz/KodRaidoGame/pull/41`
- **Integration branch:** `claude/integrate-rune-of-curse-breaking-art`
- **Integration base SHA:** `c8e34b6cdcb3b42943cdfafc47eb0d58c136c8c9`
- **Integration head SHA:** `b69b3893d359ccb8b1742b901969a0d3a23e4b5f`
- **Latest task-result commit:** `b69b3893d359ccb8b1742b901969a0d3a23e4b5f`
- **PR handoff report:** PR #41 comment `## AGENT HANDOFF — FINAL REPORT` (`#issuecomment-5500075876`), plus a head-SHA correction (`#issuecomment-5500081791`)
- **Integration CI:** run `33555928983` — success
- **Open blocker:** **OWNER MERGE APPROVAL OF PR #41.**
- **Card 04 repository integration authorized:** PR PREPARATION ONLY
- **Card 04 integration PR merge authorized:** NO
- **Production operation authorized:** NO
- **Card 04 production sync authorized:** NO
- **`SYNC-13-CARD-ART-PRODUCTION`:** **CONSUMED — MUST NOT BE REUSED**

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 02 `seal-of-the-curse` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 03 `warden-of-the-barrier` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 04 `rune-of-curse-breaking` — **FINAL OWNER APPROVED AFTER QA; integration PR next; not yet live in production**

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

## Card 04 canonical card facts

- slug: `rune-of-curse-breaking`
- name: «Руна Разрушения Проклятий»
- faction/tag: PURIFICATION / `Purification`
- type: `RUNE`
- rarity: `EPIC`
- cost: `3`
- ability: `В начале каждого вашего хода снимите Проклятие и Заглушение со всех союзников.`
- mechanic: `TURN_START` → `CLEANSE` / `FRIENDLY_ALL`

Gameplay facts are locked and must not be edited during art integration.

## Card 04 approved visual source

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

## Card 04 exact approved binary

Exact candidate:

- branch: `assets/rune-of-curse-breaking-candidate-v1`
- HEAD: `185126c8b402dc4134245f984d9d0e7cddc6db8a`
- asset path: `art-source/rune-of-curse-breaking.webp`
- dimensions: `1024 × 1536`
- byte size / RIFF total: `438894`
- FourCC: plain `VP8 `
- SHA-256: `6f07380f1f64bee0efd8ec9819de1951dd14fd9dc127dd173ddda909b1c49dd5`
- Git blob SHA: `e1ea12a2f03cc84e9931600e978cc8bf6b1eaccb`
- full decode: PASS

Transport commit:

`7234e7a0c1341bc543bb4d11b7823ce19acc94c4`

Review-row commit:

`185126c8b402dc4134245f984d9d0e7cddc6db8a`

The candidate branch is two commits ahead of the reserved task base and contains only the exact approved WebP plus the +8-line candidate review-row change.

## Card 04 transport proof

GitHub-hosted Actions runner route:

- transport branch: `transport/card04-github-actions`
- run: `33553187344`
- conclusion: success
- **must not be merged into main**

The workflow and independent candidate QA proved the exact size, SHA-256, Git blob SHA, RIFF total, FourCC, dimensions and full decode before and after Git push/fetch.

## Card 04 eight-surface QA

Status before owner ruling: `READY FOR OWNER VISUAL APPROVAL`.

Verified surfaces:

1. raw master 2:3
2. CardView 3:4
3. CardDetailDrawer 4:5
4. HandCardPreview 7:9
5. `/admin/art-review` desktop
6. `/admin/art-review` 390 px
7. 92 px thumbnail
8. 92 px grayscale

`CreatureSlot` is N/A for RUNE and was confirmed empirically from the live review row.

Key QA facts:

- no figure;
- continuous laminar overflow;
- straight radiating channels and no closed floor rune-circle;
- rim marks are ornamental rather than script;
- no text/watermark/UI;
- gold `0.00%` against a 4% limit;
- grayscale spread `142` against the >122 target;
- binding 4:5 crop fully safe;
- unique low-wide silhouette at 92 px;
- no horizontal overflow at 1440 or 390.

## Card 04 post-QA owner ruling — FINAL

On 2026-09-01 the owner explicitly approved the exact candidate **after** the eight-surface QA and accepted both reported caveats without artwork modification:

1. **Dark basin/water lip accepted.** It is the highest-contrast zone but not the brightest zone. This is accepted as the image's dark anchor and supports the measured thumbnail separation.
2. **Soft upper-third architecture accepted.** It exceeds the brief's literal information ceiling but stays pale, low-contrast, collapses at 92 px and does not introduce forbidden monumental/cathedral cues.

These two caveats are closed for the exact approved bytes. Do not reopen them during integration unless the bytes or rendering surfaces change.

Approval record:

`docs/agent-reports/2026-09-01-art-pack-03-card-04-post-qa-owner-approval.md`

## Current authorized task — integration PR only

Execute `docs/CLAUDE_CURRENT_TASK.md` @ `1c7470dd8c17f64a294b600aa302429ad8c4f6ac`.

Required intent:

1. fresh `main`;
2. re-verify exact candidate bytes from `assets/rune-of-curse-breaking-candidate-v1`;
3. create fresh integration branch;
4. do **not** merge/cherry-pick candidate branch wholesale;
5. copy exact bytes to `apps/web/public/art/cards/rune-of-curse-breaking.webp`;
6. update only Card 04 seed artwork fields to production path + `rightsStatus: 'owned'`;
7. add approved Card 04 row to `/admin/art-review` with production `reviewArtworkUrl`;
8. update `docs/art-pack-03.md` truthfully as repository-integrated / not yet production-synced;
9. validate and create PR;
10. leave `## AGENT HANDOFF — FINAL REPORT` on PR;
11. update this file last to `READY FOR OWNER MERGE APPROVAL` and fetch-verify;
12. stop without merging.

## Hard safety state

Do NOT:

- regenerate, edit, crop, resize or re-encode Card 04 artwork;
- merge the candidate or transport branch wholesale;
- alter Card 04 gameplay/balance fields or any other card seed row;
- merge the integration PR without a new owner decision;
- extend/modify/dispatch production artwork sync in this task;
- create/consume a production confirmation string;
- access or mutate Railway, Vercel or production DB;
- reuse `SYNC-13-CARD-ART-PRODUCTION`;
- begin another card.

## Production boundary after repository integration

After the integration PR is audited and separately approved/merged, production sync becomes a separate 14-card operation. It will require a **new exact one-use owner confirmation**. `SYNC-13-CARD-ART-PRODUCTION` is permanently consumed and invalid for Card 04.

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

## Card 04 integration PR #41 — open, awaiting owner merge

Exactly four files, +103/−7:

- `apps/web/public/art/cards/rune-of-curse-breaking.webp` — the approved binary
- `apps/game-server/prisma/seed.ts` — +3 lines, art fields only
- `apps/web/src/app/admin/art-review/page.tsx` — +8 lines, `ART PACK 03 — APPROVED 04`
- `docs/art-pack-03.md` — Card 04 recorded FINAL OWNER APPROVED / integration in review

Production-path artwork: `438894` bytes, SHA-256
`6f07380f1f64bee0efd8ec9819de1951dd14fd9dc127dd173ddda909b1c49dd5`, Git blob
`e1ea12a2f03cc84e9931600e978cc8bf6b1eaccb` — **identical to the candidate's blob**, taken with
`git show` from the candidate object, so byte-identity is proven rather than hash-matched.

Validation green: prettier, typecheck and lint on both workspaces, 32/32 web tests, 156/156
game-server tests, both builds, CI run `33555928983`.

### Sync 13 → 14 deliberately NOT done

`apps/game-server/scripts/sync-production-card-art.ts` and
`.github/workflows/production-card-art-sync.yml` are **unchanged** — verified with `git diff --quiet`
against `main`. This task's hard exclusions forbade extending the sync, so unlike Card 03 the
integration PR carries no sync change at all. **Card 04 is not live in production.**

## Next after PR #41 merges

Three separate, separately-authorized steps, in order:

1. extend the controlled sync definition 13 → 14 in repository code;
2. repoint every immutable-source pin to the exact merge commit and revalidate;
3. obtain a fresh explicit owner authorization for a 14-card production sync.

`SYNC-13-CARD-ART-PRODUCTION` remains **CONSUMED** and must never be reused. Optional cleanup once
Card 04 is promoted: delete `transport/card04-github-actions` (carries a `contents: write` workflow,
must never be merged).
