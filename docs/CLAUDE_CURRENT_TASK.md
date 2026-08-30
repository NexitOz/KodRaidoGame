# CURRENT TASK — Art Pack 03 Card 03: master-art brief and owner concept gate

## Current status

Card 02 `seal-of-the-curse` / «Печать Проклятия» is COMPLETE END TO END and live in production.

Production sync evidence:

- workflow run: `33320281456`
- job: `99280920592`
- conclusion: `success`
- immutable source: `8d41b6570e0a7a29ec7ecc38b0c6075aed8a4757`
- PRE-WRITE: `TARGET_ROWS=12`, `UNIQUE_SLUGS=12`, `ROWS_REQUIRING_MUTATION=1`, `SOURCE_OF_TRUTH_MATCH=11/12`
- APPLY: `TRANSACTION_COMMITTED=YES`, `ROWS_CHANGED=1`, `TARGET_ROWS_FINAL=12`, `SOURCE_OF_TRUTH_MATCH=12/12`, `NON_TARGET_FIELD_CHANGES=0`
- POST-WRITE: `ROWS_REQUIRING_MUTATION=0`, `SOURCE_OF_TRUTH_MATCH=12/12`
- `SYNC-12-CARD-ART-PRODUCTION`: CONSUMED

No production operation is currently authorized.

## Target

Art Pack 03 Card 03:

- slug: `warden-of-the-barrier`
- name: «Хранительница Барьера»
- faction: PURIFICATION
- type: CHARACTER
- rarity: RARE
- cost: 3
- attack / health: 2 / 5
- ability: `При выходе: получает Щит. При Резонансе 5+: снимите Проклятие и Заглушение со всех союзников.`
- mechanics:
  - `ON_PLAY` → `SHIELD` / `SELF`
  - `ON_PLAY` with `RESONANCE_TIER_AT_LEAST 5` → `CLEANSE` / `FRIENDLY_ALL`

Canonical data source: `apps/game-server/prisma/seed.ts`.

## Goal

Create a rigorous master-art brief for Card 03 and stop for owner concept/brief approval BEFORE any image generation.

Write the canonical brief to:

`docs/art-review/warden-of-the-barrier-master-art-brief.md`

This is a planning task only. Do not generate, transport, promote, integrate, or sync artwork.

## Required research inside the repository

Before writing the brief, inspect and reconcile:

1. `docs/art-pack-03.md`
2. `docs/art-bible-01.md` and the approved PURIFICATION flagship `high-warden-of-the-white-rune`
3. `docs/art-review/acolyte-of-the-white-rune-master-art-brief.md`
4. `docs/art-review/seal-of-the-curse-master-art-brief.md`
5. the real Card 03 seed definition and mechanics
6. existing real review surfaces/components and crop rules used for CHARACTER cards

Do not invent faction language that conflicts with already-approved PURIFICATION cards.

## Core design problem the brief must solve

Card 03 is a RARE defensive CHARACTER. The image must communicate BOTH halves of its gameplay without becoming a generic paladin:

- immediate self-protection / barrier / Shield
- at Resonance 5+, broad cleansing/protective authority over the whole allied side

The silhouette and visual hierarchy must be clearly distinct from:

- COMMON `acolyte-of-the-white-rune`
- RARE EVENT `seal-of-the-curse`
- LEGENDARY `high-warden-of-the-white-rune`

At 92 px, the faction ladder must still read roughly Common < Rare < Legendary without relying only on the rarity frame.

## Required visual principles

The brief must define a single owner-reviewable concept, not a loose mood board.

Preserve PURIFICATION's established material language:

- white / silver / ivory as the dominant family
- clean pressed edges, intact materials, no ragged/tattered shapes
- bright cold light rather than SHADOW-style deep chiaroscuro
- engraved/material-bound rune magic rather than free-floating generic spellcasting
- armor, not robes
- disciplined, ordered, protective design language

Card 03 must read RARE rather than COMMON or LEGENDARY:

- materially richer and more capable than Card 01
- less monumental, ornate, ceremonial, crowned, or faction-defining than the Legendary flagship
- no visual device that makes her look like a second `high-warden-of-the-white-rune`

The brief should strongly consider a defensive silhouette and barrier object/geometry that reads in thumbnail, while avoiding a generic circular magic shield if it would collapse into stock fantasy language. Explain the chosen device and why it maps to `SHIELD` + team cleanse.

## Crop and composition rules

Use the project's real shipped crop math for a 1024×1536 master with centered `object-cover`:

- 3:4: rows ~85–1450
- 7:9: rows ~109–1426
- binding 4:5: rows 128–1408

Carry forward the stricter working safe-zone lesson from Card 02:

- aim to keep essential story content around y≈260–1280
- do not accept Card 01-style 2–4 px head clearance as the target
- face, barrier-defining geometry, weapon/tool if any, and the key rune/cleanse read must survive the 4:5 crop cleanly

Because this is a CHARACTER, later QA will include `CreatureSlot` in addition to `CardView`, `CardDetailDrawer`, `HandCardPreview`, `/admin/art-review`, mobile 390px, 92px and grayscale/value checks.

## Environment rule

Resolve Card 02's ambiguity explicitly. The brief must state how much environment information is allowed.

Choose one clear policy and justify it:

- near-abstract / almost no architectural information, OR
- restrained readable environment with a strict information ceiling

Do not leave this vague enough to rediscover at QA.

## Automatic-reject and acceptance checklist

The brief must contain explicit reject conditions covering at minimum:

- reads as generic holy mage / paladin rather than this specific defensive warden
- reads as Legendary / faction leader
- reads as COMMON / under-equipped novice
- robes instead of armor
- crimson / violet / magenta / ember-orange or SHADOW/VEIL corruption language
- free-floating spell blast, beam, projectile, explosion, or generic bubble shield if not part of the locked concept
- excessive gold, crown, halo, banners, crowd, monumental cathedral hero shot
- tattered cloth, ash, smoke, rot, tendrils, corruption
- malformed anatomy / incoherent hands or defensive equipment
- essential story outside the safe zone
- loss of barrier/warden read at 92 px grayscale
- text, watermark, logo, UI, card frame inside the art

Also provide a positive acceptance checklist that can later be walked mechanically during visual QA.

## Deliverables

1. Create `docs/art-review/warden-of-the-barrier-master-art-brief.md` with:
   - exact canonical card facts
   - locked visual concept
   - composition and focal hierarchy
   - character silhouette, armor, pose, defensive device, runes, lighting, palette, environment
   - rarity positioning against Card 01 and the Legendary flagship
   - crop-safe composition rules
   - 92 px / grayscale requirements
   - automatic-reject conditions
   - acceptance checklist
   - a final generation-ready prompt draft, clearly labelled as DRAFT and NOT YET AUTHORIZED FOR GENERATION
2. Create a durable handoff under `docs/agent-reports/` summarizing the design decision and any unresolved owner choices.
3. Do not open an integration PR unless repository convention requires a docs-only PR. If no PR is needed, commit the brief/report to `main` under the established coordination protocol.
4. Update `docs/AGENT_STATE.md` LAST and fetch it back from GitHub to verify.

## Hard exclusions

Do NOT:

- generate any Card 03 image
- use image generation tools or external generators
- create or upload candidate binary art
- change `seed.ts`, gameplay, balance, mechanics, schema or migrations
- change `artworkUrl` or `rightsStatus`
- modify production sync workflow/script or dispatch any production workflow
- access Railway/Vercel/production DB
- begin Card 04
- alter Card 01 or Card 02 artwork

## Final status

Stop with exactly one of:

- **READY FOR OWNER CONCEPT / BRIEF APPROVAL**
- **BLOCKED — OWNER DECISION REQUIRED**

No generation until the owner explicitly approves the Card 03 brief/concept.