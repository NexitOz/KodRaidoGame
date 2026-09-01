# CURRENT TASK — Art Pack 04 / BOND Card 01: master-art brief + generation package

## Status

Art Pack 03 / PURIFICATION is **COMPLETE END TO END**. Cards 01–04 are live in production, including Card 04 `rune-of-curse-breaking` after controlled production run `33560559977` / job `100031744885`.

Both previous production confirmations are consumed and invalid forever:

- `SYNC-13-CARD-ART-PRODUCTION` — CONSUMED
- `SYNC-14-CARD-ART-PRODUCTION` — CONSUMED

No production operation is authorized by this task.

The next faction-art milestone is **Art Pack 04 — BOND / «Дом Весеннего Света»**.

BOND's flagship Legendary already has approved production artwork:

- `matriarch-of-the-spring-light` / «Матриарх Дома Весеннего Света» — LEGENDARY — production reference / faction anchor already live.

The four non-flagship BOND cards, in starter-roster order, are:

1. `child-of-the-spring-light` — «Дитя Весеннего Света»
2. `keeper-of-the-promise` — «Хранитель Обещания»
3. `light-of-the-hearth` — «Свет Очага»
4. `rune-of-reflected-light` — «Руна Отражённого Света»

This task concerns **Card 01 only**.

## Canonical Card 01 facts to verify from repository

Target:

- slug: `child-of-the-spring-light`
- Russian name: «Дитя Весеннего Света»
- faction: BOND
- type: CHARACTER
- rarity: COMMON
- cost: 1
- attack / health: 1 / 3
- ability text: `При выходе: восстановите 1 здоровье Проводнику.`
- role: early sustain / small on-play heal, not a major board swing

These are gameplay facts, not art suggestions. Confirm them independently from `apps/game-server/prisma/seed.ts`, `docs/content-pack-01.md`, and related engine/interpreter paths. Do not change them.

## BOND visual anchor already established

Use `docs/art-bible-01.md` BOND section and the approved `matriarch-of-the-spring-light` production art as the primary faction anchor.

Known locked language to verify and expand from the repo:

- warm ivory + pale sage-green base;
- warm amber BOND accent around `#e0a458`;
- organic gold vine/branch filigree rather than PURIFICATION's straight geometric gold;
- living garden / natural canopy language unique to BOND;
- warm golden-hour diffuse backlight;
- soft, welcoming, sustaining mood rather than harsh combat chiaroscuro;
- flowing organic fabric/material language rather than rigid plate;
- healing / protection / ally synergy / sustain is the faction gameplay identity.

Card 01 is COMMON and must sit visibly far below the Legendary Matriarch in ceremony, gold, VFX, architecture, costume complexity and staging.

## Goal

Create the canonical **master-art brief and image-generation package** for Art Pack 04 Card 01.

The task ends before image generation, candidate transport, repository artwork integration, seed changes or production sync.

## Required sequence

1. Read fresh `main`, `CLAUDE.md`, `docs/AGENT_STATE.md`, this task, `docs/art-bible-01.md`, `docs/content-pack-01.md`, `docs/content-pack-01-balance.md`, `apps/game-server/src/content/starter-decks.ts`, and the exact Card 01 seed definition.
2. Verify the Card 01 gameplay facts and inspect the actual effect implementation enough to explain exactly what the art should communicate and what it must **not** imply.
3. Inspect every current in-app artwork surface relevant to a CHARACTER:
   - `CardView` 3:4
   - `CardDetailDrawer` 4:5
   - `HandCardPreview` 7:9
   - `CreatureSlot` 3:4
   - `/admin/art-review` desktop and 390px contexts
   Reconfirm crop math from code rather than copying old assumptions blindly.
4. Inspect the approved BOND flagship `matriarch-of-the-spring-light` and compare it against the already-completed SHADOW and PURIFICATION lower-rarity packs. Establish an explicit rarity hierarchy for BOND COMMON → RARE → EPIC → LEGENDARY before proposing Card 01.
5. Research all four non-flagship BOND cards together just enough to avoid spending Card 02/03/04's unique visual motifs on Card 01. Define a visual-reservation table for:
   - `child-of-the-spring-light`
   - `keeper-of-the-promise`
   - `light-of-the-hearth`
   - `rune-of-reflected-light`
   Do not write full future-card briefs yet.
6. Choose one canonical visual concept for Card 01. The concept must:
   - read instantly as BOND and not PURIFICATION;
   - communicate a **small restorative on-play action** rather than a giant miracle or mass heal;
   - remain clearly COMMON beside the Matriarch;
   - preserve a strong 92px silhouette/read;
   - avoid generic healer-priest cliché if a more faction-specific storytelling device is available;
   - keep any youthful subject age-appropriate, fully clothed and entirely nonsexualized.
7. Write `docs/art-review/child-of-the-spring-light-master-art-brief.md` as the canonical detailed brief. Match or exceed the rigor of the approved Card 03/04 briefs. Include at minimum:
   - gameplay truth and art translation;
   - faction language;
   - rarity hierarchy;
   - chosen hero concept and rejected alternatives;
   - subject/pose/expression;
   - costume/materials;
   - environment/background hierarchy;
   - lighting and palette;
   - healing/VFX language;
   - exact crop/safe-zone constraints;
   - 92px thumbnail requirements;
   - differentiation from Matriarch, PURIFICATION, and the future BOND cards;
   - forbidden motifs / automatic rejects;
   - measurable QA targets where meaningful;
   - generation prompt;
   - negative prompt;
   - concise regeneration/polish instructions if the first render drifts.
8. Create or initialize `docs/art-pack-04.md` with the BOND pack roster and status table. Card 01 should end at **BRIEF READY FOR OWNER REVIEW / GENERATION**, Cards 02–04 planned only, and the Matriarch recorded as the already-live faction flagship reference.
9. Do not modify any production art file or candidate branch. Do not create artwork bytes in this task.
10. Do not change `seed.ts`, gameplay, balance, schema, migrations, workflow/sync logic or production data.
11. Do not use or alter the stale consumed-authorization comments in production sync files as part of this art-direction task. They are separate technical debt and must not broaden this scope.
12. Run docs formatting/diff validation only as appropriate. No production credentials.
13. Write durable handoff report under `docs/agent-reports/2026-09-02-art-pack-04-card-01-master-art-brief.md`.
14. Update `docs/AGENT_STATE.md` **last**, fetch it back from GitHub and verify it.
15. Stop. Do not generate an image and do not begin Card 02.

## Hard exclusions

Do NOT:

- edit `apps/game-server/prisma/seed.ts`;
- edit schema or migrations;
- change gameplay, cost, stats, rarity, tags, ability or effects;
- edit any existing approved artwork;
- create/transport/integrate Card 01 artwork bytes;
- touch Railway, production DB or Vercel production state;
- edit or dispatch production sync workflows;
- create a new production confirmation phrase;
- reopen Art Pack 03;
- begin full work on Card 02/03/04.

## Expected final status

End at exactly one of:

- **READY FOR OWNER ART BRIEF REVIEW — ART PACK 04 CARD 01**
- **REJECTED / BLOCKED**
