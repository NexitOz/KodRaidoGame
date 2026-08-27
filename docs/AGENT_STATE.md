# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **UNBLOCKED — exact master now available through WeTransfer; integrity + candidate-v2 + visual QA next**
- **Current target:** `seal-of-the-curse` / «Печать Проклятия»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `82a9352c0a4f98c99b75b8f184ab45c2e8253286`
- **Latest completed handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-02-github-release-transport-blocked.md`
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

Master-art brief:

`docs/art-review/seal-of-the-curse-master-art-brief.md`

Locked concept:

- Curse = binding/restraint, not corruption
- rigid white/silver rune clamp locks hostile weapon hand to guard/hilt
- no visible caster
- cinematic realistic / semi-realistic premium CCG
- no SHADOW/VEIL corruption palette or spell-blast language

The owner accepted the generated image visually on 2026-08-27. Do not regenerate or alter it during transport recovery.

## Canonical accepted master integrity

Exact required values:

- dimensions: `1024 × 1536`
- byte size: `326508`
- RIFF total: `326508`
- FourCC: plain `VP8 `
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- full decode: PASS

ChatGPT re-verified the local master after transport work:

- local size: `326508`
- local SHA-256: exact canonical hash above
- RIFF total: `326508`
- FourCC: `VP8 `
- dimensions: `1024 × 1536`
- full decode: PASS

Google Drive raw upload also stored the file as `image/webp` with provider-reported size exactly `326508` bytes, confirming byte-preserving upload behavior.

## Transport history

### Broken evidence — DO NOT USE

Old branch:

`assets/seal-of-the-curse-candidate`

Old commit:

`6f0e00fca98b7452c4c1f987165cf3157753dccb`

That committed file is only 27 bytes and remains rejected evidence.

### firestorage route

The exact master was uploaded successfully to firestorage, but Claude Code cannot reach `firestorage.ai:443` because of session egress policy (`CONNECT 403`). Do not retry that route.

### GitHub Release route

Not usable from current agent tooling because neither side had release-asset write capability plus the master in the same environment.

### Dropbox route

Rejected after a control test showed long text payload truncation. Do not use Dropbox text-chunk transport for master art.

### Google Drive route

Raw binary upload succeeded and provider metadata reports exact `326508` bytes, but the current personal-Gmail connector cannot create an anonymous `anyone with link` permission for Claude Code.

### CURRENT RELAY — WeTransfer

WeTransfer successfully created a public transfer from the already verified firestorage source:

`https://we.tl/t-vzhG3rXsXM3TQ7Jr`

Transfer ID:

`8dd7ff4c476d0d8199b2c731e74f273220260827203816`

Expires:

`2026-08-30T20:38:27Z`

This is the only transport Claude should use now.

## Current task

Execute `docs/CLAUDE_CURRENT_TASK.md` @ `82a9352c0a4f98c99b75b8f184ab45c2e8253286`.

Required sequence:

1. Download exact WebP from WeTransfer.
2. Verify all canonical integrity values locally.
3. Only on PASS create fresh `assets/seal-of-the-curse-candidate-v2` from fresh main.
4. Commit exact binary with normal git CLI.
5. Verify committed bytes before push and remote-fetched bytes after push.
6. Run full real visual QA on raw 2:3, CardView 3:4, CardDetailDrawer 4:5, HandCardPreview 7:9, admin desktop, 390px, 92px, and grayscale.
7. EVENT does not use `CreatureSlot`.
8. Walk the full Card 02 master-art brief including y≈260–1280 safe zone and Common < Rare < Legendary comparison.
9. Write durable handoff.
10. Update this file last and fetch it back to verify.

Final status must be exactly:

- **READY FOR OWNER VISUAL APPROVAL**, or
- **REJECTED / BLOCKED**

No promotion, seed/Prisma/gameplay change, production artwork path, sync/workflow change, Railway/Vercel/production DB access, workflow dispatch, candidate merge, or Card 03 work is authorized.

## Art Pack 03 remaining cards

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — exact master available via WeTransfer; integrity/candidate-v2/QA next
- Card 03 `warden-of-the-barrier` — not started
- Card 04 `rune-of-curse-breaking` — not started
