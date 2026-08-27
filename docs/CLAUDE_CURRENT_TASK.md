# CURRENT TASK — Art Pack 03 Card 01: generate the master-art candidate

## Goal

Produce one master-art candidate for PURIFICATION Card 01 and commit it to a review branch.

- **Slug:** `acolyte-of-the-white-rune`
- **Name:** `Послушник Белой Руны`
- **Type / rarity / cost:** CHARACTER / COMMON / 1
- **Stats:** 1/3
- **Ability:** on play, remove Curse and Silence from a chosen ally

## Canonical source

The brief is **owner-approved and final**:

`docs/art-review/acolyte-of-the-white-rune-master-art-brief.md`

Generate against its §13 (generation prompt) and §14 (negative prompt) **verbatim**. Do not
paraphrase them, do not re-derive the direction, and do not "improve" the costume, framing or
palette — every clause in those two blocks is load-bearing and several were decided by the owner
directly.

Owner decisions already locked into the brief:

- **Light armor, not robes.** A smooth undecorated white/silver cuirass, plain gorget, two small
  matching pauldrons, vambraces on both forearms, a short ivory tabard to mid-thigh, over a plain
  high-collared under-tunic. Brushed satin matte metal, never mirror-polished. Bare hands, no
  gauntlets. It must not read as a robed cleric, and it must not read as a full ceremonial harness.
- **Three-quarter framing** cut at mid-thigh, narrow upright column silhouette.
- **Gold capped** at two thin hairlines, ≤ ~3% of the canvas.

## Who executes this

**Image generation is not available in the Claude Code session.** There is no image-generation tool
in its tool surface — re-checked at the start of this task, not assumed from the earlier Card 04
finding. The master must therefore be produced externally, exactly as it was for SHADOW Card 04.

## Required output

- **Canvas:** 1024 × 1536 (vertical 2:3)
- **Format:** WebP, quality 92, method 6 — a direct original export, so the container fourcc at
  bytes 12–16 is plain `VP8 `, not `VP8X`
- **Content:** clean illustration only — no text, no lettering, no watermark, no signature, no logo,
  no card frame, no UI

## Transport — this is the part that has failed before

**Committing the file to a branch is the only transport that has ever worked on this project.**
Chat image attachments are re-encoded in transit and never land on disk; ZIP attachments never
materialise at all; chunked base64 truncates. All three were established as failures during Card 03
and Card 04.

```sh
git checkout -b assets/acolyte-of-the-white-rune-candidate
mkdir -p art-source
cp /path/to/acolyte-of-the-white-rune.webp art-source/
sha256sum art-source/acolyte-of-the-white-rune.webp   # record this value
git add art-source/acolyte-of-the-white-rune.webp
git commit -m "art(source): Card 01 master candidate"
git push -u origin assets/acolyte-of-the-white-rune-candidate
```

Also commit a short source note at `docs/art-sources/2026-08-27-purification-card-01-master-prompt.md`
recording the exact prompt used, the generator, and the integrity values below.

Record and report, so they can be checked independently:

- SHA-256
- byte size on disk
- RIFF-declared total (`uint32` LE at bytes 4–8, plus 8) — must equal the byte size
- decoded dimensions — must be exactly 1024 × 1536

Do **not** merge the candidate branch.

## What happens next, back in Claude Code

Once the candidate is on a branch, the remaining sequence is mechanical and needs no further owner
input until the visual review:

1. Independently verify the committed bytes against the four integrity values above. A mismatch
   means the candidate is rejected, not repaired — this has caught a truncated transcode (Card 03)
   and a 14,999-byte non-image blob (Card 04).
2. Review the live surfaces: `CardView` 3:4 (collection, deck select, hand fan), `CardDetailDrawer`
   4:5, `HandCardPreview` 7:9, `CreatureSlot` on the Battlefield, and `/admin/art-review` at desktop
   and 390 px mobile widths. Card 01 is a CHARACTER, so `CreatureSlot` **is** a real surface for it —
   unlike Card 04, which was a RUNE.
3. Walk the §15 production acceptance checklist item by item against the real file.
4. **Stop for owner visual approval.** No promotion, no seed change, no sync.

## Hard scope exclusions

Do not modify:

- `apps/game-server/prisma/seed.ts`
- Prisma schema or migrations
- gameplay, balance, card text, effects, rarity, cost, stats, faction
- `artworkUrl` or `rightsStatus` for any card
- `/admin/art-review` code, except a genuinely required review-surface fix
- Battlefield UI
- `apps/game-server/scripts/sync-production-card-art.ts` or
  `.github/workflows/production-card-art-sync.yml`
- Railway / Vercel configuration
- the production database
- existing Art Pack 01 or Art Pack 02 approved assets

Nothing substitutes for the real master. Do not commit a placeholder, an approximation, a
re-encoded derivative, or a reconstructed copy. If the master is absent, say so and stop.

## Delivery

Follow the permanent `CLAUDE.md` Agent Handoff Protocol: write the handoff record to GitHub, update
`docs/AGENT_STATE.md` last, then fetch both back and verify before declaring completion.
