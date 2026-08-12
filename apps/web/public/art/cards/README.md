# Card artwork

Real, owner-approved production illustration files for individual cards live here. This directory
is served directly by Next.js as a public static path — `Card.artworkUrl` points straight at a file
here (e.g. `/art/cards/necromancer-of-the-twilight-order.webp`).

## Naming convention

Canonical filename format is the card's own `slug` plus `.webp`:

```
<card-slug>.webp
```

Example: `necromancer-of-the-twilight-order.webp` for the card whose `slug` in
`apps/game-server/prisma/seed.ts` is `necromancer-of-the-twilight-order`. No faction prefix, no
version suffix — the slug is already the stable, unique identifier for the card, confirmed directly
against `seed.ts` before naming a file.

There is no versioning suffix scheme (no `_v1`, `_v2`, etc.). A card's production art is the single
current file at its slug path; earlier rejected candidates are never committed here — they're
reviewed locally under the gitignored `apps/web/public/art-review-candidates/` directory via
`/admin/art-review`, and only the final owner-approved file ever lands under this directory.

## Format

- Vertical 2:3 master canvas is the default (matches SHADOW/PURIFICATION/BOND/VEIL/MYSTERY at
  1024×1536). A different aspect ratio is only acceptable as an explicit, owner-approved exception
  recorded in `docs/art-bible-01.md` (COSMIC's native 1086×1448/3:4 master is the current example).
- WebP, `quality=92`, `method=6` (Pillow) for the production file, typically converted from a PNG
  source.
- No text, logo, stats, or baked-in card frame — a clean illustration that `CardView` /
  `CardDetailDrawer` / `HandCardPreview` / `CreatureSlot` render their own frame/badges/rarity glow
  on top of at display time.

## Promoting a new file here

1. Get the candidate through a real review pass via `/admin/art-review` (see that page's own header
   text and `docs/art-bible-01.md` for the process).
2. Once explicitly owner-approved, add the file here as `<slug>.webp`.
3. Update the matching card's `artworkUrl`/`rightsStatus: 'owned'` directly in its
   `apps/game-server/prisma/seed.ts` entry (see the `SeedCard.artworkUrl`/`rightsStatus` override
   fields and how every promoted flagship uses them) — every other card is unaffected and keeps
   regenerating its placeholder on every seed run.
4. Re-seed (or write a data migration for a database that must not be reseeded).

`docs/art-bible-01.md` is the source of truth for the full Art Pack 01 spec, review history, and
per-faction visual bible — consult it before naming, cropping, or promoting anything here.
