# CURRENT TASK — Art Pack 03 bootstrap: PURIFICATION Card 01 master-art brief

## Goal

Prepare one production-ready visual brief for PURIFICATION Card 01:

- **Slug:** `acolyte-of-the-white-rune`
- **Name:** `Послушник Белой Руны`
- **Type / rarity / cost:** CHARACTER / COMMON / 1
- **Stats:** 1/3
- **Ability:** on play, remove Curse and Silence from a chosen ally

This is a **brief-only task**. Do not generate, integrate, promote, or sync artwork in this task.

## Canonical starting state

SHADOW Art Pack 02 is complete end to end. Card 04 production sync already executed successfully and its one-use authorization is consumed.

Do not reopen or modify SHADOW Art Pack 02, its four approved cards, the ten-card production sync, or any existing production artwork.

PURIFICATION already has a locked faction language and an approved LEGENDARY flagship in `docs/art-bible-01.md` / `high-warden-of-the-white-rune`. Use those as the visual anchor, not as a composition to copy.

## Required work

1. Read the PURIFICATION section of `docs/art-bible-01.md` and the current PURIFICATION entries in `apps/game-server/prisma/seed.ts`.
2. Audit the approved `high-warden-of-the-white-rune` artwork and define how a **COMMON acolyte** stays unmistakably in the same faction while reading lower in rank, simpler, younger/less imposing, and less ornate.
3. Create exactly one new brief:

   `docs/art-review/acolyte-of-the-white-rune-master-art-brief.md`

4. The brief must contain:
   - card role and visual role
   - silhouette and pose
   - costume / materials
   - environment / architecture
   - lighting
   - faction palette
   - VFX / rune language
   - explicit hierarchy differences vs. `high-warden-of-the-white-rune`
   - explicit differentiation vs. SHADOW
   - crop-safe composition for the 1024×1536 master through 3:4, 7:9, and 4:5 shipped crops
   - mobile / thumbnail readability requirements
   - forbidden drift list
   - ready-to-use generation prompt
   - negative prompt
   - production acceptance checklist
5. Keep the scope surgical. Do not create Art Pack 03 assets or change application code.

## Locked PURIFICATION direction

Carry forward the existing faction language from `docs/art-bible-01.md`:

- white / silver / ivory base
- restrained gold filigree; for this COMMON card, gold must be noticeably quieter than on the LEGENDARY flagship so it does not fake a rarity signal
- clean pressed armor / cloth edges, never tattered
- bright diffuse near-shadowless lighting, opposite SHADOW chiaroscuro
- cold light / frost motes only, never warm embers
- rune magic is engraved, architectural, or material-bound rather than an actively cast open-palm effect
- monumental/sacred geometry may inform the setting, but the acolyte must not visually compete with the High Warden's flagship cathedral-halo composition
- no crimson/red or violet accents
- no spectral echo crowd device

The brief should deliberately scale the faction language down to a COMMON unit rather than making a miniature High Warden.

## Hard scope exclusions

Do not modify:

- `apps/game-server/prisma/seed.ts`
- Prisma schema or migrations
- gameplay, balance, card text, effects, rarity, cost, stats, faction
- any artwork file
- `/admin/art-review` code
- Battlefield UI
- production sync script or workflow
- Railway / Vercel configuration
- production database
- existing Art Pack 01 or Art Pack 02 approved assets

## Validation

Because this is documentation-only:

- verify the diff contains only the intended brief plus required handoff metadata
- run/record `git diff --check`
- run Prettier check on the new brief if available
- no application lint/typecheck/test/build is required unless the task unexpectedly touches application/config files, which it should not

## Delivery

Follow the permanent `CLAUDE.md` Agent Handoff Protocol.

If the task is done without a PR, save the handoff under `docs/agent-reports/` and update `docs/AGENT_STATE.md` last.

Do not proceed to image generation or Card 01 integration. Stop after the brief is complete and handed off for owner review.