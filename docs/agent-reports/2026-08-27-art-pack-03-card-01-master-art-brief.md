# Agent Handoff

Task: Art Pack 03 bootstrap — PURIFICATION Card 01 master-art brief (`docs/CLAUDE_CURRENT_TASK.md`)
Date: 2026-08-27
Branch: `main`
PR: none — documentation-only task, delivered per the "no PR" path of the `CLAUDE.md` Agent Handoff
Protocol
Base SHA: `fb5e357` (`docs(state): move current phase to PURIFICATION Art Pack 03 Card 01`)
Head SHA: `2c8639a81214749b1f4c7eb19a3a7e6d1278df56`
Status: COMPLETE — brief written and handed off for owner review. No artwork generated, integrated,
promoted or synced, as required.

## Scope

Produce exactly one new file — `docs/art-review/acolyte-of-the-white-rune-master-art-brief.md` — a
production-ready visual brief for PURIFICATION Card 01, `acolyte-of-the-white-rune` /
«Послушник Белой Руны» (CHARACTER / COMMON / cost 1, 1/3, on-play cleanse of Curse and Silence from
a chosen ally).

The task was explicitly brief-only. It authorised no image generation, no integration, no promotion,
and no production sync.

## Changed files

| File                                                                    | Change                            |
| ----------------------------------------------------------------------- | --------------------------------- |
| `docs/art-review/acolyte-of-the-white-rune-master-art-brief.md`         | **new**, 459 lines                |
| `docs/agent-reports/2026-08-27-art-pack-03-card-01-master-art-brief.md` | **new**, this report              |
| `docs/AGENT_STATE.md`                                                   | updated last, per protocol rule C |

No other file in the repository was modified.

## Implementation

### Source research (required step 1 and 2)

Three real repository sources were read before writing anything. Nothing in the brief is invented
faction language.

1. **`apps/game-server/prisma/seed.ts`, lines 815–827** — the card's real facts were read, not
   assumed: `rarity: 'COMMON'`, `cost: 1`, `attack: 1`, `health: 3`, `tags: ['Purification']`,
   `abilityText: 'При выходе: снимите Проклятие и Заглушение с выбранного союзника.'`, and
   `effectJson` = `ON_PLAY` → `CLEANSE` / `FRIENDLY_CHOSEN`. The other four PURIFICATION entries
   (`seal-of-the-curse`, `warden-of-the-barrier`, `rune-of-curse-breaking`,
   `high-warden-of-the-white-rune`) were read for context. **The file was not modified.**
2. **`docs/art-bible-01.md`** — the PURIFICATION section (lines 189–271) and the shared
   composition/crop spec (lines 86–127) were read in full. Everything the brief calls "locked" comes
   from there, including the art bible's own forward-looking note that future non-Legendary
   PURIFICATION cards must dial the gold trim back so it does not misread as a false rarity signal.
3. **`apps/web/public/art/cards/high-warden-of-the-white-rune.webp`** — the approved LEGENDARY
   flagship was **opened and visually audited**, not described from memory. That audit is what makes
   the hierarchy table in §8 concrete: full-body monument, wide pyramid silhouette, tall crown,
   dual-wield spear plus large round rune-shield, full plate under an enormous cape and layered
   ceremonial skirt, heavy gold filigree fields, cathedral facade with a rose-window halo, hanging
   order banners, a ranked helmeted honor guard, a wet mirror floor with an inscribed rune circle,
   strong backlight bloom, chin lifted under a heroic low camera.

### The central design problem, and how the brief resolves it

The task's own framing is the hard part: keep the card unmistakably PURIFICATION while making it read
as COMMON, without producing a miniature High Warden. The brief resolves this by inverting the
flagship's _structural_ devices while holding its _material_ devices constant.

**Held constant** (these are what make it PURIFICATION): white/silver/ivory base, clean pressed
never-tattered edges, bright diffuse near-shadowless lighting, cold light and frost motes,
engraved/material-bound rune magic rather than an open-palm cast, frontal near-symmetrical posture,
the same stone-and-silver material vocabulary.

**Inverted** (these are what make it COMMON):

- **Framing:** three-quarter length cut at mid-thigh, against the flagship's full-body monument. This
  is the single most load-bearing decision — it makes the figure larger in frame while carrying far
  less visual mass, which is what lets a COMMON card read at 92px without copying the flagship.
- **Silhouette:** narrow upright column against the flagship's wide pyramid. Distinguishable in pure
  black.
- **Head:** bare, no crown, no tiara, no head ornament, ordinary hair tone against the flagship's
  radiant gold-blond. Fastest available rank read.
- **Carried object:** one small hand-held white-stone rune tablet at chest height, no weapon at all,
  against the flagship's tall ceremonial spear plus huge round shield. This also renders the cleanse
  ability as material-bound rune magic, satisfying the faction's "never cast from an open palm" rule
  by construction.
- **Armour:** gorget, one half-pauldron, bracers over a fitted ivory cassock — cloth-first with
  minimal silver hardware, against the flagship's plate-first full harness.
- **Gold:** a hard, quantified budget — two hairlines, ≤ ~3% of canvas, never filigree fields. This
  is the brief's primary rarity-drift guard and it is written as an automatic-reject item.
- **Architecture:** a modest side-chapel cloister arcade with shallow depth, explicitly excluding
  every flagship device (rose window, halo, spires, banners, grand staircase, floor rune-circle, wet
  mirror floor).
- **Crowd:** none. PURIFICATION's ranked-congregation device signals hierarchy and command; a novice
  commands no formation. Where the flagship uses the crowd to say "leader", its absence here says
  "one of many".

### Crop safety (required, verified arithmetic)

The brief states the crop math explicitly rather than gesturing at it. Master 1024×1536, all three
shipped crops `object-cover` at centre anchor, master narrower per unit height than every target, so
width is never trimmed and all loss is vertical and evenly split:

| Crop | Consumer                   | Visible height | Total trim      | Top / bottom | Safe rows    |
| ---- | -------------------------- | -------------- | --------------- | ------------ | ------------ |
| 3:4  | `CardView`, `CreatureSlot` | 1365 px        | 171 px (~11.1%) | 85 / 86      | 86–1450      |
| 7:9  | `HandCardPreview`          | 1317 px        | 219 px (~14.3%) | 109 / 110    | 110–1426     |
| 4:5  | `CardDetailDrawer`         | 1280 px        | 256 px (~16.7%) | 128 / 128    | **128–1408** |

4:5 is the binding constraint; the brief gives target rows for head top (~260), eyeline (~330–380),
shoulders (~540–620), tablet centre (~790, within ~20 px of the exact 4:5 centre at row 768) and the
mid-thigh cut (~1380) — all inside 128–1408.

Worth flagging to the owner as a genuine improvement over the flagship: the approved High Warden
ships with an **accepted** crop loss (spearhead apex trimmed ~5.5–8.3% in all three crops). Because
this brief specifies no head ornament and no raised weapon, that entire class of loss is designed
out. The brief states that a candidate returning with a headpiece or raised staff has reintroduced a
solved problem and should be rejected on that ground alone, and the acceptance checklist requires
**zero** accepted crop losses for this card.

### Thumbnail legibility

Anchored to the real size caps in the codebase — `CardView` `xs` 92px, `sm` 140px, `md` 200px,
`lg` 280px, and `CreatureSlot` ~160px. The acceptance bar is 92 × 123 px. One non-obvious
constraint is called out: if the tablet, hands and cassock are all the same ivory, the ability read
dissolves at thumbnail size, so the tablet must carry a slightly cooler and slightly darker stone
value than the cloth to hold its edges.

### SHADOW differentiation

Kept explicit because the art bible records PURIFICATION and SHADOW as the closest structural pair in
the set, and flagship Candidate 02 was rejected for exactly this drift. This card avoids the trap
structurally (no cathedral facade, no crowd, no cast effect), but the brief still tables all eight
axes and names the two absolutely reserved SHADOW motifs — the translucent echo-crowd and the
actively-cast open-palm rune — as the two that sank Candidate 02.

### Brief contents

All fifteen required sections are present: card role and visual role; silhouette and pose; costume
and materials; environment and architecture; lighting; faction palette; VFX and rune language;
hierarchy differences vs. `high-warden-of-the-white-rune`; differentiation vs. SHADOW; crop-safe
composition through 3:4, 7:9 and 4:5; mobile and thumbnail readability; forbidden drift; a
ready-to-use generation prompt; a negative prompt; and a production acceptance checklist. A closing
"out of scope" section restates that nothing here authorises a write to `seed.ts`, `TARGET_SLUGS`,
the sync workflow's confirmation string or count assertions, or the production database.

The forbidden-drift list is grouped into rarity drift (8 items), faction drift (6) and structural
drift (6), all framed as automatic rejects. The acceptance checklist covers file integrity (including
the `VP8 ` vs `VP8X` container check and the RIFF-declared-size check that caught bad candidates
earlier in this project, plus the standing rule that the only working transport into this repository
is a commit on a branch), rank/rarity read, faction read, composition and crops, legibility, and
anatomy/cleanliness.

## Validation

Documentation-only, so per the task no application lint, typecheck, test or build was required —
and none was needed, since no application or configuration file was touched.

| Check             | Command                                                                                            | Result                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Whitespace errors | `git diff --check --cached`                                                                        | **PASS** (exit 0, no output)                            |
| Prettier          | `node_modules/.bin/prettier --check docs/art-review/acolyte-of-the-white-rune-master-art-brief.md` | **PASS** — "All matched files use Prettier code style!" |
| Diff scope        | `git diff --cached --stat`                                                                         | **PASS** — 1 file changed, 459 insertions, 0 deletions  |

Honest note on the Prettier step: the first `--check` run **failed**. Prettier 3.9.6 wanted markdown
table columns padded to equal width and `**text**` emphasis normalised to `_text_` in several places.
It was corrected with `prettier --write` and the re-run passed cleanly. Recording the failure rather
than only the final green result.

## Visual QA / artifacts

Not applicable — no artwork exists for this card yet, and none was generated. The only visual work
performed was the read-only audit of the already-approved `high-warden-of-the-white-rune.webp`, which
was opened and inspected but not modified, copied, or re-encoded.

No screenshots or QA artifacts were produced, so protocol rule E (never commit large QA artifacts) is
satisfied trivially.

## Known issues

1. **The brief is unvalidated against a real image**, by design. Its structural claims — that a
   narrow three-quarter column with a bare head and a small chest-height tablet stays legible at
   92 px and cannot be clipped at 4:5 — are derived from arithmetic and from the audited flagship,
   not from a generated candidate. The first generation pass is the real test of them.
2. **The "armor, not robes" tension is a deliberate judgement call.** The art bible states that
   PURIFICATION is armour rather than robes, written to stop the faction drifting into generic
   white-robed clerics. A COMMON novice in full plate would not read as junior, so this brief
   specifies cloth-first with minimal silver hardware (gorget, one half-pauldron, bracers) and says
   so explicitly rather than quietly departing from the bible. If the owner would rather hold the
   armour rule strictly even for COMMONs, §3 is the one section to revise, and the rank read would
   then have to lean harder on framing, gold budget and the absence of a crown.
3. **No update to `docs/art-bible-01.md`.** The bible's PURIFICATION section still describes only
   the LEGENDARY flagship. If Art Pack 03 Card 01 is approved, a short "COMMON tier" paragraph there
   would be worth adding so the scaled-down language becomes canonical rather than living only in
   this brief. That was out of scope here.
4. **`REQUIRED_SOURCE_COMMIT` in the production sync remains pinned to `23e83c99…`** with the
   ten-card `TARGET_SLUGS` and the `SYNC-10-CARD-ART-PRODUCTION` confirmation string. That is correct
   and untouched, but it means the sync script is already stale relative to any future Art Pack 03
   promotion — whenever Card 01 eventually ships, the pin, the slug list and every count assertion in
   `.github/workflows/production-card-art-sync.yml` must move together. Not actionable now; flagged
   so it is not discovered late.

## Confirmed untouched

Every hard scope exclusion in the task was honoured. Verified by `git diff --cached --stat` showing a
single new documentation file:

- `apps/game-server/prisma/seed.ts` — read only, not modified
- Prisma schema and migrations
- gameplay, balance, card text, effects, rarity, cost, stats, faction
- every artwork file, including `high-warden-of-the-white-rune.webp`, which was opened read-only
- `/admin/art-review` code
- Battlefield UI
- `apps/game-server/scripts/sync-production-card-art.ts` and
  `.github/workflows/production-card-art-sync.yml`
- Railway / Vercel configuration
- the production database — no connection was opened, no `--check` or `--apply` was run
- Art Pack 01 and Art Pack 02 approved assets, including the completed SHADOW pack and the executed
  ten-card sync

No image was generated, integrated, promoted or synced, as the task required.

## Recommended next action

Owner review of `docs/art-review/acolyte-of-the-white-rune-master-art-brief.md`, with attention to
three decisions that are cheap to change now and expensive later:

1. **Framing** — three-quarter length cut at mid-thigh, rather than the flagship's full body. This
   drives the silhouette, the crop plan and the thumbnail legibility argument.
2. **Cloth-first costume** — the "armor, not robes" tension in Known Issues §2.
3. **Gold budget** — two hairlines at ≤ ~3% of canvas, enforced as an automatic reject.

Once approved, the natural next task is a generation pass producing a 1024×1536 candidate against
§13/§14, committed to a candidate branch (the only transport that has ever worked on this project),
verified byte-exact — plain `VP8 ` container, RIFF-declared size matching actual size, decoded
dimensions 1024×1536, SHA-256 recorded — then reviewed through `/admin/art-review` at desktop and
390 px mobile widths before any promotion decision.

Promotion, seed changes and the production sync remain **unauthorised** and must stay that way until
a candidate is owner-approved.
