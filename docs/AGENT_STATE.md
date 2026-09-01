# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 04 — BOND / «Дом Весеннего Света»
- **Status:** **READY FOR OWNER ART BRIEF REVIEW — ART PACK 04 CARD 01**
- **Detail:** Card 01 `child-of-the-spring-light` has a canonical master-art brief awaiting owner review. **No image has been generated, no artwork bytes exist**, nothing is integrated and nothing is synced. Cards 02–04 are planned and reserved but not briefed.
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md` — executed and closed
- **Current task commit:** `241070f2c7f086f41934e56ac3c6aeb41006337e`
- **Latest task-result commit:** `4de7cceba141ab1f19074f569e5b62cd3e18807c`
- **Latest report:** `docs/agent-reports/2026-09-02-art-pack-04-card-01-master-art-brief.md`
- **Canonical brief:** `docs/art-review/child-of-the-spring-light-master-art-brief.md`
- **Pack document:** `docs/art-pack-04.md`
- **Branch / PR:** `main` — docs-only task, no PR
- **Exact scope of changes:** three new docs plus this file. No code, seed, schema, migration, artwork, workflow or production file was touched.
- **Production operation authorized:** **NO**
- **Production workflow dispatched:** **NO**
- **Railway / production DB / Vercel accessed:** **NO**
- **Open blockers:** owner review of the Card 01 brief; generation cannot start until it is approved
- **Recommended next action:** owner reviews the brief — especially the locked thesis (§4), the safeguarding constraints (§6) and the measured QA targets (§9). On approval, generate the master to the §19 output contract and bring the exact bytes in over the established Actions-runner transport with full integrity gates, then run the nine-surface candidate QA against the §16 checklist. Card 02 stays unbriefed until Card 01 is approved.

## Art Pack 04 Card 01 — brief record

Target: `child-of-the-spring-light` / «Дитя Весеннего Света» — BOND, CHARACTER, COMMON, cost 1, 1/3,
«При выходе: восстановите 1 здоровье Проводнику.», `ON_PLAY` → `HEAL` / `FRIENDLY_CONDUCTOR` / 1.
Verified from `apps/game-server/prisma/seed.ts` and unchanged by this task.

**Locked concept:** a child at the garden threshold holds out a single budding spring branch, cupped
in both hands, toward the viewer; the light is only as big as their hands. The gesture leaves the
frame because the heal targets the **Conductor** — the player — not an ally on the board
(`packages/game-engine/src/effects/targets.ts:85`), a composition no other card in the set can use.
Five alternatives were evaluated and rejected on the record.

Facts established this task and reusable by Cards 02–04:

- Card 01 is a CHARACTER, so `hasBoardSlot` is true (`apps/web/src/app/admin/art-review/page.tsx:162`) and it takes the **nine-surface** review. Card 02 will also be nine; Cards 03 (**TRACK**, not EVENT) and 04 (RUNE) will be eight.
- Crop geometry on a 1024 × 1536 master: 3:4 → rows 85–1450; 7:9 → rows 110–1426; **4:5 → rows 128–1408, binding**. Strict safe zone rows 260–1280.
- `RARITY_FRAME_CLASS.COMMON` has no glow layer (`packages/ui/src/rarity.ts`), so a COMMON gets no help from the frame.
- **Warmth is the binding BOND-vs-PURIFICATION test.** Measured from the shipped files: the BOND flagship is R−B **+62.0** at 42.1 % saturation; the entire shipped PURIFICATION set sits between **+1.2 and +11.8** at 2.9–8.1 %. Card 01 targets R−B ≥ +30, saturation ≥ 22 %, mean luminance 110–160 (outside PURIFICATION's 164–182 band), and edge density 24.0–31.0 against the flagship's 43.46.
- A visual-reservation table for all four non-flagship cards plus the flagship is recorded in the brief §14 and `docs/art-pack-04.md`, so Cards 02–04 do not renegotiate motifs.

**Safeguarding:** the subject is a child. The brief carries absolute constraints — fully clothed in
loose opaque clothing, no sheer/wet/clinging fabric, no suggestive pose, framing, expression, camera
angle or styling, never injured or distressed. Any violation is regenerated from scratch, never
patched or cropped.

## Safety boundary — still in force

Do NOT:

- generate, transport or integrate any Card 01 artwork bytes before owner approval of the brief;
- begin Card 02, 03 or 04;
- edit `seed.ts`, schema, migrations, gameplay, balance or UI;
- edit any existing approved artwork;
- dispatch the production artwork sync, or touch Railway, the production database or Vercel;
- reuse `SYNC-13-CARD-ART-PRODUCTION` or `SYNC-14-CARD-ART-PRODUCTION` — both are consumed;
- reopen Art Pack 03.

A future BOND production sync needs a new confirmation phrase, a pin repointed at a new
already-merged integration commit, and a fresh explicit owner decision.

## Follow-ups (small, not blocking)

1. The authorization-state comments in `apps/game-server/scripts/sync-production-card-art.ts` and
   `.github/workflows/production-card-art-sync.yml` still call `SYNC-14-CARD-ART-PRODUCTION`
   "RESERVED, NOT AUTHORIZED, NOT CONSUMED". That is stale — it is CONSUMED. The Card 01 brief task
   was explicitly forbidden from touching it. Fold the correction into the next preparation change,
   exactly as the `SYNC-13…` CONSUMED note was folded in.
2. `transport/card04-github-actions` can be deleted; it carries a `contents: write` workflow and must
   never be merged.

## Art Pack 03 — CLOSED, COMPLETE END TO END

All four cards live in production. Do not reopen without a new owner decision.

| Card                           | Status                 |
| ------------------------------ | ---------------------- |
| 01 `acolyte-of-the-white-rune` | **LIVE IN PRODUCTION** |
| 02 `seal-of-the-curse`         | **LIVE IN PRODUCTION** |
| 03 `warden-of-the-barrier`     | **LIVE IN PRODUCTION** |
| 04 `rune-of-curse-breaking`    | **LIVE IN PRODUCTION** |

Closing production record — Card 04, run `33560559977` (run 10), job `100031744885`, conclusion
success, dispatched on `main` @ `a81823443f8a824ecfbe03629c167a3f81b37d76`, immutable source pin
`b792be37b32f73906d104642689afaa88a47b1c2`, rows changed **1**, `NON_TARGET_FIELD_CHANGES=0`, final
source of truth **14/14**. Full evidence:
`docs/agent-reports/2026-09-01-art-pack-03-card-04-production-sync.md`.

Card 03 record — run `33436786024` (run 9), job `99635055417`, success, pin
`8b8322aad6fc52ca7e9ac796027605c5e1e9c78b`, rows changed 1, final source of truth 13/13.

Consumed production confirmations, invalid forever:

- `SYNC-13-CARD-ART-PRODUCTION` — CONSUMED (Card 03, run `33436786024`)
- `SYNC-14-CARD-ART-PRODUCTION` — CONSUMED (Card 04, run `33560559977`)

## Art binary transport standing rule

The user is not a manual file courier. Use the established GitHub Actions transport path with hard
binary integrity gates (size, SHA-256, git blob SHA, RIFF/FourCC, dimensions, full decode) for
generated masters. Never use GitHub Contents-API binary/base64 transport for generated masters; this
project has already observed truncation through that route.
