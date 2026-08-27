# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **CANDIDATE-V2 BYTE-VERIFIED IN GITHUB — REAL VISUAL QA NEXT**
- **Current target:** `seal-of-the-curse` / «Печать Проклятия»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `568b4a9044159fa394efa312622e630a18382d7a`
- **Latest completed handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-02-github-actions-transport-success.md`
- **Transport report commit:** `7d25caf10d4b2aeea8dfba5e8026c13919ffe97a`
- **Prior handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-02-wetransfer-transport-blocked.md`
- **Branch for current coordination:** `main`
- **Open blocker:** NONE for transport. Claude Code can now fetch the exact candidate directly from GitHub.

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

## Current task — real visual QA only

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
- Card 02 `seal-of-the-curse` — exact candidate-v2 in GitHub; **real visual QA next**
- Card 03 `warden-of-the-barrier` — not started
- Card 04 `rune-of-curse-breaking` — not started
