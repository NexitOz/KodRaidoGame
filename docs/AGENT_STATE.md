# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first; then `docs/CLAUDE_CURRENT_TASK.md`; after each completed task update this file last and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 01 master-art brief READY FOR AGENT EXECUTION
- **Current target:** `acolyte-of-the-white-rune` / «Послушник Белой Руны»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task-result commit:** `8e97d32d4bd83299ae397eba11d10edba1ea3f96`
- **Latest handoff report:** `docs/agent-reports/2026-08-27-art-pack-03-card-01-task-transition.md`
- **Latest handoff report commit:** `3f8248f00aa854dcbf28f66dd1b25955cd6be339`
- **Branch:** `main`
- **PR:** none for the task transition

## Current task scope

The next task is deliberately short and documentation-only:

Prepare `docs/art-review/acolyte-of-the-white-rune-master-art-brief.md` for PURIFICATION Card 01.

The brief must carry forward the locked PURIFICATION language from `docs/art-bible-01.md` while making the card read as a COMMON acolyte rather than a miniature copy of the LEGENDARY `high-warden-of-the-white-rune`.

Required brief content includes:

- visual/card role
- silhouette and pose
- costume/materials
- architecture/environment
- lighting and palette
- rune/VFX language
- hierarchy difference vs. High Warden
- differentiation vs. SHADOW
- 1024×1536 master crop safety through shipped 3:4, 7:9, and 4:5 surfaces
- mobile/thumbnail readability
- forbidden drift
- ready generation prompt + negative prompt
- production acceptance checklist

**Hard stop:** this task ends after the brief and handoff. No image generation, artwork integration, seed/DB/UI changes, or production sync work in the same task.

## Previous milestone — SHADOW Art Pack 02 COMPLETE

SHADOW Art Pack 02 is complete end to end. Do not reopen it as current work.

Cards 01–04 are FINAL APPROVED:

1. `whisper-of-the-forgotten`
2. `ashen-blade`
3. `keeper-of-smoldering-embers`
4. `rune-of-the-echoing-dusk`

Card 04 production artwork:

- path: `apps/web/public/art/cards/rune-of-the-echoing-dusk.webp`
- SHA-256: `319bdccc4dad399e3f048bf4aa095910c1fd255f453387a8604e1022734eb858`
- file size / RIFF total: `351690` bytes
- dimensions: `1024x1536`
- merge / immutable source: `23e83c9978a9045059d3009eb1983b17f005d1d3`

Production sync run `32778836668` / job `97596072990` succeeded. Final source-of-truth was `10/10`; exactly one row (`rune-of-the-echoing-dusk`) changed from placeholder artwork status to `/art/cards/rune-of-the-echoing-dusk.webp` / `owned`; non-target field changes were `0`.

The one-use confirmation `SYNC-10-CARD-ART-PRODUCTION` is **CONSUMED**. It must never be treated as standing authorization for a future production sync. Any future sync requires a fresh owner confirmation and repointed immutable-source pins.

## PURIFICATION canonical starting point

The faction already has an owner-approved LEGENDARY flagship:

- `high-warden-of-the-white-rune` / «Верховная Хранительница Руны»
- production artwork is live and owned
- visual language is locked in `docs/art-bible-01.md`

The unfinished PURIFICATION cards in seed order are:

1. `acolyte-of-the-white-rune` — CHARACTER / COMMON / cost 1 / 1/3
2. `seal-of-the-curse` — EVENT / RARE / cost 2
3. `warden-of-the-barrier` — CHARACTER / RARE / cost 3 / 2/5
4. `rune-of-curse-breaking` — RUNE / EPIC / cost 3

The current task covers **only #1's master-art brief**.

## Locked PURIFICATION direction for Card 01

Carry forward:

- white / silver / ivory base
- restrained gold, noticeably quieter than the LEGENDARY flagship on a COMMON card
- clean pressed armor / cloth edges, never tattered
- bright diffuse near-shadowless lighting
- cold light / frost motes only
- rune magic bound to engraved/material/architectural surfaces instead of open-palm casting
- no crimson/red or violet accent drift
- no SHADOW ember language
- no spectral echo crowd device
- do not reuse the High Warden's full flagship cathedral-halo dominance

## Confirmed untouched by the task transition

No changes were made to:

- application source code
- `apps/game-server/prisma/seed.ts`
- Prisma schema or migrations
- gameplay / balance / card text / effects / rarity / cost / stats / faction
- artwork files
- `/admin/art-review`
- Battlefield UI
- production sync script/workflow
- Railway / Vercel configuration
- production database
- approved Art Pack 01 or Art Pack 02 assets

## Recommended next action

Execute `docs/CLAUDE_CURRENT_TASK.md` exactly as written. Produce only the PURIFICATION Card 01 master-art brief, write the required GitHub handoff, update this state file last, and stop for owner review before any image generation.

## Reader protocol

1. Read this file.
2. Read `docs/CLAUDE_CURRENT_TASK.md`.
3. Read `docs/agent-reports/2026-08-27-art-pack-03-card-01-task-transition.md` if transition context is needed.
4. Resolve fresh `main` HEAD from GitHub before acting.
5. Repository state is authoritative over stale chat summaries.