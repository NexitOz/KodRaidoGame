# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 master-art brief **COMPLETE — AWAITING OWNER REVIEW**
- **Current target:** `seal-of-the-curse` / «Печать Проклятия»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `8a4cbec5ac56c06cc4b817c3af8b36dac9d58c06`
- **Latest handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-02-master-art-brief.md`
- **Brief:** `docs/art-review/seal-of-the-curse-master-art-brief.md` (commit `9c08a54`)
- **Prior transition report:** `docs/agent-reports/2026-08-27-art-pack-03-card-02-master-art-brief-transition.md`
- **Transition report commit:** `0ab22cf5407e174158fc5f8b700398dca1581046`
- **Branch:** `main`

## Card 01 — COMPLETE END TO END

PURIFICATION Card 01:

- slug: `acolyte-of-the-white-rune`
- name: «Послушник Белой Руны»
- CHARACTER / COMMON / cost 1 / 1/3
- visual status: **FINAL APPROVED**
- repository integration PR #35: MERGED
- immutable artwork+seed source: `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`
- production sync run: `33091769787`, job `98586183358`, conclusion **success**
- final production source of truth: `11/11`
- final remaining mutations: `0`
- non-target field changes: `0`

Production artwork:

- path: `apps/web/public/art/cards/acolyte-of-the-white-rune.webp`
- dimensions: `1024 × 1536`
- byte size: `214378`
- container: plain `VP8 `
- SHA-256: `cb76658416628f91b721c826a451342319bcfe39ff3b5f770a5f8ca73ba499fe`

Owner-accepted caveats retained in `docs/art-pack-03.md`:

1. ~2–4 px head clearance under the current 4:5 crop; re-check first if a tighter crop is introduced.
2. Rendering is more photographic than the older painterly baseline; this exact image was explicitly accepted.

`SYNC-11-CARD-ART-PRODUCTION` is **CONSUMED** and grants no future authorization. No production operation is currently authorized.

## Card 02 — canonical facts

- slug: `seal-of-the-curse`
- name: «Печать Проклятия»
- faction: PURIFICATION
- type: EVENT
- rarity: RARE
- cost: 2
- effect: apply Curse to a chosen enemy; a cursed enemy cannot attack
- Resonance: visual only

## Card 02 — locked house style

Cards 02–04 should stay consistent with the owner-approved Card 01:

- cinematic realistic / semi-realistic premium CCG;
- realistic materials and anatomy where people appear;
- crisp readable forms;
- controlled illustrative finish;
- not generic painterly fantasy;
- not sterile photobash/plastic-photo rendering.

## Card 02 — locked concept direction

The EVENT should read as **an attack being physically sealed**, not as a mage casting a spell.

Primary concept:

- close, iconic event composition;
- a generic hostile dark-steel/charcoal weapon arm and weapon are halted mid-attack;
- a rigid physical white/silver rune seal, restraint plate, or cuff has locked around the weapon hand/guard/forearm;
- engraved geometric rune lines glow softly cold pale blue-white from within the physical seal;
- the weapon clearly cannot complete its attack;
- the white/silver seal is the visual hero;
- enemy identity is generic and secondary;
- no visible PURIFICATION caster is required.

This direction may be refined in staging/camera/object geometry by the brief, but must not be replaced with an open-hand spell, beam, projectile, explosion, or generic magical shield.

## PURIFICATION locked language

- white/silver/ivory faction base;
- bright diffuse near-shadowless light;
- clean rigid/pressed material edges;
- rune magic engraved/material-bound/static;
- cold frost/light motes only;
- no crimson/red/violet/magenta/ember-orange;
- no ash/warm embers;
- no spectral echo figures;
- no SHADOW-like deep chiaroscuro;
- no ragged/tattered cloth;
- no monumental High Warden cathedral/rose-window halo competition;
- no actively cast open-palm magic;
- non-Legendary card: restrained decoration and minimal gold, never a false Legendary read.

## Card 02 brief — COMPLETE

`docs/art-review/seal-of-the-curse-master-art-brief.md` (479 lines, commit `9c08a54`). All seventeen
required sections present.

### The decision the card turns on

PURIFICATION applying a "curse" is a real contradiction: the usual crimson/violet coding for a curse
is exactly what this faction forbids. The brief resolves it by reading the Curse as a **binding, not
a taint** — the Order locks a weapon so it cannot be raised; jailer's work, not sorcery. That is the
only reading that stays inside the locked material-bound faction language, and it matches the
mechanic, since CURSE prevents attacking rather than dealing harm (verified in
`apply-action.ts`: _"This unit is cursed and cannot attack."_).

Corruption imagery — tendrils, rot, purple aura, crimson veins — is an automatic reject on **concept**
grounds, not merely palette.

### Surface finding

**An EVENT never occupies a Battlefield board slot, so `CreatureSlot` is not a review surface for
this card.** `CardPlayReveal` renders an EVENT play as a 380 ms flash of `Icon name="sword"` plus the
card name — no artwork. The art appears on exactly three surfaces: `CardView` 3:4,
`CardDetailDrawer` 4:5, `HandCardPreview` 7:9. Same situation as Art Pack 02's RUNE.

### Correction carried over from Card 01

Card 01 shipped with only ~2–4 px of clearance under the binding 4:5 cut against a briefed ~130 px.
Card 02's brief imposes a stricter working rule — **nothing essential above row 260 or below row
1280** — and makes violating it an automatic reject even though the technical 128–1408 band would
pass. The hero object sits at row ~770, effectively the 4:5 centre.

### Open decisions for owner review

1. **The binding-not-taint reading** (§1). Everything else follows from it.
2. **The seal as a hand-and-guard clamp** (§5), binding hand to hilt. A cuff on the forearm, or a
   seal struck onto the blade, would change §4, §5 and §12 together.
3. **The style clause** (§14). Card 01 shipped more photographic than the older painterly baseline
   and was accepted; this brief follows the owner's locked "cinematic realistic / semi-realistic"
   instruction. If Cards 02–04 should pull back toward painterly, change it **before** generation.

**Hard stop respected:** no image generated, no candidate art, no seed/schema/gameplay/admin/
Battlefield/sync/production change, no workflow dispatched, no production connection. Card 03 not
started. Validation was documentation-only: `git diff --check` clean, Prettier clean, all 17 sections
verified present, diff scope one new file.

## Art Pack 03 remaining cards

- Card 01 `acolyte-of-the-white-rune` — **COMPLETE END TO END**, live in production
- Card 02 `seal-of-the-curse` — **MASTER-ART BRIEF COMPLETE**, awaiting owner review
- Card 03 `warden-of-the-barrier` — not started
- Card 04 `rune-of-curse-breaking` — not started

## Previous milestone

SHADOW Art Pack 02 remains complete end to end.

## Recommended next action

Owner review of the brief, focusing on the three open decisions above.

Once approved, the next task is a generation pass against §14/§15. Image generation is **not**
available in the Claude Code session, so the master must be produced externally and landed **by
commit on a branch**, with `git cat-file -s HEAD:<path>` confirming the committed blob size _before_
pushing — the check that has caught two ~15 KB truncations on this project.

Promotion, seed changes and production sync remain **unauthorised**. `SYNC-11-CARD-ART-PRODUCTION` is
consumed; a twelfth card needs a fresh owner confirmation and a pin repointed at a new
already-merged integration commit.

## Reader protocol

1. Read this file.
2. Read `docs/CLAUDE_CURRENT_TASK.md` — its brief task is **complete** as of `9c08a54`; treat it as
   history unless the owner has replaced it.
3. Read `docs/art-review/seal-of-the-curse-master-art-brief.md` — the deliverable — and
   `docs/agent-reports/2026-08-27-art-pack-03-card-02-master-art-brief.md` for the handoff. The
   `…-transition.md` report holds the owner's original concept direction.
4. Read `docs/art-bible-01.md`, `docs/art-pack-03.md`, and `docs/content-pack-01.md`.
5. Read the Card 01 brief for crop/checklist structure, but do not copy its character composition into this EVENT.
6. Resolve fresh `main` before acting.
7. Repository state is authoritative over stale chat summaries.
