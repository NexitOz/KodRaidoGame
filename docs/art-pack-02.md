# Art Pack 02

## Card 01

- **Slug:** `whisper-of-the-forgotten`
- **Name:** Шёпот Заброшенных
- **Faction:** SHADOW
- **Rarity:** COMMON
- **Artwork:** `apps/web/public/art/cards/whisper-of-the-forgotten.webp`
- **Dimensions:** 1024×1536
- **Status:** **FINAL APPROVED**

## Visual review

- Raw artwork — **PASS**
- CardView 3:4 — **PASS**
- Card Detail 4:5 — **PASS**
- Hand Preview 7:9 — **PASS**
- Battlefield CreatureSlot 3:4 — **PASS**

**Approval:** Owner visual approval via Vercel preview.

> The production database currently still reports `rightsStatus: placeholder`. This is an
> operational data-sync issue and does not invalidate artwork approval. No production database
> update was performed as part of this approval record.

## Card 02

- **Slug:** `ashen-blade`
- **Name:** Клинок Пепла
- **Faction:** SHADOW
- **Rarity:** COMMON
- **Artwork:** `apps/web/public/art/cards/ashen-blade.webp`
- **Dimensions:** 1024×1536
- **Status:** **FINAL APPROVED**

## Visual review

- Raw artwork — **PASS**
- CardView 3:4 — **PASS**
- Card Detail 4:5 — **PASS**
- Hand Preview 7:9 — **PASS**
- Battlefield CreatureSlot 3:4 — **PASS**
- Real mobile Battlefield — **PASS**
- SHADOW family differentiation — **PASS**

**Approval:** Owner visual approval after Art Pack 02 production-candidate review.

> The production database is intentionally **not** updated as part of this PR - see
> `apps/game-server/scripts/sync-production-card-art.ts`, which pins its source-of-truth read to
> an already-merged `main` commit SHA (`REQUIRED_SOURCE_COMMIT`) and hardcodes exactly seven
> target slugs. Extending it to cover this eighth card requires a commit that names *this* card's
> now-approved `seed.ts` state by its own already-merged `main` commit SHA, which cannot exist
> before this PR merges - attempting it here would mean pointing the script at an unmerged/
> not-yet-final commit, breaking the immutable-audited-source guarantee the script exists to
> provide. A dedicated post-merge follow-up (`SYNC-8-CARD-ART-PRODUCTION`) is required to extend
> `TARGET_SLUGS`/`REQUIRED_SOURCE_COMMIT` to eight and run the sync against production. Until that
> follow-up runs, the production database will report `rightsStatus: placeholder` for
> `ashen-blade` even though this repository's canonical `seed.ts` and this doc both record it as
> FINAL APPROVED - the same operational data-sync gap already documented above for Card 01.

## Card 03

- **Slug:** `keeper-of-smoldering-embers`
- **Name:** Хранитель Тлеющих Углей
- **Faction:** SHADOW
- **Rarity:** RARE
- **Artwork:** `apps/web/public/art/cards/keeper-of-smoldering-embers.webp`
- **Dimensions:** 1024×1536
- **File size:** 603,054 bytes
- **SHA-256:** `e8f46d8c98369529e94c8685abbd70ca27565df713636febd0ad125deb6842ce`
- **Status:** **FINAL APPROVED**

## Visual review

- Raw artwork — **PASS**
- CardView 3:4 — **PASS**
- Card Detail 4:5 — **PASS**
- Hand Preview 7:9 — **PASS**
- Battlefield CreatureSlot 3:4 — **PASS**
- Mobile 390x844 — **PASS**
- SHADOW family differentiation — **PASS**

**Approval:** owner visual approval of the Art Pack 02 production candidate, re-verified through
`/admin/art-review` against the real production path (`artworkUrl`), not a local candidate file.

Integrity of the master was verified independently before promotion: SHA-256, byte size, WebP
RIFF-declared total and decoded dimensions all matched the recorded values, and the container is
plain `VP8 ` like every other approved illustration in this pack.

> The production database is intentionally **not** updated as part of this PR, for the same reason
> documented for Card 02: `apps/game-server/scripts/sync-production-card-art.ts` pins its
> source-of-truth read to an already-merged `main` commit SHA and hardcodes its target slugs.
> Extending it to cover this card requires a commit naming *this* card's now-approved `seed.ts`
> state by its own already-merged `main` commit SHA, which cannot exist before this PR merges.
> Until that follow-up runs, the production database will report `rightsStatus: placeholder` for
> `keeper-of-smoldering-embers` even though this repository's canonical `seed.ts` and this doc both
> record it as FINAL APPROVED.
