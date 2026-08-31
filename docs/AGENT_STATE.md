# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Cards 01, 02 and 03 **COMPLETE END TO END — LIVE IN PRODUCTION**; Card 04 **AUTHORIZED FOR DOCS + MASTER-ART BRIEF PREPARATION ONLY**
- **Current target:** `rune-of-curse-breaking` / «Руна Разрушения Проклятий»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `2e2f9878d0cc98e4d2a76d0d9c88435d44af8426`
- **Current task type:** Card 03 documentation housekeeping + Card 04 art-direction research / brief / generation package
- **Card 04 image generation authorized:** NO — generation remains a ChatGPT/image-generation step after owner brief approval
- **Card 04 repository integration authorized:** NO
- **Production operation authorized:** NO
- **Card 04 production sync authorized:** NO
- **`SYNC-13-CARD-ART-PRODUCTION`:** **CONSUMED — MUST NOT BE REUSED**

## Art Pack 03 progress

- Card 01 `acolyte-of-the-white-rune` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 02 `seal-of-the-curse` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 03 `warden-of-the-barrier` — **COMPLETE END TO END, LIVE IN PRODUCTION**
- Card 04 `rune-of-curse-breaking` — **BRIEF PREPARATION AUTHORIZED / NOT YET OWNER-APPROVED**

## Card 03 closed production record

Card 03 exact approved artwork:

- canonical path: `apps/web/public/art/cards/warden-of-the-barrier.webp`
- Git blob SHA: `c4cb3f4e41f349e86b044712f267f9fdc678aa86`
- dimensions: `1024 × 1536`
- FourCC: plain `VP8 `
- byte size / RIFF total: `193038`
- SHA-256: `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`
- owner approval: FINAL APPROVED
- all required candidate/production-path QA surfaces: PASS

Repository integration / repin:

- PR #39 merge / immutable source: `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`
- PR #40 repin merge: `c3c6e0c491fb4e48c94b32749bd0474b047305c9`
- all three active 13-card immutable-source pins resolve to `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`

Production sync 12 → 13:

- workflow run: `33436786024` (run #9)
- job: `99635055417`
- event: `workflow_dispatch`
- conclusion: **success**
- dispatched on `main` @ `80a751be8737a12e23f235989b2ca435bc30b420`
- `ARTWORK_FILES_PRESENT=13/13`
- production scope/read-only connectivity gates: PASS
- PRE-WRITE: `TARGET_ROWS=13`, `UNIQUE_SLUGS=13`, `ROWS_REQUIRING_MUTATION=1`, `SOURCE_OF_TRUTH_MATCH=12/13`
- changed row: only `warden-of-the-barrier`, placeholder → `/art/cards/warden-of-the-barrier.webp`, `placeholder` → `owned`
- APPLY: `TRANSACTION_COMMITTED=YES`, `ROWS_CHANGED=1`, `TARGET_ROWS_FINAL=13`, `SOURCE_OF_TRUTH_MATCH=13/13`, `NON_TARGET_FIELD_CHANGES=0`
- POST-WRITE: `ROWS_REQUIRING_MUTATION=0`, `SOURCE_OF_TRUTH_MATCH=13/13`
- durable report: `docs/agent-reports/2026-08-31-art-pack-03-card-03-production-sync.md`
- `SYNC-13-CARD-ART-PRODUCTION`: **CONSUMED**

Card 03 is closed. Do not reopen accepted visual caveats or repeat its production sync without a completely new owner decision and authorization.

## Card 04 canonical facts

Expected from current `main`, to be re-verified by the executing agent before writing the brief:

- slug: `rune-of-curse-breaking`
- name: «Руна Разрушения Проклятий»
- faction/tag: PURIFICATION / `Purification`
- type: `RUNE`
- rarity: `EPIC`
- cost: `3`
- ability: `В начале каждого вашего хода снимите Проклятие и Заглушение со всех союзников.`
- mechanic: `TURN_START` → `CLEANSE` / `FRIENDLY_ALL`

These gameplay facts are locked and must not be edited during art work.

## Current authorized task

Execute `docs/CLAUDE_CURRENT_TASK.md` exactly.

The task must:

1. correct stale Card 03 wording in `docs/art-pack-03.md` using the verified successful production run;
2. research real RUNE rendering/review surfaces from implementation;
3. compare at least three distinct Card 04 visual concept families;
4. lock one recommended PURIFICATION / EPIC concept that does not duplicate Card 01 tablet, Card 02 clamp, Card 03 planted ward-screen, or the Legendary round shield;
5. create:
   - `docs/art-review/rune-of-curse-breaking-master-art-brief.md`
   - `docs/art-review/rune-of-curse-breaking-generation-package.md`
   - `docs/agent-reports/2026-08-31-art-pack-03-card-04-master-art-brief.md`
6. perform documentation/repository validation only;
7. update this file LAST and fetch it back.

## Role split

- **ChatGPT / image generation:** creates or edits Card 04 imagery after owner approves the brief.
- **Claude/Codex:** repository research, brief/package documentation, candidate intake, QA, integration, production tooling when separately authorized.

Claude must not generate or creatively replace Card 04 artwork in the current task.

## Hard safety state

Do NOT:

- generate Card 04 imagery in Claude;
- create or integrate a Card 04 binary candidate;
- alter `seed.ts`, gameplay, schema, migrations, or artwork bytes;
- extend production artwork sync 13 → 14;
- dispatch production workflows;
- access/mutate Railway or production DB;
- delete historical transport/candidate branches in this task;
- reuse `SYNC-13-CARD-ART-PRODUCTION`.

## Current final gate

The Card 04 brief task must end at exactly one of:

- **READY FOR OWNER CARD 04 BRIEF APPROVAL**
- **BLOCKED / REJECTED**
