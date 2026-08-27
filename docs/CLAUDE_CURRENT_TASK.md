# CURRENT TASK — Art Pack 03 Card 01: verify and visually review candidate

## BLOCKED 2026-08-27 — candidate v1 REJECTED, re-transport required

Step 1 was executed and **failed**. `assets/acolyte-of-the-white-rune-candidate` @ `1652efaa` must
not be used.

The committed blob is **15,042 bytes while its own RIFF header declares 214,378** — 7.0% of the file
arrived — and it does not decode. Its SHA-256 is `7822d32a…`, not the expected `cb766584…`. GitHub
reports the blob as 15,042 bytes and the commit's diffstat records `Bin 0 -> 15042 bytes`, so the
wrong bytes went in when the commit was created. This is not a fetch artifact, and the generator's
reported 214,378 / `cb766584…` are the values of its **local** file, not of what landed in git.

Steps 2–6 (register in `/admin/art-review`, stage the candidate, review the five surfaces, walk §15)
were **not** performed and cannot be — there is no decodable image. **No visual judgement of the
artwork has been made.**

**The art is fine; do not regenerate it.** The surviving header declares exactly the size the source
note recorded, which confirms the 214,378-byte export was real. Only the transport failed. This is
the second ~15 KB truncation here (SHADOW Card 04 v1 was 14,999 bytes), so change the route rather
than retrying it:

1. On the machine holding the real file, confirm `sha256sum` prints `cb766584…`.
2. Commit with the **git CLI from local disk** — not a web-UI upload, not an API create-file call,
   not a base64 payload.
3. **Before pushing:** `git cat-file -s HEAD:art-source/acolyte-of-the-white-rune.webp` must print
   `214378`. It reads the size back out of the object git actually stored; run before either
   truncation it would have caught both.
4. Push to a fresh branch `assets/acolyte-of-the-white-rune-candidate-v2`. Leave the broken branch in
   place; do not force-push over it.

Full analysis: `docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-rejected.md`.

Everything below is unchanged and applies to the v2 candidate, with the candidate branch and commit
substituted. When reviewing v2, walk §15 strictly against the real file — the generator has recorded
that its refinement prompt was not a byte-for-byte copy of §13/§14, so compliance must not be
inferred from the prompt text.

## Goal

Review the generated PURIFICATION Card 01 candidate on the real game surfaces and stop for owner visual approval.

- **Slug:** `acolyte-of-the-white-rune`
- **Name:** `Послушник Белой Руны`
- **Type / rarity / cost:** CHARACTER / COMMON / 1
- **Stats:** 1/3

## Canonical sources

Approved brief:

`docs/art-review/acolyte-of-the-white-rune-master-art-brief.md`

Candidate branch:

`assets/acolyte-of-the-white-rune-candidate`

Candidate commit:

`1652efaa1bc47771a08246bb9b498d9b737b7092`

Candidate file:

`art-source/acolyte-of-the-white-rune.webp`

Source note:

`docs/art-sources/2026-08-27-purification-card-01-master-prompt.md`

Expected integrity values:

- dimensions: `1024 × 1536`
- byte size: `214378`
- RIFF-declared total: `214378`
- container: plain `VP8 `
- SHA-256: `cb76658416628f91b721c826a451342319bcfe39ff3b5f770a5f8ca73ba499fe`

## Required work

1. Resolve fresh `main` and the exact candidate commit above from GitHub.
2. Independently read the candidate bytes from git and verify:
   - SHA-256
   - actual byte size
   - RIFF-declared total
   - WebP fourcc
   - decoded dimensions
3. If any value differs, STOP and report the mismatch. Do not repair or re-encode the file.
4. The current `/admin/art-review` `REVIEW_TARGETS` does not yet contain `acolyte-of-the-white-rune`. Add **only this one review target** if required. This is an authorised review-surface support change, not artwork promotion.
5. Stage the committed candidate locally at:

   `apps/web/public/art-review-candidates/acolyte-of-the-white-rune.webp`

   This candidate path is gitignored; do not commit the staged copy as production art.

6. Run the live review against the real card data and capture/inspect:
   - raw master
   - `CardView` 3:4
   - `CardDetailDrawer` 4:5
   - `HandCardPreview` 7:9
   - `CreatureSlot` 3:4
   - `/admin/art-review` desktop
   - `/admin/art-review` at 390px mobile width
   - 92px thumbnail legibility
7. Walk every item in §15 of the approved brief against the actual candidate.
8. Compare it side-by-side with `high-warden-of-the-white-rune` at thumbnail size to confirm the COMMON vs LEGENDARY hierarchy is immediate.
9. Record any genuine caveat rather than silently accepting it.
10. **STOP FOR OWNER VISUAL APPROVAL.** Do not promote the candidate.

## Visual questions that matter most

The pass/fail review should explicitly answer:

- Does it read instantly as PURIFICATION at 92px?
- Does it clearly read as COMMON, not a miniature High Warden?
- Is the light armor unmistakably armor, while still plain and junior?
- Are the face and rune tablet both readable, with the face remaining the primary focal point?
- Are the hands anatomically clean?
- Is the tablet a coherent solid object?
- Does the candidate remain clean in 3:4, 7:9 and especially 4:5 with zero essential crop loss?
- Is there any forbidden SHADOW drift, excessive gold, ceremonial armor drift, robe/cleric drift, or flagship cathedral/crowd drift?

## Allowed repository change

If `/admin/art-review` needs the target registration, make the smallest possible code change for this card only. Prefer a dedicated review branch / PR if the repository workflow naturally requires it.

Do not use a production `reviewArtworkUrl`; the candidate must remain a candidate and resolve through the gitignored local review path.

## Validation

If review-surface code changes:

- `git diff --check`
- Prettier on changed file(s)
- lint
- typecheck
- existing test baseline
- production build

Visual QA must use the actual candidate and real app components, not mock screenshots.

## Hard scope exclusions

Do not modify:

- `apps/game-server/prisma/seed.ts`
- Prisma schema or migrations
- gameplay / balance / card text / effects / rarity / cost / stats / faction
- any production `artworkUrl` or `rightsStatus`
- `apps/web/public/art/cards/`
- Battlefield layout or gameplay logic
- production sync script/workflow
- Railway / Vercel configuration
- production database
- existing Art Pack 01 / 02 approved assets

Do not merge the candidate branch.
Do not promote the candidate.
Do not run production sync.

## Delivery

Follow `CLAUDE.md` Agent Handoff Protocol.

The final handoff must include the verified integrity values, exact review-surface change if any, validation results, visual QA findings, screenshots/artifact locations if produced, §15 checklist result, known caveats, and a clear final status:

**READY FOR OWNER VISUAL APPROVAL** or **REJECTED / BLOCKED**.

Update `docs/AGENT_STATE.md` last and verify it from GitHub before declaring completion.
