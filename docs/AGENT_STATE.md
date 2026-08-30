# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **READY FOR OWNER VISUAL APPROVAL — integrity PASS, full real visual QA complete, 2 caveats recorded**
- **Current target:** `seal-of-the-curse` / «Печать Проклятия»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `568b4a9044159fa394efa312622e630a18382d7a`
- **Latest handoff:** `docs/agent-reports/2026-08-30-art-pack-03-card-02-candidate-v2-visual-qa.md`
- **Latest task-result commit:** `a151140` (QA report)
- **Review-only code branch:** `claude/card-02-review-support` @ `45bdb37` — no PR opened
- **Prior handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-02-github-actions-transport-success.md`
- **Transport report commit:** `7d25caf10d4b2aeea8dfba5e8026c13919ffe97a`
- **Branch for current coordination:** `main`
- **Open blocker:** NONE. **Awaiting owner visual approval**, including a decision on the two caveats below.

## Card 01 — COMPLETE END TO END

`acolyte-of-the-white-rune` / «Послушник Белой Руны» is FINAL APPROVED and live in production.

- integration source: `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`
- production sync run: `33091769787`
- final source of truth: `11/11`
- `SYNC-11-CARD-ART-PRODUCTION`: **CONSUMED**

No production operation is currently authorized.

## Card 02 — canonical facts

- slug: `seal-of-the-curse`
- name: «Печать Проклятия»
- faction: PURIFICATION
- type: EVENT
- rarity: RARE
- cost: 2
- effect: apply Curse to a chosen enemy; a cursed enemy cannot attack

Master-art brief:

`docs/art-review/seal-of-the-curse-master-art-brief.md`

Locked concept:

- Curse = binding/restraint, not corruption
- rigid white/silver rune clamp locks hostile weapon hand to guard/hilt
- no visible caster
- cinematic realistic / semi-realistic premium CCG
- no SHADOW/VEIL corruption palette or spell-blast language

The owner accepted the generated image visually on 2026-08-27 for repository QA. This is **not yet final post-QA production approval**. Do not regenerate or alter the accepted image.

## Card 02 — exact accepted master integrity

Canonical values:

- dimensions: `1024 × 1536`
- byte size: `326508`
- RIFF total: `326508`
- FourCC: plain `VP8 `
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- Git blob SHA: `95940017577f7152a28bf76122912c37e548c7e0`
- full decode: PASS

## Card 02 — candidate-v2 is now exact and reachable

Candidate branch:

`assets/seal-of-the-curse-candidate-v2`

Candidate commit:

`67405697628a3dec3fa8e9dab2cdb27c273b6af1`

Parent:

`d6428d2eb6cd07cfb8a26e49de6cfef64a8f441e`

Path:

`art-source/seal-of-the-curse.webp`

The branch is one commit ahead of that parent and adds exactly the one WebP above.

### Successful agent-owned transport

Temporary transport branch:

`transport/card02-github-actions`

Successful workflow:

- workflow: `Card02 Binary Transport`
- run: `33117588154`
- job: `98676113281`
- conclusion: `success`

The GitHub-hosted runner used the firestorage public file API, obtained a provider-issued raw download URL, downloaded the exact WebP, then proved:

- provider filename: `seal-of-the-curse.webp`
- provider MIME: `image/webp`
- provider size: `326508`
- HTTP Content-Length: `326508`
- downloaded size: `326508`
- SHA-256: canonical exact
- Git blob SHA: canonical exact
- RIFF total: `326508`
- FourCC: `VP8 `
- dimensions: `1024x1536`
- Pillow full decode: PASS

Before push:

- `LOCAL_GIT_SIZE=326508`
- local SHA-256 = canonical exact
- local Git blob SHA = `95940017577f7152a28bf76122912c37e548c7e0`

After push + remote fetch:

- `REMOTE_GIT_SIZE=326508`
- remote SHA-256 = canonical exact
- remote Git blob SHA = `95940017577f7152a28bf76122912c37e548c7e0`
- `CANDIDATE_V2_REMOTE_INTEGRITY=PASS`

Independent GitHub API verification after the workflow also reports the candidate path as:

- type: `blob`
- size: `326508`
- blob SHA: `95940017577f7152a28bf76122912c37e548c7e0`

Therefore the candidate in GitHub is byte-identical to the accepted master.

The temporary transport/probe workflows exist only on `transport/card02-github-actions`. **Do not merge that transport branch into main.**

## Broken transport evidence — DO NOT USE

Old branch:

`assets/seal-of-the-curse-candidate`

Old candidate commit:

`6f0e00fca98b7452c4c1f987165cf3157753dccb`

That file is only 27 bytes and remains permanently rejected evidence. Never repair, reuse, or promote it.

The failed WeTransfer transfer also contained an HTML share page rather than the WebP and must not be used.

## Card 02 — VISUAL QA COMPLETE (2026-08-30)

Full report: `docs/agent-reports/2026-08-30-art-pack-03-card-02-candidate-v2-visual-qa.md`

**Independent integrity gate: FULL PASS.** Verified from the fetched Git objects — branch head
`6740569`, parent `d6428d2`, exactly one commit adding only the one WebP, `git cat-file -s` 326508,
blob SHA `95940017…`, SHA-256 `699db6b7…`, RIFF total 326508, FourCC plain `VP8 `, 1024×1536, and a
full 4,718,592-byte decode.

**The 313,964 discrepancy is settled.** The real master declares `326508` in its own RIFF header;
`313964` came from the 27-byte fragment. The canonical values were correct as written.

**QA ran against the real stack** (Postgres 16 → migrate → seed → NestJS `:4000` → Next.js `:3000`,
driven with Playwright), not mock renders. All eight surfaces PASS. `CreatureSlot` correctly
excluded — the EVENT takes the four-surface path. No horizontal overflow at 390 px.

**Candidate isolation proven three ways:** the live API still reports `rightsStatus: placeholder`
with the original SVG data-URI `artworkUrl`; the network trace resolves only
`/art-review-candidates/seal-of-the-curse.webp`; the page badges read `placeholder` +
`showing CANDIDATE (not wired to artworkUrl)`.

**All twenty automatic-reject conditions checked and cleared**, several by measurement: 0
violet/magenta and 3 red pixels; gold 0.01% against a 5% ceiling; dark-arm median value 71/255 with
one pixel below 12 (no black silhouette); specular centroid (494, 563) on the clamp face; and a
glow-removed test confirming the stop reads on geometry alone.

**Crop safety:** clamp top at y≈262 — **~134 px clearance** against the binding 4:5 cut at 128, the
~130 px the brief asked for, correcting Card 01's 2–4 px. The pommel extends past 1280 and is
clipped at 4:5, but is not essential; clamp, fist and guard sit well above.

**92 px hierarchy:** edge density 20.95 (Common) < 23.73 (Rare) < 31.85 (Legendary) — monotonic and
independent of the rarity frame. Grayscale range 155 keeps clamp and hand separated.

### Two caveats — owner decision needed before approval

1. **Background describes architecture.** §7 of the brief asked for a "near-abstract" space carrying
   "almost no information"; the candidate shows a pale, blurred interior arcade with columns, arches
   and a receding tiled floor. It never competes with the seal, and reject #11's six named items
   (facade, rose window, halo, banners, floor rune-circle, crowd) are all absent — so **not** an
   automatic reject as written. But it is the one genuine divergence from the locked brief.
2. **Star emblem on the enemy pommel.** Reject #13 covers insignia on enemy _armour_; this is on the
   weapon, so #13 does not fire. Unlit dark steel, no colour, glow or iridescence — unlike COSMIC's
   sheen — and it vanishes at 92 px. Assessed neutral, but the owner's call.

### Review-only code change

`apps/web/src/app/admin/art-review/page.tsx` — one `REVIEW_TARGETS` entry with **no**
`reviewArtworkUrl`, so the page reads the gitignored candidate and cannot touch production
`artworkUrl`/`rightsStatus`. Branch `claude/card-02-review-support` @ `45bdb37`, no PR opened.
Validation: `git diff --check` clean, Prettier PASS, lint PASS, typecheck PASS (after building
`shared` + `ui`), tests PASS (6 files / 32 tests), production build PASS.

### Recommended next action

Owner visual approval, with an explicit decision on the two caveats. If approved, integration is the
separate authorized step — wire `artworkUrl` to `/art/cards/seal-of-the-curse.webp` with
`rightsStatus: 'owned'`. `SYNC-11-CARD-ART-PRODUCTION` is **consumed**: a twelfth card needs fresh
owner confirmation and a sync pin repointed at a new already-merged integration commit.

## Superseded task sequence — completed 2026-08-30

Execute:

`docs/CLAUDE_CURRENT_TASK.md` @ `568b4a9044159fa394efa312622e630a18382d7a`

Required sequence:

1. Sync fresh `main` and fetch `assets/seal-of-the-curse-candidate-v2`.
2. Independently verify remote branch head, size, SHA-256, Git blob SHA, RIFF, FourCC, dimensions, and full decode.
3. Stage exact bytes only at the gitignored review-candidate path.
4. Re-check staged SHA-256.
5. Run real visual QA on:
   - raw 2:3
   - `CardView` 3:4
   - `CardDetailDrawer` 4:5
   - `HandCardPreview` 7:9
   - `/admin/art-review` desktop
   - `/admin/art-review` 390px
   - 92px thumbnail
   - 92px grayscale/value-only
6. EVENT does not use `CreatureSlot`.
7. Walk every Card 02 master-art brief gate, including strict y≈260–1280 safe zone.
8. Compare at 92px: Common Acolyte < Rare Event < Legendary High Warden.
9. Record every caveat.
10. Write durable handoff.
11. Update this file last and fetch it back from GitHub.

Final status must be exactly:

- **READY FOR OWNER VISUAL APPROVAL**, or
- **REJECTED / BLOCKED**

Stop there.

## Hard exclusions

No promotion is authorized. Do not:

- modify seed/Prisma/schema/migrations
- modify gameplay, balance, or canonical card data
- write into `apps/web/public/art/cards/`
- change production `artworkUrl` or `rightsStatus`
- merge/promote the candidate
- touch Battlefield gameplay/layout
- modify or dispatch production sync workflows
- access Railway/Vercel/production DB
- begin Card 03
- alter the accepted WebP bytes

## Art binary transport policy — proven agent-owned pipeline

The user must **not** be used as a manual file courier.

For generated art when Claude Code has GitHub-only egress:

1. ChatGPT keeps or uploads the exact master through a provider with a machine-readable file API.
2. A temporary GitHub Actions transport branch fetches the raw provider object using a GitHub-hosted runner.
3. The runner hard-gates canonical byte size + SHA-256 + Git blob SHA + format + dimensions + full decode **before git**.
4. From fresh `main`, the runner creates the candidate branch, commits exact bytes through normal git, pushes, fetches the remote branch back, and re-verifies remote size + SHA-256 + Git blob SHA.
5. Transport/probe workflows remain isolated on the temporary transport branch and are never merged into `main`.
6. Claude Code performs QA only after the candidate is already inside GitHub and independently re-verifies it.
7. Manual owner upload is fallback-only, not the standard process.

Never use GitHub Contents-API binary upload/base64-in-JSON for generated masters; this project has already observed binary truncation through that route.

## Art Pack 03 remaining cards

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — candidate-v2 byte-verified, full visual QA complete; **READY FOR OWNER VISUAL APPROVAL** (2 caveats)
- Card 03 `warden-of-the-barrier` — not started
- Card 04 `rune-of-curse-breaking` — not started
