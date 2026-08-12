# Art Bible 01 — Kod Raido: Resonance

Living brief for **Art Pack 01**: real commissioned/licensed key art for the six Content Pack 01
faction-flagship Legendaries, to eventually replace their `generatePlaceholderArt()` SVG. This doc
is guidance and review tracking only.

**Scope guardrail:** this pass is documentation only. No image file is committed to the repo, no
card's `artworkUrl`/`coverUrl` or `rightsStatus` in `apps/game-server/prisma/seed.ts` changes, the
six-card drop-in pipeline and placeholders are untouched, and nothing here touches gameplay,
balance, Battlefield logic, card data, or economy. **A reference image never replaces a placeholder
on its own** — that only happens when the project owner explicitly marks a specific file as final
production artwork, a separate step from adding/locking a reference in this doc.

## Reference vs. production-format note

Some reference images arrive with a baked-in card frame, title, logo, stats, or other UI — that is
still valid as a **mood/style reference** (palette, lighting, materials, silhouette), but it must
never define the production asset format. The clean character illustration, with no overlay, is
always the primary reference for pose/rendering/environment. **Final production artwork format is
fixed:** vertical 2:3, no text, no logo, no stats, no UI, no baked-in card frame — a clean
illustration that the app's own `CardView` frame/badges/rarity glow render on top of at display
time, not art with a frame pre-composited into the file.

## Approval status — DO NOT mark Art Pack 01 FINAL APPROVED until all six faction references AND all six final production illustrations are reviewed

| # | Faction | Flagship card | Slug | Status |
| - | --- | --- | --- | --- |
| 1 | SHADOW | Некромант Сумеречного Ордена (Necromancer of the Twilight Order) | `necromancer-of-the-twilight-order` | **Reference 01 LOCKED (baseline)** — see below |
| 2 | PURIFICATION | Верховная Хранительница Руны | `high-warden-of-the-white-rune` | Pending reference |
| 3 | BOND | Матриарх Дома Весеннего Света | `matriarch-of-the-spring-light` | Pending reference |
| 4 | VEIL | Владыка Безымянной Тени | `lord-of-the-nameless-shadow` | Pending reference |
| 5 | MYSTERY | Хранитель Серого Тумана | `keeper-of-the-grey-mist` | Pending reference |
| 6 | COSMIC | Владыка Звёздного Потока | `lord-of-the-stellar-stream` | Pending reference |

Slugs for #2–6 confirmed directly against `apps/game-server/prisma/seed.ts`.

**Gate:** Art Pack 01 ships / merges as artwork only when every row above has both its reference
locked *and* its final production illustration reviewed. A locked reference (SHADOW) does not
authorize touching the placeholder pipeline for any card, including SHADOW's — that requires the
separate explicit "this file is final production artwork" call-out described above.

## Global Art Direction (baseline, already shipped)

From `packages/config/tailwind-preset.js` / `docs/visual-polish-01.md` — Dark Premium CCG +
cinematic energy + Mystic Technology + the Kod Raido rune language. Base palette near-black /
graphite / cold grey / mist-white; deep crimson (`raido.red` / `redGlow`) as an accent that is
never a flat fill; restrained gold (`raido.gold`) reserved for LEGENDARY; violet only for EPIC;
cyan only for the Track zone. Art Pack 01 key art extends this language into full character
illustration — it does not replace it.

Reference 01 (below) refines these pillars for the whole game, not just SHADOW:

- **Premium collectible-card key-art quality** — full painted/rendered illustration, not a game
  render or 3D asset flattened to 2D.
- **Cinematic anime/donghua-inspired semi-realism** — stylized proportions, but anatomically
  coherent; not chibi, not photobash.
- **Realistic facial rendering** — skin, eyes, and hair must read as painted/rendered with real
  material variation, not the flat "plastic AI skin" look. This is a quality bar for every faction,
  not a SHADOW-only note.
- **Strong, readable silhouette** even before color/detail resolve — every flagship must pass a
  silhouette-only readability check (see Composition spec below).
- **Dramatic rim lighting + deep shadow** as the default lighting approach across factions; each
  faction changes the *color and intensity* of the rim light and how much shadow dominates (see the
  differentiation table), not whether this technique is used at all.

## Composition & technical spec (all six factions)

- **Master canvas: vertical 2:3** (portrait, wider than the final in-game crop). The extra width
  gives room for environment/VFX bleed at the edges that a tighter crop can lose without losing the
  character.
- **Safe central area:** face, torso, signature weapon/object, and the major VFX read must all sit
  inside the center of the canvas, clear of the outer margins on all sides. This safe area is what
  gets cropped for the in-game card — currently `packages/ui/src/components/CardView.tsx` renders
  card art at `aspect-[3/4]` (Card Frame 2.0, the shipped version in `packages/ui/src/rarity.ts` /
  `docs/visual-polish-01.md`; if a "2.1" iteration exists elsewhere it isn't in this codebase yet —
  flag it if you're tracking it separately). A 2:3 master with the character composed centrally
  crops cleanly to that 3:4 in-game frame without losing the head or weapon.
- **Character remains the visual focus** even with a rich background — background architecture/VFX
  should frame and contextualize, never compete with, the character's silhouette and face.
- **Mobile legibility:** the character must stay clearly readable after the card is cropped and
  scaled down to hand/collection thumbnail size on a phone screen. Fine background detail can be
  lost at that scale; the character's read (pose, weapon, faction color) cannot.

## SHADOW — Орден Сумеречного Эха (Reference 01, LOCKED baseline)

**Reference 01** (received 2026-08-12, clean character illustration, mood/style reference — not
committed to the repo, not itself the final production file) is now **locked** as the primary
visual benchmark for SHADOW and one of the anchors for the overall game art direction. Target card:
**Necromancer of the Twilight Order** (`necromancer-of-the-twilight-order`, LEGENDARY, cost 5,
4/5 — its actual ability, "on play: return your first eligible Shadow character from the discard
pile at 100% stats," makes the "leader flanked by spectral echoes" composition in Reference 01 a
literal illustration of the card's mechanic, not just a mood match).

**Silhouette:** lean, upright, one arm raised/extended casting; not blocky or wide-stanced —
readable at thumbnail scale from outline alone.
**Costume/materials:** black layered cloth (coat/cloak) over light dark-metal clasp/accent armor —
never bulky plate.
**Architecture:** ruined monumental gothic structure — arches, distant spires, open ceiling to a
stormy sky.
**Lighting:** cold violet ambient fill + warm ember rim/accent light from the caster's hand;
dramatic rim lighting, deep controlled shadow.
**Signature weapon/object:** curved dark blade with red rune inlay.
**VFX language:** ash and embers drifting, not a particle-effect overload; magic reads as a single
controlled rune/sigil of light in the caster's palm, not a screen-filling spell effect.
**Palette:** near-black base, `FACTION_ACCENT.SHADOW` crimson (`#c24855`) layered over the shared
`raido.red`/`redGlow`, cold violet fog as the only non-warm color in the frame.
**Forbidden drift:** no bulky plate armor, no bright/saturated non-crimson accent color, no flat
even lighting (must stay chiaroscuro), no crowded VFX that competes with the character read, no
gore/graphic horror beyond ash-and-ruin implication.

**Background crowd device (SHADOW-exclusive):** spectral memory/echo silhouettes standing behind
the main character. This is reserved as SHADOW's signature — no other faction may use
ghostly-duplicate-figures-behind-the-lead as its background device. Also doubles as the visual for
the Эхо-Тень (Echo-Shadow) token, rendered smaller/simpler.

**Comparison against other approved references:** none yet — SHADOW is Reference 01, the first
locked. Every subsequent faction gets compared against it explicitly (see differentiation table
below and each new faction's own section going forward).

**Crop/readability check against the actual current implementation:** `CardView.tsx` renders card
art at `aspect-[3/4]` inside `rounded-card` (Card Frame 2.0 — the version actually shipped in this
codebase; no "2.1" exists here to verify against). A 2:3 master with the character's face, torso,
raised hand, and blade composed centrally crops cleanly to that 3:4 frame with no loss of read. Risk
to watch for once real art arrives: the echo-figures sit at the *edges* of a wide 2:3 composition —
on a narrow 3:4 in-game crop they may get clipped or lost entirely at hand/collection thumbnail
size. Recommend keeping at least one echo-figure silhouette readable within the safe central area,
not only at the canvas edges, so the motif survives the crop.

## The other five factions — briefed, awaiting their own reference

Per your direction, SHADOW's reference sets SHADOW's benchmark only. Each of the remaining factions
keeps its own materials, palette, architecture, silhouette, weapon, and VFX — none should read as
"SHADOW repainted." The table below is the standing brief until each faction's own reference image
arrives and gets folded in the same way SHADOW's was.

| Faction | Accent / glyph | Mood & architecture | Materials / silhouette | Light source | Signature weapon/prop | Background crowd device |
| --- | --- | --- | --- | --- | --- | --- |
| **SHADOW** — Орден Сумеречного Эха | `#c24855` crimson / ⟁ | Gothic ruin, mourning cult | Black layered cloth + light dark-metal accents | Cold violet ambient + warm ember accent from the caster's hand | Curved dark blade, red rune inlay | Translucent echo-figures behind the lead |
| **PURIFICATION** — Стражи Белой Руны | `#e7e2d3` ivory / ✦ | Ordered temple, clean stonework | Ceremonial plate/vestment, straight structured lines | Diffuse white/near-shadowless — the opposite of SHADOW's chiaroscuro | Raised rune-seal / warding sigil, radiant shield | None — a single figure, order/isolation rather than a crowd |
| **BOND** — Дом Весеннего Света | `#e0a458` amber / ❖ | Warm domestic sanctuary, spring garden | Soft flowing fabric, minimal armor | Golden-hour side light, low contrast, no harsh shadow | Staff or lantern glowing warm amber | Small warm light-motes drifting near allies, not humanoid figures |
| **VEIL** — Двор Безымянной Тени | `#9b7ec2` violet / ☾ | Court intrigue, moonlit ambush | Fitted dark leathers, half the figure dissolving into shadow | Single cool moonlight rim-light, rest near-total silhouette | Twin daggers | None — deliberately solitary; a crowd would contradict Hidden/ambush identity |
| **MYSTERY** — Архив Серого Тумана | `#9fb4c6` grey-blue / ◎ | Fog-drowned archive/library | Layered robes, indistinct lower body in fog | Flat, hazy, low-saturation — deliberately the least dramatic lighting of the six | Open scroll/tome with self-reordering glyphs | Floating pages/fragments, not figures |
| **COSMIC** — Наследники Звёздного Потока | `#6fe2ec` cyan / ✵ | Open starfield rather than architecture | Sleek fitted silhouette, energy visibly ascending off the body | Cyan rim-light against a dark starfield, energy visibly *building* | Ring of orbiting star-motes, denser toward Legendary rarity | Orbiting star-motes, not figures — energy scaling up is COSMIC's "crowd" |

Rule of thumb for the two closest-reading factions: **SHADOW and VEIL both read "dark,"** but
SHADOW is warm-ember and communal (a leader with followers, ruins, ash), while VEIL is cool-moonlight
and solitary (a lone figure dissolving into shadow, no crowd). If a piece could be mistaken for
either, push SHADOW warmer/more crowded and VEIL cooler/more isolated. Only SHADOW gets the
ghostly-echo-crowd device — it is reserved as SHADOW's signature, not a general "dark faction" motif.

## Process for each incoming reference (02–06)

For every new reference image supplied:

1. Map it to its exact existing flagship card and canonical `slug` (verified against
   `prisma/seed.ts`, not guessed).
2. Add/update that faction's dedicated section in this doc using the same structure as SHADOW's:
   Silhouette, Costume/materials, Architecture, Lighting, Signature weapon/object, VFX language,
   Palette, Forbidden drift, Background crowd device.
3. Explicitly compare it against every already-locked faction so the six stay visually distinct —
   call out the closest-reading neighbor and how this faction pushes away from it (as the
   SHADOW/VEIL note already does).
4. Re-verify the central safe-crop/readability claim against the actual current `CardView.tsx`
   implementation (not an assumed frame version) and flag any clipping risk.
5. Update the Approval status table row to reflect the locked reference.

After each reference is folded in, report: (1) what changed in this doc, (2) what visual rules are
now locked for that faction, (3) what differentiates it from already-approved factions, (4) any
crop/readability risk found against the real `CardView` implementation, (5) confirmation that no
gameplay/card-data/balance/Battlefield/database values changed.

**Reference 02 (PURIFICATION — High Warden of the White Rune, `high-warden-of-the-white-rune`) is
expected next** — not yet supplied as of this update; the table above still shows it Pending.

Only after all six rows show **both** a locked reference **and** a reviewed final production
illustration does Art Pack 01 become eligible to be called FINAL APPROVED — and even then, that
authorizes commissioning/production art, not an automatic change to `rightsStatus` or the in-game
placeholder pipeline. Swapping any specific card's placeholder happens only when the project owner
explicitly marks a specific file as final production artwork for that card — a separate, later step
with its own review, per card.
