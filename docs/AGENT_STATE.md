# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first; then `docs/CLAUDE_CURRENT_TASK.md`; after each completed task update this file last and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 01 brief APPROVED — **READY FOR EXTERNAL ART GENERATION**
- **Current target:** `acolyte-of-the-white-rune` / «Послушник Белой Руны»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task-result commit:** `5614d8180f62bde9e569555a6c68d51be66cea7c` (light-armor amendment;
  the brief was first created in `2c8639a`)
- **Latest handoff report:** `docs/agent-reports/2026-08-27-art-pack-03-card-01-master-art-brief.md`
- **Latest handoff report commit:** `697060f`
- **Branch:** `main`
- **PR:** none — documentation-only task

## Completed task — Card 01 master-art brief

The brief is written and committed:

`docs/art-review/acolyte-of-the-white-rune-master-art-brief.md` (459 lines, commit `2c8639a`)

It was derived from three real repository sources: the `acolyte-of-the-white-rune` seed entry
(`apps/game-server/prisma/seed.ts` lines 815–827, read only), the PURIFICATION and composition
sections of `docs/art-bible-01.md`, and a direct visual audit of the approved production file
`apps/web/public/art/cards/high-warden-of-the-white-rune.webp`.

All fifteen required sections are present: card/visual role, silhouette and pose, costume and
materials, environment and architecture, lighting, faction palette, VFX and rune language, hierarchy
differences vs. the High Warden, SHADOW differentiation, crop-safe composition through 3:4/7:9/4:5,
mobile and thumbnail readability, forbidden drift, generation prompt, negative prompt, and a
production acceptance checklist.

### The core direction, in one paragraph

Hold the flagship's **material** language constant (white/silver/ivory, pressed never-tattered
edges, bright near-shadowless light, cold frost motes, engraved material-bound rune magic, frontal
near-symmetrical posture) and invert its **structural** devices: three-quarter framing cut at
mid-thigh instead of a full-body monument; a narrow vertical column instead of a wide pyramid; a
bare head with no crown; one small hand-held white-stone rune tablet instead of spear-plus-shield;
light plain standard-issue armor instead of a full ceremonial harness under a cape; gold capped at
two hairlines and ~3% of canvas; a modest cloister arcade instead of the cathedral facade with its
rose-window halo; and no crowd at all.

### Notable design outcome

Because the brief specifies no head ornament and no raised weapon, the flagship's one accepted crop
loss (spearhead apex trimmed ~5.5–8.3%) is designed out. Card 01 is specified to ship with **zero**
accepted crop losses, and a candidate returning with a headpiece or raised staff is an automatic
reject on that ground alone.

### Owner decisions

1. **Costume — DECIDED 2026-08-27: light armor.** The owner held the art bible's "armor, not robes"
   rule strictly. §3 now specifies real but light, plain, standard-issue armor — a smooth
   undecorated white/silver cuirass, plain gorget, two small matching pauldrons, vambraces on both
   forearms, a short ivory tabard to mid-thigh, over a plain high-collared under-tunic; brushed
   satin matte metal, not mirror-polished; bare hands, no gauntlets. The COMMON rank read now comes
   from how little armor there is and how undecorated it is, not from swapping armor for cloth.
   Applied in commit `5614d818`, scoped by owner instruction to §3, the generation prompt, the
   negative prompt and the acceptance checklist only.
2. **Framing — ACCEPTED** by the owner approving the brief and authorising generation:
   three-quarter length cut at mid-thigh rather than full body.
3. **Gold budget — ACCEPTED** on the same approval: two hairlines at ≤ ~3% of canvas, enforced as
   an automatic reject.

The brief is closed for revision. Any further change to it is a new owner decision, not agent
discretion.

### Cross-references — RESOLVED

The three stale cross-references left by the light-armor amendment were fixed on owner
authorisation in commit `4082b534`:

1. **§12 forbidden-drift item 4** no longer forbids "breastplate" (which §3 requires). It now
   forbids a full ceremonial harness and, symmetrically, a robed unarmoured cleric.
2. **§8 hierarchy table, Armour row** now reads "Light plain cuirass, gorget, two small pauldrons,
   vambraces; bare hands".
3. **§6 palette table and §11** now name the cuirass and tabard instead of the cassock.

Terminology only — the art direction is unchanged. The brief is now internally consistent and the
only remaining occurrence of "cassock" is the intended one, in the §14 negative prompt.

**Hard stop respected:** no image was generated, integrated, promoted or synced. No seed, schema,
gameplay, artwork, `/admin/art-review`, Battlefield UI, sync script, workflow, Railway/Vercel or
production database change was made. Validation was documentation-only: `git diff --check` clean and
Prettier clean (Prettier's first `--check` failed on table padding and emphasis style; corrected with
`--write` and re-verified).

## Next task — GENERATION (authorised 2026-08-27)

The owner approved the brief and authorised moving to generation. The task is written up in
`docs/CLAUDE_CURRENT_TASK.md`.

**Blocking constraint: image generation is not available in the Claude Code session.** Its tool
surface was re-checked at the start of this phase — there is no image-generation tool. This is the
same constraint that blocked SHADOW Card 04, and it was resolved there the same way: the master was
produced externally and committed to a branch.

**The master must be generated externally**, against §13 and §14 of the brief verbatim, and landed
on:

`assets/acolyte-of-the-white-rune-candidate`

with the file at `art-source/acolyte-of-the-white-rune.webp` plus a source note at
`docs/art-sources/2026-08-27-purification-card-01-master-prompt.md`. Committing to a branch is the
**only** transport that has ever worked here — chat image attachments are re-encoded in transit, ZIP
attachments never materialise, and chunked base64 truncates. Do not merge the candidate branch.

Required output: 1024×1536, WebP q92 method 6, plain `VP8 ` container (not `VP8X`), no text/frame/UI.
Record SHA-256, byte size, RIFF-declared total and decoded dimensions.

Once the candidate is on the branch, Claude Code resumes with a mechanical pass: verify the bytes,
review `CardView` 3:4, `CardDetailDrawer` 4:5, `HandCardPreview` 7:9, `CreatureSlot` and
`/admin/art-review` at desktop and 390 px, walk the §15 checklist, then **stop for owner visual
approval**. Note Card 01 is a CHARACTER, so `CreatureSlot` is a real surface for it — unlike Card 04,
which was a RUNE.

Promotion, seed changes and production sync remain **unauthorised**.

### Standing note for any future Art Pack 03 promotion

`apps/game-server/scripts/sync-production-card-art.ts` is still pinned to
`REQUIRED_SOURCE_COMMIT = 23e83c9978a9045059d3009eb1983b17f005d1d3` with a ten-entry `TARGET_SLUGS`,
and `.github/workflows/production-card-art-sync.yml` still requires the confirmation string
`SYNC-10-CARD-ART-PRODUCTION`. That is correct as of today. Whenever an Art Pack 03 card is
eventually promoted, the pin, the slug list and **every** count assertion in the workflow must move
together in one change.

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

## Confirmed untouched by the Card 01 brief task

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

Generate the Card 01 master externally against §13/§14 of the approved brief and push it to
`assets/acolyte-of-the-white-rune-candidate`, per `docs/CLAUDE_CURRENT_TASK.md`.

Claude Code cannot do this step — no image-generation tool exists in its session. It resumes once
the candidate bytes are in the repository.

Nothing substitutes for the real master: no placeholder, no approximation, no re-encoded derivative,
no reconstructed copy. Two candidates have already been rejected on integrity grounds in this
project (a truncated transcode on Card 03, a 14,999-byte non-image blob on Card 04), and that
discipline holds here.

## Reader protocol

1. Read this file.
2. Read `docs/CLAUDE_CURRENT_TASK.md` — it now carries the GENERATION task for Card 01.
3. Read `docs/agent-reports/2026-08-27-art-pack-03-card-01-master-art-brief.md` for the full handoff,
   and `docs/art-review/acolyte-of-the-white-rune-master-art-brief.md` for the brief itself.
4. Resolve fresh `main` HEAD from GitHub before acting.
5. Repository state is authoritative over stale chat summaries.
