# CURRENT TASK — Art Pack 03 Card 04: close Card 03 docs + prepare master-art brief

## Owner authorization

The owner explicitly advanced the project on **2026-08-31** after Card 03 was independently verified LIVE IN PRODUCTION.

This authorizes exactly:

1. repository/documentation housekeeping needed to close Card 03 accurately;
2. Art Pack 03 Card 04 **art-direction research, master-art brief, and generation package preparation**.

It does **not** authorize Card 04 image generation by Claude, candidate intake, production-path integration, sync extension, workflow dispatch, Railway/production DB access, or any production mutation.

## Status entering this task

Cards 01–03 are **COMPLETE END TO END — LIVE IN PRODUCTION**.

Card 03 production sync evidence:

- workflow run: `33436786024` (run #9)
- job: `99635055417`
- conclusion: `success`
- dispatched on `main` @ `80a751be8737a12e23f235989b2ca435bc30b420`
- immutable source: `8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`
- PRE-WRITE: `TARGET_ROWS=13`, `UNIQUE_SLUGS=13`, `ROWS_REQUIRING_MUTATION=1`, `SOURCE_OF_TRUTH_MATCH=12/13`
- APPLY: `TRANSACTION_COMMITTED=YES`, `ROWS_CHANGED=1`, `TARGET_ROWS_FINAL=13`, `SOURCE_OF_TRUTH_MATCH=13/13`, `NON_TARGET_FIELD_CHANGES=0`
- POST-WRITE: `ROWS_REQUIRING_MUTATION=0`, `SOURCE_OF_TRUTH_MATCH=13/13`
- only changed row: `warden-of-the-barrier`
- `SYNC-13-CARD-ART-PRODUCTION`: **CONSUMED — MUST NOT BE REUSED**

## Card 04 canonical facts

Read them from current `main` and verify before writing the brief. Expected canonical values are:

- slug: `rune-of-curse-breaking`
- name: «Руна Разрушения Проклятий»
- faction/tag: PURIFICATION / `Purification`
- type: `RUNE`
- rarity: `EPIC`
- cost: `3`
- ability: `В начале каждого вашего хода снимите Проклятие и Заглушение со всех союзников.`
- mechanic: `TURN_START` → `CLEANSE` / `FRIENDLY_ALL`

Do not change gameplay, wording, cost, rarity, mechanic, schema, or seed data in this task.

## Required work

### A. Close Card 03 documentation accurately

Update `docs/art-pack-03.md` so the pack no longer claims Card 03 is "integration in review" or "not live in production".

Required corrections:

- top pack status: Cards 01, 02 and 03 live in production; Card 04 is next / brief in preparation;
- Card 03 heading/status: **COMPLETE END TO END — LIVE IN PRODUCTION**;
- replace obsolete Card 03 pre-production / deliberately-not-runnable 12→13 wording with the actual successful production sync facts listed above;
- record `SYNC-13-CARD-ART-PRODUCTION` as CONSUMED;
- preserve useful historical Card 01/02 records and do not rewrite unrelated sections merely for style.

After editing, search the file for stale contradictory Card 03 phrases such as:

- `integration in review`
- `Not live in production`
- `RESERVED, NOT AUTHORIZED, NOT CONSUMED`
- `PREPARED, DELIBERATELY NOT RUNNABLE`

No stale statement may remain if it describes the current Card 03 state.

### B. Research Card 04 before proposing art

Read and compare at minimum:

- `docs/art-bible-01.md` PURIFICATION language;
- `docs/art-pack-03.md` after housekeeping;
- Card 01 brief: `docs/art-review/acolyte-of-the-white-rune-master-art-brief.md`;
- Card 02 brief: `docs/art-review/seal-of-the-curse-master-art-brief.md`;
- Card 03 brief: `docs/art-review/warden-of-the-barrier-master-art-brief.md`;
- current seed entry for `rune-of-curse-breaking`;
- real UI/component behavior for `RUNE` cards, including every shipped crop/review surface that actually applies.

Do not infer Card 04's review surfaces from CHARACTER or EVENT cards. Verify them from the implementation and document the exact surface set.

### C. Lock a distinct Card 04 concept

Card 04 must read as PURIFICATION and EPIC while remaining clearly different from already approved silhouettes:

- Card 01: small white-stone rune tablet / novice character;
- Card 02: engineered binding clamp on an enemy weapon;
- Card 03: planted segmented ward-screen;
- flagship: large round rune shield / ceremonial guardian language.

The mechanic is persistent and recurring (`TURN_START` every turn), so the visual concept should read as an **enduring cleansing rune/ward**, not a one-frame attack, explosion, or hand-cast spell.

Use the established PURIFICATION material/palette rules from the art bible and approved cards. Do not import SHADOW / VEIL / COSMIC language. Rarity should read as **EPIC**, above the two RARE cards in complexity and authority but below the faction's LEGENDARY flagship.

Before locking the brief, evaluate at least 3 distinct concept families against:

- mechanic fidelity;
- uniqueness versus Cards 01–03 and flagship;
- 92 px silhouette/readability;
- crop safety;
- faction fidelity;
- EPIC rarity read without overstepping into LEGENDARY ceremonial language.

Choose one recommended concept and explain why the rejected alternatives are weaker.

### D. Create the production-grade art brief

Create:

`docs/art-review/rune-of-curse-breaking-master-art-brief.md`

The brief must be specific enough for deterministic generation/review and include at minimum:

- canonical card facts and mechanic interpretation;
- chosen visual thesis and uniqueness rationale;
- focal hierarchy;
- composition / camera / object placement;
- exact material language;
- lighting and palette constraints;
- rarity hierarchy versus Common/Rare/Legendary references;
- environment information ceiling;
- crop-safe zones based on the real RUNE surfaces;
- 92 px thumbnail/grayscale expectations;
- explicit automatic-reject conditions;
- acceptance checklist;
- no text, lettering, watermark, signature, logo, UI, stats, or baked card frame in master art.

Do not weaken established faction restrictions merely to make generation easier.

### E. Create the generation package

Create:

`docs/art-review/rune-of-curse-breaking-generation-package.md`

It must contain:

- concise generation thesis;
- approved-format master target (use the project-standard vertical master unless verified RUNE implementation requires otherwise);
- positive generation prompt;
- negative prompt / forbidden elements;
- composition and crop anchors;
- an explicit instruction that **Claude does not generate the image**;
- handoff note that ChatGPT/image generation is the art-generation owner after owner brief approval.

### F. Validation and durable handoff

- run `git diff --check`;
- run targeted formatting/docs checks if available;
- audit that only documentation/art-direction files changed;
- do not alter application code, seed, workflow, artwork bytes, schema, migrations, or production data;
- leave a durable report at:
  `docs/agent-reports/2026-08-31-art-pack-03-card-04-master-art-brief.md`;
- if working through a PR, also leave the standard `## AGENT HANDOFF — FINAL REPORT` comment;
- update `docs/AGENT_STATE.md` **LAST**, then fetch it back from GitHub and verify it.

## Hard exclusions

Do NOT:

- generate or edit Card 04 imagery;
- create a candidate art binary;
- integrate any Card 04 production artwork path;
- modify Card 04 gameplay or seed data;
- extend the production artwork sync 13→14;
- create or consume any production confirmation string;
- dispatch GitHub Actions production sync;
- access or mutate Railway/Vercel production or production DB;
- delete old transport/candidate branches in this task.

## Final gate

End at exactly one of:

- **READY FOR OWNER CARD 04 BRIEF APPROVAL**
- **BLOCKED / REJECTED**

If READY, report the chosen concept, exact RUNE review surfaces, brief path, generation-package path, durable report path, branch/commit or PR information, and confirm that no image generation or production operation occurred.
