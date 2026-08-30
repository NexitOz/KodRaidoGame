# CURRENT TASK — Art Pack 03 Card 03: approved master candidate intake and QA

## Status

Card 02 is COMPLETE END TO END and live in production.

Card 03 `warden-of-the-barrier` / «Хранительница Барьера» now has an OWNER-APPROVED master image produced by ChatGPT. The previous generation blocker is superseded.

No production operation is authorized.

## Canonical Card 03 facts

- slug: `warden-of-the-barrier`
- name: «Хранительница Барьера»
- faction: PURIFICATION
- type: CHARACTER
- rarity: RARE
- cost: 3
- attack / health: 2 / 5
- ability: `При выходе: получает Щит. При Резонансе 5+: снимите Проклятие и Заглушение со всех союзников.`

## Owner-approved visual source

The approved source is the corrected vertical Card 03 master generated in ChatGPT on 2026-08-30.

The transport WebP prepared from that approved visual source has these expected properties:

- dimensions: `1024 × 1536`
- format: WebP
- FourCC: plain `VP8 `
- byte size: `284002`
- RIFF total: `284002`
- SHA-256: `1a175635a24e84c86f37f11e954299ca3cb4bb675c9f9b178c134ee0ab0ea27e`
- full decode: PASS

These values are verification gates for intake. Do not invent substitutes if the source bytes cannot be retrieved.

## Goal

Land the exact approved master as a real candidate and run the full Card 03 candidate QA flow. Stop before production integration.

Expected candidate branch:

`assets/warden-of-the-barrier-candidate`

Expected candidate path:

`art-source/warden-of-the-barrier.webp`

Local review staging path:

`apps/web/public/art-review-candidates/warden-of-the-barrier.webp`

## Required work

1. Read `docs/AGENT_STATE.md`, this task, the approved brief, and the generation package.
2. Retrieve the owner-approved WebP bytes supplied with the task or through the temporary transport URL.
3. Verify the bytes BEFORE git:
   - `1024 × 1536`
   - byte size `284002`
   - RIFF total `284002`
   - FourCC plain `VP8 `
   - SHA-256 exactly `1a175635a24e84c86f37f11e954299ca3cb4bb675c9f9b178c134ee0ab0ea27e`
   - full decode PASS
4. Create `assets/warden-of-the-barrier-candidate` only after the real asset is present.
5. Commit only the real candidate and any candidate-specific source/report metadata required by established repository convention.
6. Re-verify the committed git object and fetched remote branch, including exact byte size, SHA-256, and Git blob SHA.
7. Stage only to the gitignored review path. Do not wire production `artworkUrl`.
8. Run all nine required surfaces:
   - raw 2:3
   - CardView 3:4
   - CreatureSlot 3:4
   - CardDetailDrawer 4:5
   - HandCardPreview 7:9
   - `/admin/art-review` desktop
   - `/admin/art-review` at 390 px
   - 92 px thumbnail
   - 92 px grayscale
9. Walk the approved Card 03 brief against the real candidate. Report real deviations. Never silently alter the approved artwork.
10. Confirm candidate isolation from production.
11. Leave the durable handoff under `docs/agent-reports/`.
12. Update `docs/AGENT_STATE.md` LAST and fetch it back to verify.

## Hard exclusions

Do NOT:

- regenerate, redesign, recompose, crop, extend, replace, or creatively alter the approved artwork
- integrate into `apps/web/public/art/cards/`
- change `seed.ts`, gameplay, balance, schema or migrations
- change production `artworkUrl` or `rightsStatus`
- extend production sync 12 → 13
- dispatch production workflow
- access or mutate Railway/Vercel/production DB
- begin Card 04

If the exact approved bytes are not retrievable or fail any integrity gate, stop as `REJECTED / BLOCKED` without creating an empty candidate branch or placeholder.

## Final status

Exactly one of:

- **READY FOR OWNER VISUAL APPROVAL**
- **REJECTED / BLOCKED**
