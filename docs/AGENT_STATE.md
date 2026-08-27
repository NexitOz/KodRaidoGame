# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 accepted candidate **READY FOR REPOSITORY VISUAL QA**
- **Current target:** `seal-of-the-curse` / «Печать Проклятия»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `a2fa13bd1d23802bb6851ce80197f642f1d3eb58`
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

## Card 02 — owner-accepted candidate

The owner explicitly accepted generated Candidate 01 on 2026-08-27.

Candidate branch:

`assets/seal-of-the-curse-candidate`

Candidate commit:

`6f0e00fca98b7452c4c1f987165cf3157753dccb`

Candidate asset:

`art-source/seal-of-the-curse.webp`

Provenance:

`docs/art-sources/2026-08-27-purification-card-02-master-candidate.md`

Expected integrity values:

- dimensions: `1024 × 1536`
- byte size: `326508`
- RIFF total: `326508`
- FourCC: plain `VP8 `
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- full decode: PASS

These values are mandatory. Any mismatch is **REJECTED / BLOCKED**; do not repair or re-encode.

## Current task

Execute `docs/CLAUDE_CURRENT_TASK.md`.

Scope is verification + real surface QA only:

- independently verify the committed candidate bytes first;
- stage the verified file only in the gitignored review-candidate path;
- add only the smallest `/admin/art-review` target registration if required;
- review raw master, `CardView` 3:4, `CardDetailDrawer` 4:5, `HandCardPreview` 7:9, desktop, 390px, 92px and 92px grayscale;
- EVENT does **not** use `CreatureSlot` as a review surface;
- compare Common Acolyte < Rare Event < Legendary High Warden at thumbnail scale;
- walk every reject/acceptance item in the Card 02 brief;
- stop for owner approval.

No promotion, seed/Prisma/gameplay changes, production artwork path, sync/workflow changes, Railway/Vercel/production DB access, workflow dispatch, candidate merge, or Card 03 work are authorized.

Final status must be:

- **READY FOR OWNER VISUAL APPROVAL**, or
- **REJECTED / BLOCKED**.

## Art Pack 03 remaining cards

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — ACCEPTED CANDIDATE, READY FOR REPOSITORY VISUAL QA
- Card 03 `warden-of-the-barrier` — not started
- Card 04 `rune-of-curse-breaking` — not started
