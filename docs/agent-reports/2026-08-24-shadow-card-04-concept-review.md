# Agent Handoff

Task: SHADOW Card 04 (`rune-of-the-echoing-dusk`) — visual concept for owner review
Date: 2026-08-24
Branch: `main`
PR: none (task explicitly forbids a branch or PR; the handoff report is the only permitted repository write)
Base SHA: `3169fbf6f9a53f9d5a5c18c1b1ace37d749ce8e0`
Head SHA: the commit that adds this file, which becomes `main` HEAD on push. A report cannot contain
its own commit hash, so the exact final SHA is stated in the chat reply and is verifiable with
`git log -1 --format=%H -- docs/agent-reports/2026-08-24-shadow-card-04-concept-review.md`.
Status: **COMPLETE — concept delivered, awaiting owner approval.** No implementation performed.

## Scope

Concept review only, per `docs/CLAUDE_CURRENT_TASK.md`. No code, gameplay data, seed data, assets,
database, workflows or card files were touched. No image was generated or committed.

## Changed files

`docs/agent-reports/2026-08-24-shadow-card-04-concept-review.md` — this report. Nothing else.

## Repository sources reviewed

| Source | What was taken from it |
| --- | --- |
| `apps/game-server/prisma/seed.ts` | The canonical card already exists: `rune-of-the-echoing-dusk` / «Рунный Страж Эха», `RUNE`, `EPIC`, cost 3, tag `Shadow`, `ON_DEATH → SUMMON shadow-echo-token ×1`, currently on a generated placeholder. Also `shadow-echo-token` / «Эхо-Тень», 1/1, `isToken: true`, `isPlayable: false`. |
| `apps/web/src/components/battlefield/RuneZone.tsx` | RUNEs render as a 24×24 px `⬡` glyph in a red ring — **no artwork on the battlefield**. |
| `apps/web/src/components/battlefield/CardPlayReveal.tsx` | The rune play reveal shows `Icon name="rune"`, not the illustration. |
| `packages/ui/src/components/CardView.tsx` | Art area is `aspect-[3/4]`, `object-cover`. Size caps: `xs` 92 px, `sm` 140 px, `md` 200 px, `lg` 280 px. |
| `apps/web/src/components/battlefield/HandFan.tsx` | The hand fan renders `CardView` at `xs`/`sm`/`md`, so 92 px is a real production size. |
| `apps/web/src/app/admin/art-review/page.tsx` | Review surfaces and their crops; the page's `REVIEW_TARGETS` currently registers CHARACTER cards only. |
| `docs/art-bible-01.md` | SHADOW spec: crimson accent, chiaroscuro mandatory, forbidden drift list, and the SHADOW-exclusive "spectral memory/echo silhouettes" device — explicitly noted as doubling for the Эхо-Тень token. |
| `docs/art-pack-02.md` | Approved Cards 01–03 and the pack's format conventions. |
| `apps/web/public/art/cards/*.webp` | The three approved SHADOW illustrations, opened and compared for silhouette collision. |

## Proposed Card 04 visual concept

### Composition / silhouette

A vertical obsidian stele in a ruined underground gothic temple — **architecture, not anatomy**.

The silhouette break is engineered against one specific card. `whisper-of-the-forgotten` is already a
masked, faceless, cool-grey vertical figure; it is the real collision risk, not the two warriors.
Three moves defeat it:

- **Inverted taper.** Widest at a heavy stepped plinth, narrowing slightly to a fractured crown.
  Humanoids taper the other way. No shoulder line, no arms, no waist.
- **Mask low, not high.** The guardian mask is carved at roughly 40% of frame height — chest level,
  not head level. A face at the apex is what makes stone read as a person; moving it down removes
  that read immediately.
- **Broken outline.** A chunk missing from the crown, chains crossing outward from the ceiling, and
  descending stair geometry cutting the background diagonally, so the edge is irregular and
  asymmetric rather than a clean pillar.

Mass roughly 1:1.6, filling the centre third. Plinth and summoning seal occupy the lower third;
stairs and hanging chains recede behind.

### Palette / lighting

Near-black obsidian; cold violet-silver rim light down one edge; **dead-blue** glow living only
inside the fractures; grey ash suspended in the air. Funerary lights as small pale cold flames in
wall niches — never warm. Full chiaroscuro, with the seal itself as the dominant source.

Per the task brief: no orange, no dominant red, no fire treatment.

### Mechanic readability

Read top-to-bottom in three beats, no text required:

1. **Upper stele** — faint fallen-shadow silhouettes suspended *inside* the cracks: the dead, held.
2. **Mid, the mask** — the carved seal lit from within, mid-activation. The trigger.
3. **Lower seal** — one small Echo-Shadow half-formed, rising out of the plinth: smaller, simpler,
   no glow of its own.

`ally dies → seal activates → Echo-Shadow summoned`, as a vertical sequence. The trapped silhouettes
and the summoned token share one visual language, which is the point of the card, and that language
is the device `art-bible-01.md` already reserves to SHADOW and ties to Эхо-Тень.

### Surface constraints derived from the code

- **`CreatureSlot` is not a surface for this card.** RUNEs never render artwork on the battlefield.
  Live surfaces are Collection/hand `CardView` 3:4, `CardDetailDrawer` 4:5, `HandCardPreview` 7:9.
- **Binding legibility size is 92 px**, not the 160 px that constrained Card 03 — `CardView size="xs"`
  in the hand fan. Only one high-contrast shape survives there: the lit mask against black.
  Everything else must be secondary detail.
- **4:5 crop trims 128 px top and bottom** of a 1024×1536 master. Keep the crown peak below row ~200
  and the Echo-Shadow above row ~1400; the mask at 40% height (~row 615) is comfortably central.

### Generation-prompt core

> Vertical 2:3 dark fantasy key art, cinematic realistic painted illustration, premium collectible
> card game quality. An ancient obsidian ritual stele stands in a ruined underground gothic temple:
> a heavy stepped plinth narrowing to a fractured crown, no human anatomy, a faceless guardian mask
> carved into the stone at chest height. Dead-blue light glows only inside the fractures, where faint
> silhouettes of fallen shadows are held suspended. At the base, a carved seal is activating and a
> single small grey Echo-Shadow figure rises half-formed out of it, secondary and unlit. Descending
> stone stairs, hanging chains and drifting ash behind; small pale cold funerary flames in wall
> niches. Near-black obsidian, cold violet-silver rim light, grey ash. Chiaroscuro, volumetric dust,
> fine stone material detail. No warm light, no orange, no fire, no armour, no human figure. No text,
> no logo, no UI, no card frame.

## Validation

Not applicable — no code changed, so lint / typecheck / tests / build cannot exercise anything in
this diff. Verified instead that the working tree contains only this report
(`git status`, `git diff --check`).

## Visual QA / artifacts

None. No image was generated, downloaded or committed, per the task's explicit scope.

## Known issues

1. **Palette precedent needs an owner decision.** This is the first Art Pack 02 card to drop crimson
   entirely. `docs/art-bible-01.md` names `raido.red`/`redGlow` as SHADOW's accent and forbids
   "bright/saturated non-crimson accent colour." Dead-blue is neither bright nor saturated, and
   EPIC's violet frame will harmonise with it — but it sets a family precedent and should be an
   explicit call rather than a quiet drift. Card 03 already took one approved exception (amber).
2. **`/admin/art-review` cannot cleanly review a RUNE yet.** `FlagshipRow` builds a `stubUnit` for the
   `CreatureSlot` panel and its own comment assumes every target is a CHARACTER. It will not crash —
   `attack`/`health` fall back to 0 — but it would render a meaningless 0/0 creature slot for a rune.
   Skipping that panel for non-CHARACTER targets is a prerequisite for the eventual review step. Left
   untouched here, as the task forbids code changes.

## Confirmed untouched

No code, gameplay data, seed data, card definitions, assets, artwork files, database, Prisma schema
or migrations, workflows, Railway, Vercel, balance, card text, effects, rarity, cost, faction, or
Battlefield layout were changed. No branch was created, no PR opened, no image generated or
committed, and no unrelated branch or PR was modified. The only repository write is this report,
which the task designates as the sole permitted write.

## Recommended next action

**Wait for owner approval of this concept before generating or implementing any art.**

On approval, the sequence is: generate against the prompt core → verify the master's integrity
(sha256, byte size, RIFF-declared length, 1024×1536) → review through `/admin/art-review` after
adding non-CHARACTER support to that page → only then promote `artworkUrl` / `rightsStatus: 'owned'`
and update `docs/art-pack-02.md`. Transport the file by committing it to a branch; chat attachments
are re-encoded in transit and ZIP attachments do not reach the container at all, both established
during the Card 03 integration.
