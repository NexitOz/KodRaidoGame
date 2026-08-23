# Keeper of Smoldering Embers — production art integration

**Outcome: BLOCKED. The art was not integrated.**
The approved image does not exist anywhere in this repository, and the only committed source for it
is a truncated file that no decoder will open. Per the task's own instruction — *"если approved
source в репо отсутствует, не выдумывай замену"* — no substitute was created, no placeholder was
promoted, and no card record was touched.

Date: 2026-08-23 · Branch: `claude/integrate-keeper-of-smoldering-embers-art` · Base: `fa464ef`

## What is missing, precisely

**1,324 bytes** — the tail of the VP8 bitstream of
`apps/web/public/art/cards/keeper-of-smoldering-embers.webp`.

The candidate is transported as 16 chunked base64 files on
`assets/keeper-of-smoldering-embers-candidate-source`, under
`art-source/keeper-of-smoldering-embers/`. Fifteen of them are real. The sixteenth is a stub.

| Chunk | Size | Content |
| --- | ---: | --- |
| `q60-00.b64` … `q60-14.b64` | 12,000 bytes each | valid base64 |
| `q60-15.b64` | **11 bytes** | the literal ASCII text `PLACEHOLDER` |

Reconstructing from the fifteen valid chunks:

| Measurement | Value |
| --- | --- |
| Base64 characters recovered | 180,000 |
| Decoded bytes | 135,000 |
| Container magic | `RIFF` … `WEBP` — the header is intact |
| Size declared by the RIFF header | 136,316 (+8 header bytes = **136,324** total) |
| **Shortfall** | **1,324 bytes** |
| Expected sha256 (recorded in the branch README) | `7bde6a98e36bdd9155f315ce3adc22d50d574a5f8581711126ffa99739eca696` |
| Actual sha256 of the reconstruction | `95e906f64842f8fcc761eacd7cc7f60e04359f2aafc9db6e5d0be8d67062f146` |

The stub chunk could have carried at most ~8 bytes even if it had been valid base64, so this is a
genuinely truncated export, not a corrupted final line.

Independent confirmation that this is unusable rather than merely mis-measured: the reconstructed
file was handed to an image decoder, which **rejected it outright** — it does not open as an image
at all.

### Reproducing the check

```
git show origin/assets/keeper-of-smoldering-embers-candidate-source:art-source/keeper-of-smoldering-embers/q60-15.b64
# -> PLACEHOLDER
```

## Where the file was looked for

Not assumed — searched. Every remote ref in the repository (33 branches) was enumerated and its
tree scanned for any non-text file matching `keeper`:

- The **only** hits for this card anywhere are the 16 `.b64` chunks above.
- Every other `keeper*` hit is `apps/web/public/art/cards/keeper-of-the-grey-mist.webp`, which is a
  different card — the MYSTERY flagship, already approved and shipped.
- `apps/web/public/art/cards/` on `main` holds 8 approved illustrations; none is the Keeper.
- `apps/web/public/art-review-candidates/` contains only its `.gitkeep`.
- No image file anywhere on the session filesystem, and nothing was attached to the request.

## Baseline verification

The gates were run anyway, on an unmodified checkout, to establish that the repository is clean and
ready for the integration the moment the asset lands. All green:

| Gate | Command | Result |
| --- | --- | --- |
| Dependency packages | `npm run build -w @kod-raido/shared -w @kod-raido/game-engine -w @kod-raido/ui` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npm run typecheck` | exit 0 |
| Tests | `npm test` | exit 0 — **349 passed** (156 + 32 + 24 + 88 + 49 across 41 files) |
| Build | `npm run build` | exit 0 — "Compiled successfully" |

These results describe `main` at `fa464ef`. They are **not** evidence that any art integration
works, because no art was integrated.

## No screenshots, and why

Screenshot proof was requested. It was deliberately not produced: with no artwork, every review
surface renders the card's shipped placeholder. Screenshots of that would show five panels that
look plausible while proving nothing about the Keeper — the previous review pass already produced
exactly that misleading artefact. A verification image is only worth capturing once there is a real
illustration for it to verify.

## What integration will look like when the file arrives

Scoped in advance so the next pass is mechanical. The repository already carries every hook; the
only missing input is the binary.

1. **Verify the transport before anything else.** Reassembled byte count must equal the
   RIFF-declared length, and `sha256sum` must match the recorded hash. This is the check that was
   skipped last time and it is the reason this task is blocked.
2. **Place the asset** at `apps/web/public/art/cards/keeper-of-smoldering-embers.webp` — 2:3,
   1024×1536, WebP q92/method 6, clean illustration with no frame, text or UI baked in
   (`apps/web/public/art/cards/README.md`).
3. **Wire the card**, one entry in `apps/game-server/prisma/seed.ts` (the Keeper is at line ~746),
   matching the pattern already used by `ashen-blade`:
   ```ts
   // Art Pack 02 Card 03 - owner-approved production artwork.
   artworkUrl: '/art/cards/keeper-of-smoldering-embers.webp',
   rightsStatus: 'owned',
   ```
   Nothing else in that entry changes — type, rarity, cost, stats, tags, `abilityText` and
   `effectJson` all stay exactly as they are.
4. **Re-seed** (or write a data migration for a database that must not be reseeded).
5. **Surfaces need no code change.** They all read `Card.artworkUrl` generically: Collection grid
   and Card Detail via `CardView` / `CardDetailDrawer`, the hand preview via `HandCardPreview`, the
   board via `CreatureSlot`. The Keeper row is *already registered* in
   `apps/web/src/app/admin/art-review/page.tsx`, so `/admin/art-review` renders all five crops as
   soon as a file exists — either the gitignored candidate drop or the production asset.
6. **Then** capture the five-surface proof and update `docs/art-pack-02.md` Card 03 from
   CONCEPT APPROVED / ART PENDING INTAKE to FINAL APPROVED.

The pre-review route, which needs no commit at all: drop the file at
`apps/web/public/art-review-candidates/keeper-of-smoldering-embers.webp` (gitignored) and open
`/admin/art-review`.

## How to get the file in

Any of these unblocks the task:

- **Re-export and re-upload the chunk set** with a complete `q60-15.b64`, and record the sha256 of
  the reassembled file so the check in step 1 has something to compare against.
- **Commit the `.webp` directly** to a branch. At ~136 KB it is well within normal limits — the
  chunked-base64 transport was a workaround, not a requirement, and it is what failed.
- **Attach the image to the task** so it can be written to disk and converted here.

A PNG master is fine; conversion to WebP q92/method 6 is a scripted step on this side.

## What was deliberately not done

- No substitute, regenerated, upscaled or reconstructed-from-partial image was created.
- No production `artworkUrl` or `rightsStatus` was set.
- `seed.ts`, the database, Railway and Vercel were not touched.
- No gameplay, balance, card text, effects, rarity, stats, faction or server logic changed.
- Desktop and mobile Battlefield layout untouched.
- No unrelated branch or PR touched; no refactoring of any kind.
- No new concept art.

## Status of the card right now

`keeper-of-smoldering-embers` remains CHARACTER / RARE / cost 3 / 2-3 / Shadow with
`При выходе: призовите Эхо-Тень 1/1`, **no** `artworkUrl` and **no** `rightsStatus` in `seed.ts` —
it renders the generated placeholder everywhere, exactly as before this task. The concept lock in
`docs/art-review/keeper-of-smoldering-embers-concept-lock.md` still records the approved direction
and the traits that must survive.

## Recommendation

Hand over the approved `.webp` (or its PNG master) by any of the three routes above. Everything
downstream is already in place and the integration is then a single asset file plus a two-line
`seed.ts` change, followed by the five-surface capture.
