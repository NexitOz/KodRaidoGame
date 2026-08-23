# Keeper of Smoldering Embers - owner review notes

Status: **BLOCKED - candidate source is incomplete.** No production art mutation is allowed, and
the visual review itself cannot be performed until a valid source lands.

> This file covers the **earlier, broken candidate** only. The approved concept is recorded in
> [`keeper-of-smoldering-embers-concept-lock.md`](./keeper-of-smoldering-embers-concept-lock.md)
> (canonical: what is approved and must be preserved), and the generation direction in
> [`keeper-of-smoldering-embers-master-art-brief.md`](./keeper-of-smoldering-embers-master-art-brief.md)
> (prompt, differentiation audit, crop maths). The transport investigation below is still accurate
> and is kept as the record of why that candidate could not be reviewed.

## Card (unchanged, for context only)

|                      |                                         |
| -------------------- | --------------------------------------- |
| Slug                 | `keeper-of-smoldering-embers`           |
| Name                 | Хранитель Тлеющих Углей                 |
| Type / rarity / cost | CHARACTER / RARE / 3                    |
| Stats                | 2 / 3                                   |
| Faction tag          | Shadow                                  |
| Ability              | При выходе: призовите Эхо-Тень 1/1      |
| `artworkUrl`         | none - still on the shipped placeholder |
| `rightsStatus`       | unset                                   |

Nothing above is touched by this review. The Echo-Shadow named in the acceptance criteria is this
card's own summoned 1/1 token, which is why the art is meant to keep it visually secondary.

## Blocker: the candidate cannot be reconstructed

The candidate is transported as chunked base64 on
`assets/keeper-of-smoldering-embers-candidate-source`, under
`art-source/keeper-of-smoldering-embers/`. That transport is incomplete.

| Check                                      | Result                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------- |
| Final chunk `q60-15.b64`                   | contains the literal text `PLACEHOLDER`, not base64 data                  |
| Bytes declared by the WebP RIFF header     | 136,324                                                                   |
| Bytes recoverable from the 15 valid chunks | 135,000                                                                   |
| **Missing**                                | **1,324 bytes (~1%), the tail of the VP8 bitstream**                      |
| `expectedSha256` (`7bde6a98…`)             | not reproducible                                                          |
| Actual reconstructed sha256                | `933f5ae8751ce73b77daa76a936e65d2b9fb2fb34ef0b9184d91f49e3bf73636`        |
| Chromium decode                            | reports 1024x1536 from the header, renders a **uniform blank grey frame** |

The stub chunk could only ever have carried ~8 bytes even if it had been valid base64, so this is
a genuinely truncated export rather than a corrupted last line. No character, polearm, ember
cracks or Echo-Shadow are present in anything that decodes.

### Why this is the asset and not the method

The same reconstruction procedure was run against `assets/ashen-blade-candidate-source`, which
uses an identical chunking scheme, as a control:

- ashen-blade: 8 chunks, RIFF declares 83,486 bytes, 83,486 recovered, **0 missing**, decodes to
  the full illustration.
- keeper: 16 chunks, last one a placeholder, 1,324 bytes short, decodes to grey.

Every other branch was also searched (`claude/art-pack-02-keeper-candidate-review`,
`claude/sync-8-card-art-production`, `codex/production-card-art-sync`,
`art-pack-02/whisper-of-the-forgotten`, `art-pack-01`, `claude/art-pack-01-current-main`,
`claude/art-pack-02-ashen-blade-candidate`, `main`). None contains a Keeper image - only the two
metadata files from PR #22. The broken chunk set is the only copy that exists.

## What is NOT verified

The acceptance criteria below could **not** be evaluated, because there is no viewable artwork.
They are carried forward unchanged for whoever reviews the re-exported candidate:

- reads as a heavy elite ember guardian, **not** another fast SHADOW assassin
  (the approved `ashen-blade` already occupies the agile-assassin silhouette, so this
  differentiation is the main thing to check);
- ritual/ceremonial rather than nimble;
- ember-cracked blackened armour, cracks still readable at hand and battlefield sizes;
- signature ember-forged polearm still readable after crop;
- Echo-Shadow present but clearly secondary to the main silhouette.

## Crop analysis (still valid - surface ratios re-checked against current `main`)

The review surfaces use wider aspect ratios than a 2:3 master, so a centred `object-cover` crop
loses height. Verified against the current
`apps/web/src/app/admin/art-review/page.tsx`: CardView and CreatureSlot 3:4,
HandCardPreview 7:9, CardDetailDrawer 4:5.

| Surface                 | Ratio | Visible height at 1024 px width |                 Approx. trim |
| ----------------------- | ----- | ------------------------------: | ---------------------------: |
| CardView / CreatureSlot | 3:4   |                         1365 px |   ~85 px top + ~86 px bottom |
| Hand preview            | 7:9   |                         1317 px | ~109 px top + ~110 px bottom |
| Card detail             | 4:5   |                         1280 px | ~128 px top + ~128 px bottom |

`4:5` is the tightest crop and the one to watch: a polearm reaching close to the top edge of the
2:3 master can lose its tip, and the lower boots/foreground lose breathing room. The Echo-Shadow
is comparatively safe because the crop removes vertical, not horizontal, area.

## Recommended next action

0. **Generate the polished master-art** against
   [`keeper-of-smoldering-embers-master-art-brief.md`](./keeper-of-smoldering-embers-master-art-brief.md),
   which carries the prompt, the negative prompt, and the crop-safe composition constraints.
1. **Re-export the candidate** and re-upload the transport with a complete final chunk. The
   reassembly must satisfy `sha256sum` against a recorded hash _and_ the RIFF-declared length must
   equal the reconstructed byte count - the existing README's `sha256sum` step would have caught
   this had its output been compared.
2. Drop the reconstructed file at
   `apps/web/public/art-review-candidates/keeper-of-smoldering-embers.webp` (gitignored) and open
   `/admin/art-review`. The Keeper row is already registered, so no code change is needed.
3. Judge the acceptance criteria above, paying particular attention to the 4:5 detail crop.
4. Only after approval does the separate wiring step (`artworkUrl`, `rightsStatus: 'owned'`) apply,
   exactly as it did for `whisper-of-the-forgotten` and `ashen-blade`.

No changes to `seed.ts`, production `artworkUrl`, the database, Railway, balance, abilities, or
gameplay are part of this review.
