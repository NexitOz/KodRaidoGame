# Generation package — `warden-of-the-barrier` (Art Pack 03, Card 03)

Companion to the approved brief `warden-of-the-barrier-master-art-brief.md`.

**Brief status: APPROVED 2026-08-30.** Master-art candidate generation is authorized against §13.
**Integration, promotion and production sync are NOT authorized by this package.**

## 0. What this package is, and the one thing it cannot do

This is everything needed to produce and land a Card 03 candidate: the locked prompt pair, the
output contract, the transport route, the integrity gate, and the QA plan.

**No image was generated in this session, and none could be.** Claude Code has no image-generation
tool here, and this environment's egress permits GitHub infrastructure only — the same standing
constraint recorded for Cards 01 and 02, both of which were generated externally and landed by
transport. So the candidate image must be produced by the owner or ChatGPT against §1 below, then
landed by the §3 route.

Nothing here is speculative about the _process_: §3's transport is the exact route that succeeded
for Card 02 (workflow run `33117588154`), and §4's gate is the one that has now caught three
truncated transports.

---

## 1. Locked prompt pair — copy-paste ready

Identical to brief §13. Reproduced here so the generation operator needs one file, not two.

### Positive

```
Cinematic realistic premium collectible-card illustration with a subtle painterly finish — visible
brushwork in the soft passages, painted edges rather than photographic micro-detail, hand-rendered
rather than photobashed or 3D. Vertical 2:3, 1024x1536.

A woman warden of a white-rune order, seen three-quarters, braced behind a segmented white-steel
ward-screen she has just driven into the ground and locked upright. Her gauntleted left hand rests
flat on the screen's top rail; her right arm hangs free and empty. Weight dropped onto her forward
leg, torso angled into the barrier, composed and focused expression, effort in the stance.

She wears fitted brushed white-steel plate armor: structured cuirass with placard and articulated
fauld, plain gorget with a short mail collar, articulated pauldrons, full articulated gauntlets,
greaves on the forward leg. Matte satin metal, never mirror-polished. Clean pressed edges, intact
material. Bare-headed, hair bound tightly back, no crown, no helm, no halo.

The ward-screen is rectangular with a flattened top, two or three vertical segments joined by
visible hinges, a locking latch on the top rail, a foot-plate spiked into pale stone with a little
displaced grit at the contact. A single engraved horizontal channel crosses the panel at two-thirds
height, inlaid with cool blue-white light; the channel exits both side edges of the panel and
continues, dimmer and defocused, beyond both edges of the frame.

Bright, diffuse, near-shadowless cold light. No deep shadows, no dramatic key. Sparse cold light
motes. Pale white-stone interior behind her, strongly defocused, at most a wall plane and one pier,
no sharp edges and no bright highlights. White, silver and ivory palette with the faintest gold
hairlines.

Composition: head near the upper third, face clearly readable, the lit channel near the vertical
centre of the frame, the barrier's ground anchor low but fully visible.
```

### Negative

```
photograph, photorealistic, photoreal skin pores, photobash, 3D render, CGI, octane render,
airbrushed plastic skin, round shield, buckler, shield boss, compass emblem, star emblem, heraldry,
crest, spear, polearm, sword, second weapon, crown, tiara, halo, circlet, helmet, visor, cape,
mantle, cloak, robes, vestments, tattered cloth, ragged edges, frayed fabric, cathedral, rose
window, stained glass, spires, banners, staircase, rune circle on the floor, crowd, ranked figures,
congregation, kneeling followers, energy bubble, force field, dome shield, glowing sphere, spell
blast, beam, projectile, explosion, casting from open palm, magic swirl, crimson, red, violet,
purple, magenta, orange, ember, fire, sparks, ash, smoke, rot, veins, tendrils, corruption, deep
shadow, chiaroscuro, black background, silhouette, translucent, ghostly, spectral, gold filigree
fields, ornate baroque decoration, text, letters, watermark, signature, logo, UI, card frame, stats,
border
```

---

## 2. Output contract — non-negotiable

The generated master must satisfy all of these **before** it is transported. Getting the format
right at export saves a rejected transport cycle.

| Property            | Required value                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| Dimensions          | **exactly 1024 × 1536** (vertical 2:3)                                                                    |
| Format              | **WebP**                                                                                                  |
| Container           | plain **`VP8 `** fourcc — an original export, **not** a `VP8X` transcode                                  |
| RIFF-declared total | must equal the real byte size                                                                             |
| Decode              | full decode clean, 4,718,592 RGB bytes                                                                    |
| Content             | **no text, no lettering, no watermark, no signature, no logo, no UI, no stats, no card frame, no border** |

The app composites its own frame and badges at display time, so any baked-in frame makes the file
unusable regardless of how good the art is.

**Do not re-encode, resize, upscale, sharpen or "clean up" the file after export.** Every one of
those changes the bytes, and the whole pipeline is built on byte identity.

### Composition targets to check before transporting

Cheap to verify in any image viewer, and each one is a §11 reject if wrong:

- head top at **y ≈ 300–340** (≥ ~170 px above the binding 4:5 cut at row 128)
- lit rune channel at **y ≈ 760–900**
- barrier ground anchor visible at **y ≤ 1280**
- the channel visibly **exits both left and right frame edges**
- bare head, no crown/helm/halo; second hand empty; panel rectangular, not round

---

## 3. Transport — the proven agent-owned route

Do **not** use chat attachments, chunked base64, or the GitHub Contents API. All three have
truncated a master on this project (14,999 / 15,042 / 27 bytes).

Use the route that worked for Card 02 — GitHub Actions runner fetching the raw provider object:

1. Generator uploads the exact master to a provider with a machine-readable file API.
2. A temporary transport branch — suggested `transport/card03-github-actions` — carries a workflow
   modelled on Card 02's `Card02 Binary Transport`.
3. The GitHub-hosted runner downloads the raw object and **hard-gates every value in §4 before
   touching git.**
4. From fresh `main`, the runner creates the candidate branch, commits the exact bytes through
   normal git, pushes, fetches the remote branch back, and re-verifies size + SHA-256 + Git blob SHA
   from the fetched objects.
5. The transport/probe workflow stays isolated on that temporary branch and is **never merged into
   `main`.**

**Fallback:** a direct `git` push from any machine holding the master, checking
`git cat-file -s HEAD:art-source/warden-of-the-barrier.webp` **before** pushing.

### Canonical names for this card

| Thing                                      | Path / name                                                        |
| ------------------------------------------ | ------------------------------------------------------------------ |
| Candidate branch                           | `assets/warden-of-the-barrier-candidate`                           |
| Path inside candidate branch               | `art-source/warden-of-the-barrier.webp`                            |
| Temporary transport branch                 | `transport/card03-github-actions` (never merged)                   |
| Local review staging (gitignored)          | `apps/web/public/art-review-candidates/warden-of-the-barrier.webp` |
| Production path — **later, not this task** | `apps/web/public/art/cards/warden-of-the-barrier.webp`             |

The candidate branch does not exist yet and is **deliberately not pre-created** — the transport run
creates it, and an empty or placeholder branch would only invite a later agent to mistake it for a
real candidate.

---

## 4. Integrity gate — run before any review

Card 03's canonical values **cannot be stated in advance**: they are properties of a file that does
not exist yet. What is fixed is the _procedure_ and the two values that are knowable a priori.

**Known in advance:**

- dimensions **1024 × 1536**
- fourcc plain **`VP8 `**
- RIFF-declared total **equals** actual byte size
- full decode **PASS**, 4,718,592 RGB bytes
- **no** text/watermark/frame in the image

**Recorded at generation, then enforced everywhere downstream:**

- byte size
- SHA-256
- Git blob SHA (`git hash-object`)

The generator must publish size and SHA-256 **from the machine that produced the file**, before
transport. Those become the canonical values, and every later step compares against them.

**Verification points — all three are mandatory:**

1. On the runner, after download, **before git**.
2. From the committed object, before push: `git cat-file -s HEAD:art-source/warden-of-the-barrier.webp`.
3. From the **fetched remote branch**, after push — a fresh fetch, not the local copy.

Any mismatch at any point: **STOP — REJECTED.** Do not repair, re-encode, resize, regenerate or
substitute. The three truncations on this project were all caught exactly here.

---

## 5. QA plan once a verified candidate exists

Card 03 is a **CHARACTER**, so unlike Card 02 it **does** occupy a Battlefield board slot.
`CreatureSlot` is a real review surface and must be included — nine surfaces, not eight.

1. raw 2:3 master
2. `CardView` 3:4
3. **`CreatureSlot` 3:4 — Battlefield board slot (CHARACTER only)**
4. `CardDetailDrawer` 4:5
5. `HandCardPreview` 7:9
6. `/admin/art-review` desktop
7. `/admin/art-review` at 390 px
8. 92 px thumbnail
9. 92 px grayscale / value-only

Run against the real application stack, as for Card 02: Postgres → migrate → seed → game-server →
web, driven with Playwright. The card must be registered in `/admin/art-review` as a **candidate**
(no `reviewArtworkUrl`), so it reads from the gitignored drop and candidate isolation can be proved
by network trace and page badges.

**Measured acceptance thresholds**, all from brief §7/§9/§12:

| Metric                        | Threshold                                            |
| ----------------------------- | ---------------------------------------------------- |
| 92 px edge density            | **24–28** (between Common 20.95 and Legendary 31.85) |
| 92 px grayscale spread p5–p95 | **≥ 140**, with p5 **≥ ~25** (no crushed blacks)     |
| Gold coverage                 | **≤ 3%** of canvas                                   |
| Crimson / violet / magenta    | effectively **zero**                                 |
| Background at 92 px           | **flat pale field, no readable architectural form**  |
| 390 px layout                 | `scrollWidth == clientWidth`, no horizontal overflow |

Then walk brief §11 (23 automatic-reject conditions) and §12 (the positive checklist) item by item.

**One expectation to set before review opens:** this card will look **less photographic** than Cards
01 and 02 by deliberate owner decision (§14 #4). That is not a defect and must not be logged as one.
Faction material language, however, is unchanged and still fully enforced.

---

## 6. Stop condition

Candidate delivery ends at **owner visual approval**, exactly as Card 02 did. Final status must be
one of:

- **READY FOR OWNER VISUAL APPROVAL**
- **REJECTED / BLOCKED**

Not authorized by this package, and each requiring its own separate owner step afterwards:
integration to the production artwork path, any `seed.ts` / `artworkUrl` / `rightsStatus` change,
extending the controlled sync 12 → 13, or any production dispatch.

`SYNC-12-CARD-ART-PRODUCTION` is **consumed**. A thirteenth card would need a fresh confirmation
string and a source pin repointed at a new already-merged integration commit.
