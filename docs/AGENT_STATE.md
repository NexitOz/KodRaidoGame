# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 candidate 01 **REJECTED / BLOCKED — truncated to 27 bytes; re-transport required**
- **Current target:** `seal-of-the-curse` / «Печать Проклятия»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `a2fa13bd1d23802bb6851ce80197f642f1d3eb58`
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

## Card 02 — candidate 01 REJECTED, DO NOT USE

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

### Integrity gate result — FAILED

`git cat-file -s 6f0e00f:art-source/seal-of-the-curse.webp` prints **27**, not `326508`.

| Check                   | Expected    | Actual                            | Result   |
| ----------------------- | ----------- | --------------------------------- | -------- |
| Byte size               | 326,508     | **27**                            | **FAIL** |
| SHA-256                 | `699db6b7…` | `9643136c…`                       | **FAIL** |
| RIFF-declared total     | 326,508     | **313,964**                       | **FAIL** |
| declared == actual      | equal       | 313,964 vs 27                     | **FAIL** |
| Dimensions              | 1024 × 1536 | undeterminable                    | **FAIL** |
| Full decode             | succeeds    | `could not create decoder object` | **FAIL** |
| RIFF/WEBP magic, FourCC | —           | `RIFF` / `WEBP` / `VP8 `          | PASS     |

The whole file is the RIFF header, the `VP8 ` chunk header and the first four bytes of the VP8
keyframe — it ends before the width/height fields. **0.0086%** of the declared length arrived. The
truncation is baked into the commit: GitHub reports the blob as 27 bytes and the diffstat records
`Bin 0 -> 27 bytes`.

**Two separate problems.** Beyond the truncation, the surviving RIFF header declares **313,964**
bytes while the provenance note claims **326,508** — a 12,544-byte discrepancy. They cannot both
describe the same file. Unlike Card 01, where the header corroborated the note, here the expected
size and SHA do **not** describe the file whose header arrived. That must be reconciled _before_
re-transport, or the gate will be checked against values that never applied.

**No visual judgement of the artwork has been made.** QA was not started, nothing was staged, and
`/admin/art-review` was not touched.

### Third transport failure of this class

SHADOW Card 04 v1 was 14,999 bytes; PURIFICATION Card 01 v1 was 15,042; this is 27. The connected
GitHub tooling does not truncate at a predictable boundary, so apparent size is never a substitute
for the byte check. The provenance note itself warned this path was unsafe after Card 01, and the
binary went through it anyway.

### Required fix

1. Do not regenerate — nothing indicates the accepted image is bad.
2. **Reconcile the size discrepancy first:** `wc -c` and `sha256sum` the real local master, and
   correct the provenance note if it disagrees with 326,508 / `699db6b7…`.
3. Commit with the **git CLI from local disk**, never the connected tooling.
4. **Before pushing:** `git cat-file -s HEAD:art-source/seal-of-the-curse.webp` must match the real
   byte size.
5. Push to `assets/seal-of-the-curse-candidate-v2`; leave the broken branch as evidence.

## Current task — BLOCKED

`docs/CLAUDE_CURRENT_TASK.md` carries the verify-and-review task. Its integrity gate **failed**, so
the QA steps below it are not runnable against candidate 01 and stand unchanged for a v2 candidate.

Scope remains verification + real surface QA only: verify the committed bytes first; stage the
verified file only in the gitignored review-candidate path; add only the smallest `/admin/art-review`
target registration if required; review raw master, `CardView` 3:4, `CardDetailDrawer` 4:5,
`HandCardPreview` 7:9, desktop, 390 px, 92 px and 92 px grayscale; EVENT does **not** use
`CreatureSlot`; compare Common Acolyte < Rare Event < Legendary High Warden at thumbnail scale; walk
every reject/acceptance item in the Card 02 brief; stop for owner approval.

No promotion, seed/Prisma/gameplay change, production artwork path, sync/workflow change,
Railway/Vercel/production DB access, workflow dispatch, candidate merge, or Card 03 work is
authorized.

## Art Pack 03 remaining cards

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — brief complete; **candidate 01 REJECTED (27 bytes)**, awaiting re-transport
- Card 03 `warden-of-the-barrier` — not started
- Card 04 `rune-of-curse-breaking` — not started
