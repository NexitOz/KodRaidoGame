# Agent Handoff

Task: Art Pack 03 Card 02 — master-art brief (`docs/CLAUDE_CURRENT_TASK.md`)
Date: 2026-08-27
Branch: `main`
Base SHA: `1bea76e`
Head SHA: `9c08a54`
PR: none — documentation-only task
Status: **COMPLETE — brief written, awaiting owner review.** No image generated, integrated,
promoted or synced.

## Scope

Create `docs/art-review/seal-of-the-curse-master-art-brief.md` for PURIFICATION Card 02 —
`seal-of-the-curse` / «Печать Проклятия», EVENT / RARE / cost 2 — covering all seventeen required
sections, then stop for owner review.

## Changed files

| File                                                                    | Change                            |
| ----------------------------------------------------------------------- | --------------------------------- |
| `docs/art-review/seal-of-the-curse-master-art-brief.md`                 | **new**, 479 lines                |
| `docs/agent-reports/2026-08-27-art-pack-03-card-02-master-art-brief.md` | **new**, this report              |
| `docs/AGENT_STATE.md`                                                   | updated last, per protocol rule C |

Nothing else in the repository was touched.

## Source research

Gameplay and faction identity were read from the repository, not re-derived from memory, as the task
required.

1. **`apps/game-server/prisma/seed.ts`** — the real card facts: EVENT / RARE / cost 2,
   `tags: ['Purification']`, `ON_PLAY` → `ADD_STATUS` / `ENEMY_CHOSEN` / `CURSE`.
2. **The engine, for what CURSE actually means.** `packages/game-engine/src/match/apply-action.ts`
   rejects an attack from a cursed unit with _"This unit is cursed and cannot attack."_ and
   `effects/interpreter.ts` lists CURSE as one of two `NEGATIVE_STATUSES` a cleanse removes. So the
   card **stops an attack** — it does not damage, weaken or corrupt. That distinction drives the
   whole brief.
3. **`docs/art-bible-01.md`** — the locked PURIFICATION language and forbidden drift.
4. **`docs/art-pack-03.md`** — Card 01's shipped record and its two accepted caveats.
5. **The approved Card 01 brief** — for house-style and crop continuity.
6. **`docs/content-pack-01.md`** — the canonical roster line confirming the card's role.
7. **The owner's Card 02 transition report** — the locked concept direction and house-style decision.

## The central design problem, and how the brief resolves it

PURIFICATION applying a "curse" is a genuine contradiction to work through, not a detail. The
standard fantasy coding for a curse is crimson or violet — and those are precisely the two colours
this faction forbids, because they read as SHADOW and VEIL. A literal treatment would break the
faction on its most load-bearing rule.

**The brief resolves it by reading the Curse as a binding, not a taint.** This is a _seal_: the Order
locks a weapon so it cannot be raised. Jailer's work, not sorcery. Nothing is corrupted, poisoned or
blackened. That is the only reading that keeps the card inside PURIFICATION's locked language —
white, silver, rigid, engraved, material-bound — and it also happens to match the mechanic exactly,
since CURSE prevents attacking rather than dealing harm.

The brief states this explicitly and makes corruption imagery an automatic reject on _concept_
grounds, not merely palette grounds.

## Surface finding worth recording

**An EVENT never occupies a Battlefield board slot, so `CreatureSlot` is not a review surface for
this card.** Verified in `apps/web/src/components/battlefield/CardPlayReveal.tsx`: an EVENT play
renders a 380 ms centre-of-board flash containing `Icon name="sword"` plus the card name — **no
artwork at all**.

The artwork therefore appears on exactly three surfaces: `CardView` 3:4, `CardDetailDrawer` 4:5 and
`HandCardPreview` 7:9. The 3:4 ratio still applies, reached through `CardView` rather than a board
slot.

The task's composition section says "CardView / CreatureSlot 3:4". That is harmless — the ratio is
identical either way — but the brief records the accurate surface list so the eventual review does
not go looking for a fifth panel that cannot exist. This mirrors Art Pack 02 Card 04, the RUNE, which
had the same situation.

## Deliberate correction carried over from Card 01

Card 01's brief asked for ~130 px of head clearance; the approved candidate delivered ~2–4 px under
the binding 4:5 cut. It passed, but with no margin, and that is now a recorded caveat in
`docs/art-pack-03.md`.

Card 02's brief does not repeat it. Alongside the technical safe band (rows 128–1408 under 4:5), it
imposes a **stricter working rule: nothing essential above row 260 or below row 1280**, giving ~130 px
of real clearance — and makes violating that an automatic reject _even though the technical band
would pass_. The hero object is placed at row ~770, within a few pixels of the exact 4:5 centre.

## Brief contents

All seventeen required sections are present and numbered: card/gameplay summary; visual thesis;
focal hierarchy; scene and action staging; seal object and material design; enemy arm and weapon
neutrality; environment; lighting and value structure; palette and gold budget; rune and VFX
language; rarity hierarchy; composition and crop-safe geometry; mobile and 92 px readability;
generation prompt; negative prompt; automatic reject conditions; final acceptance checklist.

Points worth flagging for review:

- **Focal hierarchy is defined explicitly**, since an EVENT has no face to anchor it: seal (primary,
  brightest, centre, only emissive) → halted weapon and forearm (secondary) → pale shallow
  background (tertiary, expected to vanish at thumbnail size).
- **The dark arm is dark by material, never by lighting.** It stays in the same bright diffuse light
  with visible form and highlights, and its darkest value is a mid-dark grey rather than black.
  Getting this wrong would import SHADOW's chiaroscuro through the back door — the exact drift that
  sank the flagship's Candidate 02.
- **RARE is signalled by engineered precision, not decoration.** The Acolyte's tablet is a plain slab;
  this seal is a mechanism with a hinge, banding and a lock block. Gold ceiling ~5%, between the
  Common's ~3% and the Legendary's broad filigree fields.
- **Enemy neutrality is specified against all six factions**, not just in the abstract — no crimson or
  ember, no violet, no translucency, no gold, no floral motif, no cosmic sheen, no grey mist.
- **A desaturation test** is required at 92 px: if the seal and the arm merge on value alone, the
  candidate fails regardless of how it looks at full size.

## Validation

Documentation-only, so no application lint, typecheck, test or build was required — and none was
needed, since no application or configuration file was touched.

| Check                                         | Result                                          |
| --------------------------------------------- | ----------------------------------------------- |
| `git diff --check`                            | PASS (clean)                                    |
| Prettier — the new brief                      | PASS                                            |
| All 17 required sections present and numbered | PASS (verified by heading extraction)           |
| Diff scope                                    | PASS — one new documentation file, nothing else |

## Known issues / caveats

1. **The brief is unvalidated against a real image**, by design. Its structural claims — that a blocky
   pale seal on a dark diagonal stays legible at 92 px, and that rows 260–1280 give comfortable
   margin — are derived from the crop arithmetic and from Card 01's measured outcome, not from a
   generated candidate. The first generation pass is the real test.
2. **The house-style question raised by Card 01 is not settled by this brief.** Card 01 shipped
   noticeably more photographic than the older painterly baseline, and the owner accepted that image.
   This brief follows the owner's locked instruction — cinematic realistic / semi-realistic, neither
   generic painterly fantasy nor sterile photobash — but if the intention is to pull Cards 02–04
   back toward the painterly end, §14's style clause is the line to change, and it should be changed
   before generation rather than after.
3. **No update to `docs/art-bible-01.md`.** The bible's PURIFICATION section still describes only the
   Legendary flagship. If Card 02 is approved, the faction would benefit from a short note on how
   non-character EVENT cards express material-bound rune magic. Out of scope here.

## Confirmed untouched

No image was generated. No candidate art was added. `apps/game-server/prisma/seed.ts`, Prisma schema
and migrations, gameplay, stats, card text, effects and rarity, `/admin/art-review` code, Battlefield
UI, sync scripts and workflows, and Railway / Vercel / production configuration were all left
unchanged. No workflow was dispatched and no production connection of any kind was made. Card 03 was
not started.

## Recommended next action

Owner review of `docs/art-review/seal-of-the-curse-master-art-brief.md`, with attention to three
decisions that are cheap to change now and expensive later:

1. **The binding-not-taint reading** of the Curse (§1). Everything else follows from it.
2. **The seal as a hand-and-guard clamp** (§5) — binding the hand to the hilt so the weapon cannot be
   released. An alternative staging (a cuff on the forearm, or a seal struck onto the blade itself)
   would change §4, §5 and §12 together.
3. **The style clause** in §14, per caveat 2 above.

Once approved, the next task is a generation pass against §14/§15. Per the standing constraint,
image generation is not available in the Claude Code session, so the master must be produced
externally and landed by commit on a branch — with
`git cat-file -s HEAD:<path>` confirming the committed blob size **before** pushing, the check that
has caught two ~15 KB truncations on this project.

Promotion, seed changes and production sync remain **unauthorised**. `SYNC-11-CARD-ART-PRODUCTION` is
consumed; a twelfth card would need a fresh owner confirmation and a pin repointed at a new
already-merged integration commit.
