# Keeper of Smoldering Embers — production art integration

**Outcome: COMPLETE. Integrated and verified on the production path.**

The byte-exact master landed in the repository, passed all four integrity checks, and is now wired
through `artworkUrl` / `rightsStatus: 'owned'`. Every review surface was re-verified against the
real production path — not a local candidate file. All gates green.

Date: 2026-08-24 · Branch: `claude/integrate-keeper-of-smoldering-embers-art` · PR #32 · **NOT MERGED**

## Integrity verification

The master arrived on the PR branch at `apps/web/public/art/cards/keeper-of-smoldering-embers.webp`
(git blob `7035888e84c44afa681ea0d70c0f9da8f0fad4e0`). Verified independently, by reading the blob
straight out of git rather than trusting the checkout:

| Check | Expected | Measured | Verdict |
| --- | --- | --- | --- |
| SHA-256 | `e8f46d8c98369529e94c8685abbd70ca27565df713636febd0ad125deb6842ce` | identical | **PASS** |
| File size | 603,054 bytes | 603,054 | **PASS** |
| RIFF declared total | 603,054 | 603,054 | **PASS** |
| Dimensions | 1024×1536 | 1024×1536 | **PASS** |

Container is plain `VP8 ` — matching every other approved illustration in
`apps/web/public/art/cards/`, and confirming this is the original export rather than a re-encode.
The file decodes to the full illustration.

## Changes made

| File | Change |
| --- | --- |
| `apps/web/public/art/cards/keeper-of-smoldering-embers.webp` | the verified master (arrived on the branch) |
| `apps/game-server/prisma/seed.ts` | +3 lines, Keeper entry only |
| `apps/web/src/app/admin/art-review/page.tsx` | Keeper row promoted to an approved production entry |
| `docs/art-pack-02.md` | Card 03 → FINAL APPROVED |
| `docs/reports/keeper-smoldering-embers-art-integration.md` | this report |

### `seed.ts` — Keeper only

```ts
abilityText: 'При выходе: призовите Эхо-Тень 1/1.',
// Art Pack 02 Card 03 - owner-approved production artwork.
artworkUrl: '/art/cards/keeper-of-smoldering-embers.webp',
rightsStatus: 'owned',
```

Three added lines inside the `keeper-of-smoldering-embers` entry. Nothing else in the file changed —
no other card, and none of this card's own gameplay data. `name`, `type`, `rarity`, `cost`, `tags`,
`attack`, `health`, `abilityText` and `effectJson` are identical to before, confirmed by reading the
diff.

### `/admin/art-review`

The Keeper row previously carried no `reviewArtworkUrl`, so it resolved to the gitignored candidate
slot, plus a comment stating the committed source was unusable. Both are now wrong. The row was
promoted to match `ashen-blade`:

```ts
{
  slug: 'keeper-of-smoldering-embers',
  faction: 'SHADOW',
  referenceLabel: 'ART PACK 02 — APPROVED 03',
  reviewArtworkUrl: '/art/cards/keeper-of-smoldering-embers.webp',
},
```

This is what makes the page review the production path rather than a local file. Keeper-only; the
other eight rows are untouched.

## Reseed

`prisma migrate deploy` reported no pending migrations; `npm run seed` reseeded the local dev
database. The API then confirmed the promotion end to end:

```
GET /api/cards → keeper-of-smoldering-embers
  artworkUrl  : /art/cards/keeper-of-smoldering-embers.webp
  rightsStatus: owned
  name/type/rarity/cost/atk/hp: Хранитель Тлеющих Углей CHARACTER RARE 3 2 3
  ability     : При выходе: призовите Эхо-Тень 1/1.
```

Gameplay data unchanged; only the two art fields moved.
`GET /art/cards/keeper-of-smoldering-embers.webp` returns 200 with exactly 603,054 bytes.

## Production-path QA — all surfaces PASS

Against the live local stack (Postgres + Redis + reseeded game-server on :4000 + `next dev` on
:3000).

| Surface | Route | Verdict |
| --- | --- | --- |
| Collection / card grid | real `/collection`, logged in as the demo user | **PASS** |
| Card Detail | real modal, opened from the card | **PASS** |
| Hand Preview | real `HandCardPreview` modal | **PASS** |
| CreatureSlot / Battlefield | `CreatureSlot` at board size | **PASS** |
| `/admin/art-review` | all five panels | **PASS** |
| Mobile 390×844 | `/collection` and `/admin/art-review` | **PASS** |

### Proof it is the production path

Two independent confirmations, so this cannot be a candidate file in disguise:

1. **Network trace.** Every request the browser made for this card was logged. The only URL touched
   was `/art/cards/keeper-of-smoldering-embers.webp`. `art-review-candidates` was requested **zero**
   times, and the candidates directory on disk contains nothing but its `.gitkeep`.
2. **Page badges.** The review row now reads `rightsStatus: owned` and
   `PRODUCTION ASSET — REVIEW` — previously `placeholder` and
   `showing CANDIDATE (not wired to artworkUrl)`.

The loaded `<img>` reported `naturalWidth 1024 / naturalHeight 1536` from the production URL.

### Differentiation, confirmed in situ

In the real Collection grid the Keeper sits directly beside `Шёпот Заброшенных` and `Клинок Пепла`.
The intended separation is immediately visible at grid size: the two neighbours read cool
violet/magenta, the Keeper reads warm amber over a heavy dark mass. The concept-lock goal — a heavy
ember guardian that cannot be mistaken for another fast SHADOW assassin — holds where it actually
matters, in the collection, not just in isolation.

### Caveats carried forward (none blocking, unchanged from the review pass)

1. The halberd's upper spike grazes the top edge of the 4:5 Card Detail crop. The weapon still reads
   completely — head, hooks and haft all inside frame.
2. Fire runs slightly hotter than "dying embers": open flames lower-left and lower-right. Still
   ash-and-ember rather than fire-knight.
3. Very low-key overall — at `CreatureSlot` size the ember pattern carries more than the edges do.

## Gates

| Gate | Command | Result |
| --- | --- | --- |
| Dependency packages | `npm run build -w @kod-raido/shared -w @kod-raido/game-engine -w @kod-raido/ui` | exit 0 |
| Lint | `npm run lint` | **exit 0** |
| Typecheck | `npm run typecheck` | **exit 0** |
| Tests | `npm test` | **exit 0 — 349/349 passed** (156 + 32 + 24 + 88 + 49) |
| Build | `npm run build` | **exit 0** — "Compiled successfully" |

## Screenshots

Delivered to the owner, not committed (CLAUDE.md rule E): the `/admin/art-review` row on the
production path, five individual surface panels, both real modals, the real Collection grid and card
close-up, the Collection card detail, and mobile 390×844 for both Collection and art-review.

## Transport history — resolved

For the record, since it shaped this PR:

| # | Transport | Result |
| --- | --- | --- |
| 1 | chunked base64 on `assets/…-candidate-source` | truncated — 1,324 bytes short, decoded to a blank grey frame |
| 2 | image attached to a chat message | re-encoded in transit — 316,336 bytes, hash mismatch; review done, promotion held |
| 3 | ZIP attached to a chat message | never materialised in the container |
| 4 | **committed straight to the PR branch** | **byte-exact, all four checks PASS** |

Committing the file to git was the transport that worked. The stale
`assets/keeper-of-smoldering-embers-candidate-source` branch is now dead and should be deleted so
nobody reconstructs from it.

## Confirmed untouched

Gameplay, balance, card text, effects, rarity, stats, faction, cost, the engine, matchmaking, server
logic, Prisma schema and migrations, desktop and mobile Battlefield layout, every other card's
artwork and seed entry, and every unrelated branch or PR. No new concept art.

The local Postgres was migrated and reseeded to run the QA — that is the disposable dev database in
this container. The **production** database is deliberately not updated here, for the reason already
documented for Card 02: `apps/game-server/scripts/sync-production-card-art.ts` pins its
source-of-truth read to an already-merged `main` commit SHA and hardcodes its target slugs, so
extending it requires a commit naming this card's approved `seed.ts` state by its own merged SHA —
which cannot exist until this PR merges. Until that follow-up runs, production will report
`rightsStatus: placeholder` for this card.

## Next action

Owner review and merge of PR #32. After merge, the production card-art sync follow-up extends
`TARGET_SLUGS` / `REQUIRED_SOURCE_COMMIT` to cover this card.
