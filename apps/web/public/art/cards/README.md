# Card artwork

Real illustration files land here, named `<faction>_flagship_v1.webp` for the six Art Pack 01
flagship cards (see `docs/art-bible-01.md`):

- shadow_flagship_v1.webp
- purification_flagship_v1.webp
- bond_flagship_v1.webp
- veil_flagship_v1.webp
- mystery_flagship_v1.webp
- cosmic_flagship_v1.webp

Once a file lands here, update the matching card's `artworkUrl` in
`apps/game-server/prisma/seed.ts` to `/art/cards/<filename>` and `rightsStatus` to `owned`, then
re-seed (or apply a data migration for a database that must not be reseeded, same pattern as
`prisma/migrations/20260811155400_canonical_card_roster_01`). No other code change is required —
`CardView`/`CardDetailDrawer`/Battlefield all render `card.artworkUrl` generically already.

This directory is empty until real art exists. Do not add placeholder/test images here — they
would get served at the same public path a real flagship illustration will occupy later.
