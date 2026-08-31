# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Cards 01, 02 and 03 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 04 **OWNER-APPROVED MASTER EXISTS — CANDIDATE INTAKE / EIGHT-SURFACE QA NEXT**
- **Current target:** `rune-of-curse-breaking` / «Руна Разрушения Проклятий»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `379f5fcf82c9cde3f9f4af62c1519a4a772f619f`
- **Current task type:** Card 04 approved-master binary intake + review only
- **Candidate branch:** `assets/rune-of-curse-breaking-candidate-v1`
- **Card 04 repository integration authorized:** NO
- **Production operation authorized:** NO
- **Card 04 production sync authorized:** NO
- **`SYNC-13-CARD-ART-PRODUCTION`:** **CONSUMED — MUST NOT BE REUSED**

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 02 `seal-of-the-curse` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 03 `warden-of-the-barrier` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 04 `rune-of-curse-breaking` — **MASTER OWNER-APPROVED; CANDIDATE QA NOT YET COMPLETE**

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

Card 03 is closed. Do not reopen accepted visual caveats or rerun its production sync without a completely new owner decision and authorization.

## Card 04 canonical facts

- slug: `rune-of-curse-breaking`
- name: «Руна Разрушения Проклятий»
- faction/tag: PURIFICATION / `Purification`
- type: `RUNE`
- rarity: `EPIC`
- cost: `3`
- ability: `В начале каждого вашего хода снимите Проклятие и Заглушение со всех союзников.`
- mechanic: `TURN_START` → `CLEANSE` / `FRIENDLY_ALL`

Gameplay facts are locked and must not be edited during art work.

## Card 04 brief / generation package

- brief: `docs/art-review/rune-of-curse-breaking-master-art-brief.md`
- generation package: `docs/art-review/rune-of-curse-breaking-generation-package.md`
- brief research report: `docs/agent-reports/2026-08-31-art-pack-03-card-04-master-art-brief.md`
- owner approval record: `docs/agent-reports/2026-08-31-art-pack-03-card-04-owner-approval.md`
- chosen concept: **The cleansing font**
- owner decision: **FINAL OWNER APPROVED**

Owner-approved geometry refinement:

- low, wide, faceted purification basin / reservoir;
- short stepped stone base;
- elongated / faceted / octagonal rather than circular;
- no church-font read, decorative park-fountain read, tall pedestal, central column, upward jet or circular symmetrical fountain;
- water is physical cleansing medium, not a blue elemental faction identity;
- straight off-frame water channels are the `FRIENDLY_ALL` reach device;
- no people or figures.

## Card 04 approved generated master

Generation id:

`f2e3d336-6db5-4d45-9d64-6bfebd8e9196`

Approved source PNG:

- dimensions: `1024 × 1536`
- RGB
- byte size: `2676337`

Approved transport WebP produced without crop, resize or recomposition:

- filename: `rune-of-curse-breaking.webp`
- dimensions: `1024 × 1536`
- FourCC: plain `VP8 `
- byte size / RIFF declared total: `438894`
- SHA-256: `6f07380f1f64bee0efd8ec9819de1951dd14fd9dc127dd173ddda909b1c49dd5`
- expected Git blob SHA: `e1ea12a2f03cc84e9931600e978cc8bf6b1eaccb`
- full decode: PASS

Temporary byte-preserving share, expires 2026-09-14:

`https://firestorage.ai/ja/f/8hmlyOzbah75`

The candidate branch is reserved and currently contains the latest pre-state task/approval commits but no approved binary yet:

`assets/rune-of-curse-breaking-candidate-v1`

If the approved file cannot be retrieved byte-exactly in the executing environment, stop and report **BLOCKED — APPROVED BINARY TRANSPORT REQUIRED**. Never substitute or regenerate.

## Card 04 review surfaces — EIGHT

Verified from implementation. RUNE artwork does not render in `RuneZone` or `CardPlayReveal`, and `CreatureSlot` is N/A.

Required surfaces:

1. raw master 2:3
2. CardView 3:4
3. CardDetailDrawer 4:5
4. HandCardPreview 7:9
5. `/admin/art-review` desktop
6. `/admin/art-review` 390 px
7. 92 px thumbnail
8. 92 px grayscale

## Current authorized task

Execute `docs/CLAUDE_CURRENT_TASK.md` exactly.

Candidate intake may verify/stage the approved binary and run all eight review surfaces. It may not modify artwork or cross the owner visual approval gate.

## Role split

- **ChatGPT / image generation:** creates or edits imagery and owns artistic regeneration.
- **Claude/Codex:** repository research, binary intake, QA, integration and production tooling only when separately authorized.

Claude must not generate, redesign or silently repair Card 04 artwork.

## Hard safety state

Do NOT:

- substitute/regenerate Card 04 imagery;
- integrate into `apps/web/public/art/cards/`;
- alter `seed.ts`, `artworkUrl`, `rightsStatus`, gameplay, schema or migrations;
- extend production artwork sync 13 → 14;
- dispatch production workflows;
- access/mutate Railway, Vercel or production DB;
- delete historical transport/candidate branches in this task;
- reuse `SYNC-13-CARD-ART-PRODUCTION`.

## Current final gate

The Card 04 candidate task must end at exactly one of:

- **READY FOR OWNER VISUAL APPROVAL**
- **REJECTED / BLOCKED**
- **BLOCKED — APPROVED BINARY TRANSPORT REQUIRED**
