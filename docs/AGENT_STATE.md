# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 accepted master **RE-TRANSPORT AVAILABLE VIA FIRESTORAGE — INTEGRITY + CANDIDATE-V2 + VISUAL QA NEXT**
- **Current target:** `seal-of-the-curse` / «Печать Проклятия»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `2a08ffc4fc744b98ecbce06a3dff4ea0c1cb955e`
- **Latest handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-02-candidate-rejected.md`
- **Branch:** `main`

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
- Resonance: visual only

## Card 02 — brief and owner decisions

Master-art brief:

`docs/art-review/seal-of-the-curse-master-art-brief.md`

Locked concept:

- Curse reads as **binding/restraint**, not corruption;
- hero object is a rigid white/silver rune clamp locking the hostile weapon hand to the guard/hilt;
- no visible caster required;
- cinematic realistic / semi-realistic premium CCG house style;
- no SHADOW/VEIL corruption palette or spell-blast language.

The owner explicitly accepted generated Candidate 01 visually on 2026-08-27. The accepted image itself must not be regenerated or altered during transport recovery.

## Broken transport evidence — DO NOT USE

Old branch:

`assets/seal-of-the-curse-candidate`

Old candidate commit:

`6f0e00fca98b7452c4c1f987165cf3157753dccb`

That committed WebP is only 27 bytes and is permanently rejected as a transport artifact. Leave it as evidence; do not repair or reuse it.

No visual QA was performed against the broken file.

## Canonical accepted master integrity

Expected exact values:

- dimensions: `1024 × 1536`
- byte size: `326508`
- RIFF total: `326508`
- FourCC: plain `VP8 `
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- full decode: PASS

Any mismatch is **REJECTED / BLOCKED**. Do not repair, re-encode, resize, regenerate, or substitute.

## New machine-to-machine transport

The exact local accepted master was uploaded by ChatGPT to firestorage.ai. firestorage independently reported:

- file: `seal-of-the-curse.webp`
- size: `326508` bytes
- MIME: `image/webp`
- retention through 2026-09-10

Share URL for agent retrieval:

`https://firestorage.ai/ja/f/UbtC6RJp2_Ok`

This replaces manual user file handling. The user is not required to download or upload the artwork.

Claude must download the file locally, independently verify all canonical integrity values, then create a fresh branch:

`assets/seal-of-the-curse-candidate-v2`

using normal git CLI from local disk. Before push and again after fetching the remote branch, verify exact byte size and SHA from committed bytes.

## Current task

Execute `docs/CLAUDE_CURRENT_TASK.md` @ `2a08ffc4fc744b98ecbce06a3dff4ea0c1cb955e`.

Only after integrity and remote re-verification pass, perform real surface QA on:

- raw 2:3 master
- `CardView` 3:4
- `CardDetailDrawer` 4:5
- `HandCardPreview` 7:9
- `/admin/art-review` desktop
- `/admin/art-review` 390px
- 92px thumbnail
- 92px grayscale/value-only

EVENT does not use `CreatureSlot`.

Compare Common Acolyte < Rare Event < Legendary High Warden at 92px and walk every reject/acceptance item in the Card 02 master-art brief.

Final status must be exactly:

- **READY FOR OWNER VISUAL APPROVAL**, or
- **REJECTED / BLOCKED**.

No promotion, seed/Prisma/gameplay change, production artwork path, sync/workflow change, Railway/Vercel/production DB access, workflow dispatch, candidate merge, or Card 03 work is authorized.

## Art transport policy — permanent operational rule

For generated art masters, the user must not be used as a manual file courier.

Preferred pipeline:

1. ChatGPT creates/normalizes the master locally.
2. ChatGPT uploads the exact file to a machine-readable storage relay such as firestorage.ai.
3. Receiving agent downloads to local disk.
4. Receiving agent verifies byte size + SHA-256 + format/decode before git.
5. Receiving agent commits with normal git CLI.
6. Receiving agent re-fetches and re-verifies committed bytes before QA/promotion.

Do not use connected GitHub text/binary content tooling to transport generated master artwork bytes when a file-native relay is available.

## Art Pack 03 remaining cards

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — accepted master available via firestorage; integrity/candidate-v2/QA next
- Card 03 `warden-of-the-barrier` — not started
- Card 04 `rune-of-curse-breaking` — not started
