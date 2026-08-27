# CURRENT TASK — Art Pack 03 Card 02: master-art brief

## Goal

Create the detailed master-art brief for PURIFICATION Card 02:

- slug: `seal-of-the-curse`
- name: «Печать Проклятия»
- EVENT / RARE / cost 2
- gameplay meaning: apply Curse to a chosen enemy; cursed enemy cannot attack
- Resonance: visual only

Write the brief to:

`docs/art-review/seal-of-the-curse-master-art-brief.md`

## Canonical inputs

Read first:

- `docs/AGENT_STATE.md`
- `docs/art-bible-01.md`
- `docs/art-pack-03.md`
- `docs/art-review/acolyte-of-the-white-rune-master-art-brief.md`
- `docs/agent-reports/2026-08-27-art-pack-03-card-02-master-art-brief-transition.md`
- `docs/content-pack-01.md`

Do not re-derive the card's gameplay or faction identity from memory.

## Locked house style

Cards 02–04 should stay consistent with the owner-approved Card 01:

- cinematic realistic / semi-realistic premium CCG;
- realistic materials and anatomy where people appear;
- crisp readable forms;
- controlled illustrative finish;
- do not regress to generic painterly fantasy;
- do not become sterile photobash/plastic-photo rendering.

## Locked concept direction

The EVENT must read as **an attack being physically sealed**, not as a caster throwing magic.

Primary concept:

- close, iconic event composition;
- a generic hostile dark-steel/charcoal weapon arm and weapon are halted mid-attack;
- a rigid physical white/silver rune seal, restraint plate, or cuff has locked around the weapon hand/guard/forearm;
- engraved geometric rune lines inside the physical seal glow softly cold pale blue-white;
- the weapon clearly cannot complete its attack;
- the white/silver seal is the visual hero;
- enemy identity remains generic and secondary;
- no visible PURIFICATION caster is required.

The brief may refine staging, camera, exact object geometry and environment, but must not replace this core story with an open-hand spell, beam, projectile, explosion, or generic magical shield.

## PURIFICATION constraints

Preserve the locked faction language:

- white/silver/ivory dominant faction materials;
- bright diffuse near-shadowless illumination;
- clean pressed/rigid material edges;
- rune magic engraved/material-bound/static;
- cold frost/light motes only;
- no crimson/red/violet/magenta/ember-orange;
- no ash/warm embers;
- no spectral echo figures;
- no SHADOW-like deep chiaroscuro;
- no ragged/tattered cloth;
- no monumental High Warden cathedral/rose-window halo composition;
- no actively cast open-palm magic;
- non-Legendary rarity: restrained decoration and minimal gold, never a false Legendary read.

## Composition / crop requirements

Use the established 1024×1536 vertical 2:3 master and current centered `object-cover` crop rules:

- CardView / CreatureSlot 3:4;
- HandCardPreview 7:9;
- CardDetailDrawer 4:5 is binding;
- essential story must survive inside the middle ~83% vertical safe zone;
- the seal, weapon-lock read and any necessary hand/forearm geometry must survive at 92px thumbnail size.

Because this is an EVENT rather than a character portrait, explicitly define what becomes the primary focal point, secondary focal point and background hierarchy at thumbnail scale.

## Required brief contents

The brief must include at minimum:

1. card/gameplay summary;
2. visual thesis in one sentence;
3. focal hierarchy;
4. exact scene and action staging;
5. seal object/material design;
6. enemy arm/weapon treatment and how to keep it faction-neutral;
7. environment;
8. lighting/value structure;
9. palette and gold budget;
10. rune/VFX language;
11. rarity hierarchy versus Common Acolyte and Legendary High Warden;
12. 2:3 composition and crop-safe geometry;
13. mobile/92px readability test;
14. exact generation prompt;
15. exact negative prompt;
16. automatic reject conditions;
17. final acceptance checklist.

## Hard scope

This task is documentation only.

Do NOT:

- generate an image;
- add candidate art;
- change `seed.ts`;
- change Prisma/schema/migrations;
- change gameplay, stats, text, effects or rarity;
- change `/admin/art-review` code;
- touch Battlefield UI;
- touch sync scripts/workflows;
- connect to Railway/Vercel/production DB;
- dispatch any workflow;
- begin Card 03.

## Delivery

1. Create `docs/art-review/seal-of-the-curse-master-art-brief.md`.
2. Create a durable handoff report under `docs/agent-reports/`.
3. Update `docs/AGENT_STATE.md` last.
4. Fetch back the final state from GitHub and verify it.
5. Stop for owner review of the brief before any art generation.
