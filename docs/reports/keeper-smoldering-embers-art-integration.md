# Keeper of Smoldering Embers — production art integration

**Outcome: visual review PASS. Promotion held — the byte-exact master never reached the container.**

The artwork itself is good and was reviewed on every surface. What is missing is not the picture but
the *file*: the copy available here is a platform-transcoded derivative whose SHA-256 does not match
the hash the owner recorded. Per the standing rule for this card, no substitute was promoted.

Date: 2026-08-23, updated 2026-08-24 · Branch: `claude/integrate-keeper-of-smoldering-embers-art` · Base: `fa464ef`

## Status of the three pre-integration checks

The owner asked for three checks before integration. Two pass, one fails.

| Check | Required | Measured | Verdict |
| --- | --- | --- | --- |
| Dimensions | 1024×1536 | **1024×1536** | **PASS** |
| RIFF declared size == actual file size | equal | 316,336 == 316,336 | **PASS** |
| SHA-256 | `e8f46d8c98369529e94c8685abbd70ca27565df713636febd0ad125deb6842ce` | `d4ce670e3047bbfee7b3d99ff7b327705944036229fe5186310f44c09d7e95b7` | **FAIL** |

The file is internally consistent and decodes cleanly — this is not a repeat of the truncated
transport. It is a *different encode of the same picture*.

### Why the hash differs

The attachment did not arrive as a file on disk. Nothing was written to the working directory or
anywhere on the container filesystem. The image reached this session as rendered conversation
content, and a copy was recovered from the session transcript's embedded payload.

That copy carries the marks of a transcode rather than the original export:

- container is **VP8X**, whereas every approved production illustration in
  `apps/web/public/art/cards/` is plain **VP8**;
- no ALPH or EXIF chunks;
- 316,336 bytes, self-consistent, but not the owner's byte sequence.

So the pipeline re-encoded the upload in transit. The picture survived; the exact bytes did not.

#### Confirmed by the master's real size

A later hand-off recorded the true master as **603,054 bytes**. The recovered copy is **316,336
bytes** — 48 % smaller, for the same 1024×1536 image. That settles any doubt about whether the
transcode was cosmetic: roughly half the encoded data is gone, so promoting it would have shipped a
visibly degraded second-generation file under the master's name. Holding promotion was correct.

### Attempt 3 — ZIP transport (2026-08-24)

The owner then supplied `keeper-of-smoldering-embers-approved.zip` as the canonical byte-exact
transport, with expected SHA-256 `e8f46d8c…`, size 603,054 bytes, 1024×1536, RIFF total 603,054.

**The archive never reached this session.** Checked, exhaustively:

- no `*.zip` anywhere on the container filesystem, and no file named `*keeper*` created recently;
- the session transcript contains **zero** non-image attachment payloads — the document never
  entered the conversation as data, only as a filename in the message text;
- no `.zip` and no `apps/web/public/art/cards/keeper-of-smoldering-embers.webp` in the tree of any
  remote branch;
- no GitHub releases on the repository;
- no new comment or attachment on PR #32.

This is the same class of failure as attempt 2, one step earlier: attachments to chat messages do
not materialise as files in this remote container. Nothing was verified, nothing was promoted.

### Why that blocks promotion but not review

Re-encoding is lossy. Committing this file as
`apps/web/public/art/cards/keeper-of-smoldering-embers.webp` would put a second-generation copy into
the repository under the name of the approved master, and would silently fail the provenance check
the owner explicitly asked for. Given this card has already lost one transport to an unverified
hand-off, that is the wrong trade.

Reviewing with it is fine and is exactly what
`apps/web/public/art-review-candidates/` exists for: it is gitignored, nothing about it is
committed, and the surfaces render the real components against it.

## Visual review — PASS

Performed against the live local stack (Postgres + Redis + seeded game-server on :4000 + `next dev`
on :3000), with the recovered file placed at
`apps/web/public/art-review-candidates/keeper-of-smoldering-embers.webp` and reviewed through
`/admin/art-review`. The page badge confirmed **"showing CANDIDATE (not wired to artworkUrl)"** —
the card's `rightsStatus` stayed `placeholder` throughout.

| Surface | Component | Verdict |
| --- | --- | --- |
| Raw master 2:3 | — | **PASS** |
| Collection / card grid | `CardView` 3:4 | **PASS** |
| Card Detail | `CardDetailDrawer` 4:5 | **PASS** (one caveat, below) |
| Hand Preview | `HandCardPreview` 7:9 | **PASS** |
| Battlefield board slot | `CreatureSlot` 3:4 | **PASS** |
| Mobile 390×844 | whole row | **PASS** |

Both real modals were opened, not just the static crops — Card Detail and Hand Preview each render
the illustration correctly with the frame, stats and ability text on top.

### Crop geometry, measured against the master

| Surface | Ratio | Visible height at 1024 px | Trim |
| --- | --- | ---: | ---: |
| CardView / CreatureSlot | 3:4 | 1365 px | 85 top + 86 bottom |
| Hand preview | 7:9 | 1317 px | 109 top + 110 bottom |
| Card detail | 4:5 | 1280 px | 128 top + 128 bottom |

### Acceptance criteria from the concept lock

| Criterion | Result |
| --- | --- |
| Heavy ember guardian, **not** another fast SHADOW assassin | **PASS** — decisively. Planted, frontal, weight-bearing; no trace of the `ashen-blade` lunge |
| Massive monumental silhouette, shoulders wider than hips | **PASS** — broad spiked pauldrons over a wide triangular mantle |
| Closed helm, face fully hidden | **PASS** — spiked crown-helm, no skin, no eyes, only an ember cross in the visor |
| Charred armour with ember cracks | **PASS** — extensive, readable |
| Halberd as defining silhouette element | **PASS** — large blocky head, vertical haft, both gauntlets on it |
| Gothic ruins, ash, smouldering glow | **PASS** — cathedral interior, burnt rose window, ember-lit floor |
| Warm-only emissive, no magenta/violet | **PASS** — amber/orange throughout; nothing from the family's cool palette |
| Echo-Shadow present but secondary | **PASS** — small hooded figure at left, well outside the main silhouette |
| Ashen-order identity | **PASS** — sigil on the breastplate and an ember-runic banner at right |
| Black-fill silhouette test | **PASS** — the crown-helm, pauldron mass, mantle triangle and polearm all read at threshold; unmistakably not the duelist |
| Crack scale survives ~160 px | **PASS** — the crack network resolves as a coherent warm glow, not noise |

### Caveats found (none blocking)

1. **Halberd upper spike grazes the top edge in the 4:5 crop.** The 128 px trim takes the very tip of
   the blade's upper point. The weapon still reads completely — head, hooks and haft are all inside
   the frame — but it is touching the boundary the concept lock warned about. Acceptable as-is;
   worth knowing if the art is ever re-cropped or re-framed.
2. **Fire runs slightly hotter than "dying embers".** There are open flames at lower left and lower
   right, and the crack network is bright in places. The overall read is still ash-and-ember rather
   than fire-knight, and it stays clearly distinct from the SHADOW family, but it sits nearer the
   flame end of the brief than the smouldering end.
3. **Very low-key overall.** At `CreatureSlot` size the figure reads primarily through its ember
   pattern rather than its edges. Legible, but the shape carries less than the glow does at the
   smallest surface.

## What was NOT done, and why

| Step | Status | Reason |
| --- | --- | --- |
| Commit `apps/web/public/art/cards/keeper-of-smoldering-embers.webp` | **not done** | SHA-256 mismatch — would commit a transcoded derivative as the master |
| `seed.ts` `artworkUrl` / `rightsStatus: 'owned'` | **not done** | promotion follows the asset; also would 404 with no file at the path |
| `docs/art-pack-02.md` Card 03 → FINAL APPROVED | **not done** | the record must not claim a promotion that did not happen |
| Re-seed | **not done** | nothing to seed |

## Validation

Run on the unmodified checkout — this branch changes only Markdown, so the gates exercise `main`'s
state, not an integration:

| Gate | Command | Result |
| --- | --- | --- |
| Dependency packages | `npm run build -w @kod-raido/shared -w @kod-raido/game-engine -w @kod-raido/ui` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npm run typecheck` | exit 0 |
| Tests | `npm test` | exit 0 — **349 passed** (156 + 32 + 24 + 88 + 49) |
| Build | `npm run build` | exit 0 — "Compiled successfully" |
| Live stack | migrate + seed + game-server + `next dev` | up; 64 cards seeded; `/admin/art-review` served the candidate (HTTP 200) |

## Screenshots

Captured and delivered to the owner, **not committed** (CLAUDE.md rule E):

| File | Contents |
| --- | --- |
| `01-admin-art-review-keeper-row.png` | the live `/admin/art-review` Keeper row, all five surfaces |
| `02-surface-1..5-*.png` | each surface panel individually |
| `03-card-detail-modal.png` | the real Card Detail modal |
| `04-hand-preview-modal.png` | the real Hand Preview modal |
| `05-mobile-390-keeper-row.png` | mobile 390×844 |
| `keeper-crop-contact-sheet.jpg` | raw 2:3 + all three crops + 160 px / 110 px small-size checks |
| `silhouette-threshold.png` | black-fill silhouette test |

## Confirmed untouched

Production `artworkUrl`, `rightsStatus`, `apps/game-server/prisma/seed.ts`, the production database,
Railway, Vercel, gameplay, balance, card text, effects, rarity, stats, faction, server logic,
desktop and mobile Battlefield layout, every other card's artwork, and every unrelated branch or PR.
No new concept art. The only committed change on this branch is this report.

The local Postgres was migrated and re-seeded to run the review — that is the disposable dev
database in this container, not production, and `seed.ts` itself was not edited.

## To finish the integration

One thing is needed: **the byte-exact `.webp`, inside the git repository.**

Three transports have now been tried and two distinct failure modes are established:

| # | Transport | Result |
| --- | --- | --- |
| 1 | chunked base64 on `assets/…-candidate-source` | truncated — final chunk was the literal `PLACEHOLDER`, 1,324 bytes short |
| 2 | image attached to a chat message | re-encoded in transit — 316,336 bytes instead of 603,054, hash mismatch |
| 3 | `keeper-of-smoldering-embers-approved.zip` attached to a chat message | never materialised — no file, no payload in the transcript, nothing on any branch |

The common factor in 2 and 3: **chat attachments do not become files in this remote container.**
Repeating that route will keep failing regardless of the archive format.

What does work is git — the repository is fully reachable from here. From a machine that has the
master:

```sh
git checkout -b assets/keeper-of-smoldering-embers-approved
mkdir -p art-source
cp /path/to/keeper-of-smoldering-embers.webp art-source/
sha256sum art-source/keeper-of-smoldering-embers.webp   # expect e8f46d8c…
git add art-source/keeper-of-smoldering-embers.webp
git commit -m "art(source): approved Keeper master"
git push -u origin assets/keeper-of-smoldering-embers-approved
```

603 KB is an ordinary binary for git; no chunking, no archive, no encoding step that can silently
alter it. Dropping it straight into `apps/web/public/art/cards/` on a branch works equally well.

Once it is in the repo:

1. `sha256sum` == `e8f46d8c98369529e94c8685abbd70ca27565df713636febd0ad125deb6842ce`, and RIFF-declared
   length == file size.
2. Place at `apps/web/public/art/cards/keeper-of-smoldering-embers.webp`.
3. Two lines in `apps/game-server/prisma/seed.ts` (~line 746), matching `ashen-blade`:
   ```ts
   // Art Pack 02 Card 03 - owner-approved production artwork.
   artworkUrl: '/art/cards/keeper-of-smoldering-embers.webp',
   rightsStatus: 'owned',
   ```
4. Re-seed, re-capture the five surfaces against the real production path, and flip
   `docs/art-pack-02.md` Card 03 to FINAL APPROVED.

The visual verdict above carries over unchanged — the picture has already been reviewed and passed.
Only provenance is outstanding.
