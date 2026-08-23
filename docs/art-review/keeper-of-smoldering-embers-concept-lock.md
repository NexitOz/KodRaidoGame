# Keeper of Smoldering Embers — approved concept lock

**Concept status: APPROVED** (owner call, this is the locked visual direction).
**Asset status: PENDING INTAKE** — the approved image file has not reached this repository yet.
See "Intake" at the bottom for the exact path and the checks it must pass.

This document is the canonical record of *what was approved and must survive future iterations*.
It is deliberately not a redesign, a reinterpretation, or a new direction.

## At a glance

|                      |                                                              |
| -------------------- | ------------------------------------------------------------ |
| Working name         | Хранитель Тлеющих Углей / Keeper of Smoldering Embers          |
| Slug                 | `keeper-of-smoldering-embers`                                  |
| Faction tag          | Shadow                                                         |
| Type / rarity / cost | CHARACTER / RARE / 3                                           |
| Stats                | 2 / 3                                                          |
| Ability              | При выходе: призовите Эхо-Тень 1/1                             |
| Visual role          | The heavy anchor of the SHADOW family                          |
| Canonical asset path | `apps/web/public/art/cards/keeper-of-smoldering-embers.webp`   |
| Master format        | Vertical 2:3, 1024×1536, WebP q92, clean illustration          |

Card data is quoted from `apps/game-server/prisma/seed.ts` for context only. Nothing in this
document changes it.

## Visual role

SHADOW's three approved illustrations are all light, fast or incorporeal: a slim spellcaster, a
lunging duelist, and a drifting masked wraith. The Keeper is the faction's **weight**. He is the
one card in the family that reads as immovable — the thing the others move around. That contrast is
his entire reason for existing visually, and it is what makes him worth locking rather than
re-rolling.

Three theses must read at a glance: **he is ancient**, **he is ashen/smouldering**, **he is a
guardian/punisher**.

## Key traits of the approved image (locked)

1. Heavy-guardian archetype — never a fast assassin.
2. Massive, monumental silhouette; broad shoulders clearly wider than the hips.
3. Closed helm, face fully hidden.
4. Heavy armour on a charred, blackened-metal theme.
5. Glowing cracks / embers / internal heat inside the armour.
6. Polearm / halberd as a defining silhouette element.
7. Grim gothic setting: ruins, cathedral, ash, cinders, smouldering glow.
8. Atmosphere: dark fantasy, cinematic, realistic, grim, infernal, ash-and-ember guardian.

## Why this variant was approved

It is the first Keeper variant that solves the differentiation problem instead of restating it.
The three approved SHADOW cards converge on cool magenta/violet light, thin fluttering rags, a
readable face and a narrow figure — `ashen-blade` in particular already owns the agile-duelist role
completely. A fourth card in that mould would have been redundant on the board and in the
collection grid.

This variant inverts the four axes that actually carry recognition: warm ember light instead of
cool magenta, solid armoured mass instead of fluttering silk, a closed helm instead of a readable
face, and a planted stance instead of mid-action motion — while keeping the near-black base palette
and the gothic-ruin setting that make the card read as SHADOW at all. Different character, same
world.

> Recorded honestly: the approval is the owner's, based on the owner's copy of the image. No Keeper
> illustration has been present in this repository or viewable by an agent at any point — the
> committed transport on `assets/keeper-of-smoldering-embers-candidate-source` is still truncated
> and still decodes to a blank grey frame. The traits above are the owner's stated description of
> the approved variant, not an agent's reading of the file.

## What must not be lost in future iterations

Ordered most-fragile first — these are the things a re-roll, an upscale, a "small improvement" pass
or a careless crop actually destroys:

1. **The closed helm.** The single most fragile trait. Any pass that gives him a face, eyes or
   visible hair immediately collapses him back into the family silhouette. Non-negotiable.
2. **Warm-only emissive light.** Ember amber must stay the only glowing colour. The moment magenta,
   pink or violet enters the character, the differentiation from `ashen-blade` and `whisper` is gone
   — and this is the one trait that still reads at thumbnail size.
3. **Embers, not flame.** Dying heat inside a cooling body, never a burning knight. Bright open
   flame or large glowing area destroys both the "ancient" and the "smouldering" theses at once.
4. **Static, planted stance.** Weight down, halberd grounded. Any dynamic or diagonal pose reads as
   the duelist again.
5. **Mass over detail.** Few large heavy shapes, not many small fluttering ones. This is what keeps
   him identifiable filled solid black.
6. **The halberd staying inside the crop.** See the crop constraints in the master-art brief — the
   4:5 Card Detail crop removes the top 128 px of the master, exactly where a vertical polearm's
   head lands.
7. **Crack scale.** Cracks must be wide enough to survive `CreatureSlot` at ~160 px (≈0.16× the
   master). Fine filigree collapses into noise there.
8. **Echo-Shadow hierarchy.** Present but small, low, cool grey, no glow of its own, never breaking
   the Keeper's outer silhouette.

## Asset naming and placement

The repository already has the structure for this; nothing new was created.

| Purpose | Location | Committed? |
| --- | --- | --- |
| Owner-approved production art | `apps/web/public/art/cards/<slug>.webp` | yes |
| Unapproved candidates under review | `apps/web/public/art-review-candidates/<slug>.<ext>` | no — gitignored |
| Concept / review records | `docs/art-review/<slug>*.md` | yes |

Filename for this character is therefore exactly:

```
keeper-of-smoldering-embers.webp
```

No faction prefix, no `_v1`/`_v2` suffix — the slug is already the stable unique identifier, and
`apps/web/public/art/cards/README.md` fixes this convention for every card. A card's production art
is the single current file at its slug path; superseded variants are not kept alongside it.

## Intake — what happens when the file arrives

1. If the file is transported as chunked base64 again, **verify before anything else**: the
   reassembled byte count must equal the WebP RIFF-declared length, and `sha256sum` must match a
   recorded hash. The previous candidate skipped this and shipped 1,324 bytes short, decoding to a
   uniform blank grey frame.
2. Drop it at `apps/web/public/art-review-candidates/keeper-of-smoldering-embers.webp` (gitignored)
   and open `/admin/art-review`. The Keeper row is already registered — no code change is needed.
3. Confirm the five surfaces: raw 2:3, CardView 3:4, Card Detail 4:5, Hand Preview 7:9,
   CreatureSlot 3:4. The 4:5 crop and the black-fill silhouette test are the two that matter most.
4. Only after that does promotion apply — add the file at the canonical path, then set
   `artworkUrl` / `rightsStatus: 'owned'` in `seed.ts`. That is a separate, explicit step.

## Related records

- `keeper-of-smoldering-embers-master-art-brief.md` — generation direction, prompt, crop maths.
- `keeper-of-smoldering-embers.md` — the broken-transport investigation for the earlier candidate.
- `../art-bible-01.md` — project-wide art spec and approval process.

## Not changed by this document

Production `artworkUrl`, `rightsStatus`, `seed.ts`, the database, Railway, Vercel, gameplay,
engine, UI logic, rarity, stats, faction, balance, and every other card's artwork.
