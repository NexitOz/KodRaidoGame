# CURRENT TASK — Art Pack 03 Card 02: verified candidate-v2 → real visual QA → owner gate

## Status entering this task

Transport is complete. Do **not** attempt firestorage, WeTransfer, Dropbox, Google Drive, Release assets, Contents-API binary upload, or owner/manual upload.

The exact owner-accepted master is already in GitHub on:

- branch: `assets/seal-of-the-curse-candidate-v2`
- commit: `67405697628a3dec3fa8e9dab2cdb27c273b6af1`
- path: `art-source/seal-of-the-curse.webp`
- Git blob SHA: `95940017577f7152a28bf76122912c37e548c7e0`
- size: `326508`

Transport proof:

`docs/agent-reports/2026-08-27-art-pack-03-card-02-github-actions-transport-success.md`

GitHub Actions transport run `33117588154`, job `98676113281`, concluded `success`. The runner downloaded the raw provider object, verified all canonical values, full-decoded it with Pillow, committed through normal git, pushed, fetched the remote branch back, and re-verified remote bytes. GitHub API independently reports the same blob SHA and size.

## Goal

Independently verify the GitHub candidate from your own session, perform the complete real visual QA for Card 02, record durable findings, then stop for owner visual approval. No promotion.

Card:

- slug: `seal-of-the-curse`
- name: «Печать Проклятия»
- PURIFICATION / EVENT / RARE / cost 2
- gameplay meaning: Curse prevents the chosen enemy from attacking

Master-art brief:

`docs/art-review/seal-of-the-curse-master-art-brief.md`

## Step 1 — fresh GitHub candidate integrity gate

Start from fresh `main`, then fetch the candidate branch from GitHub.

The remote branch head must be exactly:

`67405697628a3dec3fa8e9dab2cdb27c273b6af1`

Verify directly from fetched Git objects:

- `git cat-file -s origin/assets/seal-of-the-curse-candidate-v2:art-source/seal-of-the-curse.webp` == `326508`
- SHA-256 of the materialized fetched blob == `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- Git blob SHA == `95940017577f7152a28bf76122912c37e548c7e0`
- dimensions == `1024 × 1536`
- RIFF-declared total == `326508`
- FourCC == plain `VP8 `
- full decode == PASS

Also confirm the candidate commit is one commit above parent `d6428d2eb6cd07cfb8a26e49de6cfef64a8f441e` and its candidate delta is only:

`art-source/seal-of-the-curse.webp`

If ANY integrity or scope value differs: **STOP — REJECTED / BLOCKED**. Do not repair, re-encode, regenerate, resize, substitute, force-push, or reuse the old 27-byte branch.

## Step 2 — local review staging only

Materialize the exact verified fetched blob to the existing gitignored review path:

`apps/web/public/art-review-candidates/seal-of-the-curse.webp`

Re-check SHA-256 after staging. It must remain canonical.

Do not write the candidate into `apps/web/public/art/cards/` and do not change production card data.

If `seal-of-the-curse` needs `/admin/art-review` registration, make only the smallest review-only support change on a narrow QA branch/PR. Candidate bytes themselves remain gitignored review material and must never be altered.

## Step 3 — required real visual QA

This card is an EVENT. `CreatureSlot` is **not** a review surface.

Review the exact candidate using the real app/components on all required surfaces:

1. raw 2:3 master
2. `CardView` 3:4
3. `CardDetailDrawer` 4:5
4. `HandCardPreview` 7:9
5. `/admin/art-review` desktop
6. `/admin/art-review` at 390px
7. 92px thumbnail
8. 92px grayscale/value-only

Use real rendering, not invented/mock component screenshots.

Walk every reject/acceptance item in:

`docs/art-review/seal-of-the-curse-master-art-brief.md`

Mandatory visual gates include:

- reads instantly as an attack physically sealed, not damage, corruption, or spellcasting
- white/silver rune clamp is the primary focal point; hostile dark weapon hand is secondary
- enemy arm reads dark by material, not SHADOW-style lighting
- enemy remains faction-neutral
- hand / fingers / weapon / guard geometry is coherent
- clamp reads as a solid physical locking device around hand + guard/hilt, not floating magic
- no crimson/red/violet/magenta/orange
- no rot, veins, tendrils, void haze, embers, ash, corruption language
- no caster, beam, projectile, explosion, or generic magical shield
- essential story survives 3:4, 7:9, and especially 4:5
- nothing essential lies above y≈260 or below y≈1280
- 92px grayscale preserves strong tonal separation between the white/silver clamp and dark hostile hand

At 92px compare side-by-side:

- Common `acolyte-of-the-white-rune`
- Rare Event `seal-of-the-curse`
- Legendary `high-warden-of-the-white-rune`

The visual hierarchy must read **Common < Rare < Legendary** without relying only on rarity frame treatment.

Record any caveat, even if overall QA passes.

## Step 4 — validation if review code changes

If review-only code/config changes are necessary, run the repository's normal validation for the changed scope, including:

- `git diff --check`
- Prettier on changed files
- lint
- typecheck
- existing tests
- production build
- real visual QA after the change

Do not commit large QA screenshots/artifacts.

## Hard exclusions

Do NOT:

- modify `apps/game-server/prisma/seed.ts`
- modify Prisma schema/migrations
- modify gameplay, balance, or canonical card data
- write to `apps/web/public/art/cards/`
- modify production `artworkUrl` or `rightsStatus`
- merge/promote the candidate
- touch Battlefield gameplay/layout
- modify or dispatch production sync workflows
- access Railway, Vercel, or production DB
- begin Card 03
- modify the accepted WebP bytes

## Delivery

1. Create a durable report under `docs/agent-reports/` with:
   - exact candidate branch + commit
   - all independent integrity results
   - local staging SHA recheck
   - each required QA surface
   - complete brief checklist outcome
   - 92px rarity hierarchy outcome
   - any visual caveat
2. If review-only code changed, keep it in a narrow QA branch/PR and report exact scope.
3. Update `docs/AGENT_STATE.md` **last** and fetch it back from GitHub to verify.
4. Final status must be exactly one of:
   - **READY FOR OWNER VISUAL APPROVAL**
   - **REJECTED / BLOCKED**
5. Stop. No integration, promotion, production sync, or Card 03 work.
